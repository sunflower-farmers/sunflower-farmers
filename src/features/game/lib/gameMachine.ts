import {
  createMachine,
  Interpreter,
  assign,
  TransitionsConfig,
  State,
  send,
  DoneInvokeEvent,
} from "xstate";
import {
  PLAYING_EVENTS,
  PlacementEvent,
  PLACEMENT_EVENTS,
  GameEvent,
  PlayingEvent,
  GameEventName,
} from "../events";

import {
  ART_MODE,
  Context as AuthContext,
} from "features/auth/lib/authMachine";
import { wallet } from "../../../lib/blockchain/wallet";

import {
  GameState,
  Inventory,
  InventoryItemName,
  PlacedLamp,
  Purchase,
} from "../types/game";
import { getPromoCode, loadSession } from "../actions/loadSession";
import { EMPTY } from "./constants";
import { autosave } from "../actions/autosave";
import { CollectibleName } from "../types/craftables";
import { ErrorCode, ERRORS } from "lib/errors";
import { makeGame } from "./transforms";
import { reset } from "features/farming/hud/actions/reset";
// import { getGameRulesLastRead } from "features/announcements/announcementsStorage";
import { checkProgress, processEvent } from "./processEvent";
import {
  landscapingMachine,
  SaveEvent,
} from "../expansion/placeable/landscapingMachine";
import { BuildingName } from "../types/buildings";
import { Context } from "../GameProvider";
import { isSwarming } from "../events/detectBot";
import { generateTestLand } from "../expansion/actions/generateLand";

import { loadGameStateForVisit } from "../actions/loadGameStateForVisit";
import { randomID } from "lib/utils/random";

import { buySFL } from "../actions/buySFL";
import { PlaceableLocation } from "../types/collectibles";
import {
  getGameRulesLastRead,
  getIntroductionRead,
  getSeasonPassRead,
} from "features/announcements/announcementsStorage";
import { depositToFarm } from "lib/blockchain/Deposit";
import Decimal from "decimal.js-light";
import { setOnboardingComplete } from "features/auth/actions/onboardingComplete";
import { Announcements } from "../types/announcements";
import {
  Currency,
  buyBlockBucks,
  buyBlockBucksMATIC,
} from "../actions/buyGems";
import { getSessionId } from "lib/blockchain/Session";
import { BumpkinItem } from "../types/bumpkin";
import { getAuctionResults } from "../actions/getAuctionResults";
import { AuctionResults } from "./auctionMachine";
import { mmoBus } from "features/world/mmoMachine";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { BudName } from "../types/buds";
import { gameAnalytics } from "lib/gameAnalytics";
import { portal } from "features/world/ui/community/actions/portal";
import { listRequest } from "../actions/listTrade";
import { deleteListingRequest } from "../actions/deleteListing";
import { fulfillTradeListingRequest } from "../actions/fulfillTradeListing";

import { CONFIG } from "lib/config";
import {
  TradeableName,
  sellMarketResourceRequest,
} from "../actions/sellMarketResource";
import { setCachedMarketPrices } from "features/world/ui/market/lib/marketCache";
import { MinigameName } from "../types/minigames";
import { OFFLINE_FARM } from "./landData";
import { isValidRedirect } from "features/portal/lib/portalUtil";
import {
  Effect,
  EFFECT_EVENTS,
  postEffect,
  StateName,
  StateNameWithStatus,
} from "../actions/effect";
import { TRANSACTION_SIGNATURES, TransactionName } from "../types/transactions";
import { getKeys } from "../types/decorations";
import { preloadHotNow } from "features/marketplace/components/MarketplaceHotNow";
import { hasFeatureAccess } from "lib/flags";
import { getBumpkinLevel } from "./level";
import { getLastTemperateSeasonStartedAt } from "./temperateSeason";
import { getActiveCalenderEvent, SeasonalEventName } from "../types/calendar";

// Run at startup in case removed from query params
const portalName = new URLSearchParams(window.location.search).get("portal");

const getRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("redirect");

  return code;
};

const getError = () => {
  const error = new URLSearchParams(window.location.search).get("error");

  return error;
};

export type PastAction = GameEvent & {
  createdAt: Date;
};

export type MaxedItem = InventoryItemName | BumpkinItem | "SFL";

export interface Context {
  farmId: number;
  state: GameState;
  farmAddress?: string;
  actions: PastAction[];
  sessionId?: string;
  errorCode?: ErrorCode;
  transactionId?: string;
  fingerprint?: string;
  maxedItem?: MaxedItem;
  goblinSwarm?: Date;
  deviceTrackerId?: string;
  revealed?: {
    coins: number;
    balance: string;
    inventory: Record<InventoryItemName, string>;
    wardrobe: Record<BumpkinItem, number>;
  };
  announcements: Announcements;
  prices: {
    sfl: {
      usd: number;
      timestamp: number;
    } | null;
  };
  auctionResults?: AuctionResults;
  promoCode?: string;
  moderation: Moderation;
  saveQueued: boolean;
  linkedWallet?: string;
  wallet?: string;
  nftId?: number;
  paused?: boolean;
  verified?: boolean;
  purchases: Purchase[];
  discordId?: string;
  fslId?: string;
  oauthNonce: string;
}

export type Moderation = {
  muted: {
    mutedAt: number;
    mutedBy: number;
    reason: string;
    mutedUntil: number;
  }[];
  kicked: {
    kickedAt: number;
    kickedBy: number;
    reason: string;
  }[];
};

type CommunityEvent = {
  type: "COMMUNITY_UPDATE";
  game: GameState;
};

type WalletUpdatedEvent = {
  type: "WALLET_UPDATED";
  linkedWallet: string;
  farmAddress: string;
  nftId: number;
};

type BuyBlockBucksEvent = {
  type: "BUY_GEMS";
  currency: Currency;
  amount: number;
};

type UpdateBlockBucksEvent = {
  type: "UPDATE_GEMS";
  amount: number;
};

type LandscapeEvent = {
  placeable?: BuildingName | CollectibleName | BudName;
  action?: GameEventName<PlacementEvent>;
  type: "LANDSCAPE";
  requirements?: {
    sfl: Decimal;
    ingredients: Inventory;
  };
  multiple?: boolean;
  maximum?: number;
  location: PlaceableLocation;
};

type VisitEvent = {
  type: "VISIT";
  landId: number;
};

type BuySFLEvent = {
  type: "BUY_SFL";
  maticAmount: string;
  amountOutMin: string;
};

type DepositEvent = {
  type: "DEPOSIT";
  sfl: string;
  itemIds: number[];
  itemAmounts: string[];
  wearableIds: number[];
  wearableAmounts: number[];
  budIds: number[];
};

type UpdateEvent = {
  type: "UPDATE";
  state: GameState;
};

type ListingEvent = {
  type: "LIST_TRADE";
  sellerId: number;
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
  signature?: string;
};

type DeleteTradeListingEvent = {
  type: "DELETE_TRADE_LISTING";
  sellerId: number;
  listingId: string;
  listingType: string;
};

type FulfillTradeListingEvent = {
  type: "FULFILL_TRADE_LISTING";
  sellerId: number;
  listingId: string;
  listingType: string;
};

type SellMarketResourceEvent = {
  type: "SELL_MARKET_RESOURCE";
  item: TradeableName;
  pricePerUnit: number;
};

export type UpdateUsernameEvent = {
  type: "UPDATE_USERNAME";
  username: string;
};

type PostEffectEvent = {
  type: "POST_EFFECT";
  effect: Effect;
  authToken: string;
};

type TransactEvent = {
  type: "TRANSACT";
  transaction: TransactionName;
  request: any;
};

export type BlockchainEvent =
  | {
      type: "SAVE";
    }
  | TransactEvent
  | WalletUpdatedEvent
  | CommunityEvent
  | ListingEvent
  | DeleteTradeListingEvent
  | FulfillTradeListingEvent
  | SellMarketResourceEvent
  | {
      type: "REFRESH";
    }
  | {
      type: "ACKNOWLEDGE";
    }
  | {
      type: "EXPIRED";
    }
  | {
      type: "CONTINUE";
      id?: string;
    }
  | {
      type: "RESET";
    }
  | {
      type: "DEPOSIT";
    }
  | {
      type: "PAUSE";
    }
  | {
      type: "PLAY";
    }
  | {
      type: "REVEAL";
    }
  | {
      type: "SKIP_MIGRATION";
    }
  | { type: "END_VISIT" }
  | {
      type: "PROVE_PERSONHOOD";
    }
  | {
      type: "PERSONHOOD_FINISHED";
      verified: boolean;
    }
  | {
      type: "PERSONHOOD_CANCELLED";
    }
  | GameEvent
  | LandscapeEvent
  | VisitEvent
  | BuySFLEvent
  | BuyBlockBucksEvent
  | UpdateBlockBucksEvent
  | DepositEvent
  | UpdateEvent
  | UpdateUsernameEvent
  | PostEffectEvent
  | { type: "EXPAND" }
  | { type: "SAVE_SUCCESS" }
  | { type: "UPGRADE" }
  | { type: "CLOSE" }
  | { type: "RANDOMISE" }
  | Effect; // Test only

// // For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(PLAYING_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: [
        {
          target: "hoarding",
          cond: (context: Context, event: PlayingEvent) => {
            const { valid } = checkProgress({
              state: context.state as GameState,
              action: event,
              farmId: context.farmId,
            });

            return !valid;
          },
          actions: assign((context: Context, event: PlayingEvent) => {
            const { maxedItem } = checkProgress({
              state: context.state as GameState,
              action: event,
              farmId: context.farmId,
            });

            return { maxedItem };
          }),
        },
        {
          actions: assign((context: Context, event: PlayingEvent) => ({
            state: processEvent({
              state: context.state as GameState,
              action: event,
              announcements: context.announcements,
              farmId: context.farmId,
            }) as GameState,
            actions: [
              ...context.actions,
              {
                ...event,
                createdAt: new Date(),
              },
            ],
          })),
        },
      ],
    }),
    {},
  );

const PLACEMENT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(PLACEMENT_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        actions: assign((context: Context, event: PlacementEvent) => ({
          state: processEvent({
            state: context.state as GameState,
            action: event,
            farmId: context.farmId,
          }) as GameState,
          actions: [
            ...context.actions,
            {
              ...event,
              createdAt: new Date(),
            },
          ],
        })),
      },
    }),
    {},
  );

const EFFECT_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  getKeys(EFFECT_EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        target: EFFECT_EVENTS[eventName],
      },
    }),
    {},
  );

const EFFECT_STATES = Object.values(EFFECT_EVENTS).reduce(
  (states, stateName) => ({
    ...states,
    [`${stateName}Success`]: {
      on: {
        CONTINUE: { target: "playing" },
      },
    },
    [`${stateName}Failure`]: {
      on: {
        CONTINUE: { target: "playing" },
        REFRESH: { target: "playing" },
      },
    },
    [stateName]: {
      entry: "setTransactionId",
      invoke: {
        src: async (context: Context, event: PostEffectEvent) => {
          const { effect, authToken } = event;

          if (context.actions.length > 0) {
            await autosave({
              farmId: Number(context.farmId),
              sessionId: context.sessionId as string,
              actions: context.actions,
              token: authToken,
              fingerprint: context.fingerprint as string,
              deviceTrackerId: context.deviceTrackerId as string,
              transactionId: context.transactionId as string,
            });
          }

          const { gameState, data } = await postEffect({
            farmId: Number(context.farmId),
            effect,
            token: authToken,
            transactionId: context.transactionId as string,
          });

          return { state: gameState, response: data };
        },
        onDone: [
          {
            target: `${stateName}Success`,
            cond: (_: Context, event: DoneInvokeEvent<any>) =>
              !event.data.state.transaction,
            actions: [
              assign((_, event: DoneInvokeEvent<any>) => ({
                actions: [],
                state: event.data.state,
              })),
            ],
          },
          // If there is a transaction on the gameState move into playing so that
          // the transaction flow can handle the rest of the flow
          {
            target: `playing`,
            actions: [
              assign((_, event: DoneInvokeEvent<any>) => ({
                actions: [],
                state: event.data.state,
              })),
            ],
          },
        ],
        onError: {
          target: `${stateName}Failure`,
          actions: "assignErrorMessage",
        },
      },
    },
  }),
  {},
);

export type BlockchainState = {
  value:
    | "loading"
    | "loadLandToVisit"
    | "landToVisitNotFound"
    | "visiting"
    | "gameRules"
    | "portalling"
    | "introduction"
    | "gems"
    | "playing"
    | "autosaving"
    | "buyingSFL"
    | "calendarEvent"
    | "revealing"
    | "revealed"
    | "genieRevealed"
    | "beanRevealed"
    // | "effectPending"
    | "effectSuccess"
    | "effectFailure"
    | "error"
    | "refreshing"
    | "swarming"
    | "hoarding"
    | "mailbox"
    | "transacting"
    | "depositing"
    | "landscaping"
    | "specialOffer"
    | "promo"
    | "trading"
    | "listing"
    | "listed"
    | "deleteTradeListing"
    | "tradeListingDeleted"
    | "fulfillTradeListing"
    | "sellMarketResource"
    | "sniped"
    | "tradeAlreadyFulfilled"
    | "priceChanged"
    | "buds"
    | "airdrop"
    | "offers"
    | "marketplaceSale"
    | "coolingDown"
    | "buyingBlockBucks"
    | "auctionResults"
    | "claimAuction"
    | "refundAuction"
    | "blacklisted"
    | "provingPersonhood"
    | "somethingArrived"
    | "seasonChanged"
    | "randomising"
    | "competition"
    | StateName
    | StateNameWithStatus; // TEST ONLY
  context: Context;
};

export type StateKeys = keyof Omit<BlockchainState, "context">;
export type StateValues = BlockchainState[StateKeys];

export type MachineState = State<Context, BlockchainEvent, BlockchainState>;

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const saveGame = async (
  context: Context,
  event: any,
  farmId: number,
  rawToken: string,
) => {
  const saveAt = new Date();

  // Skip autosave when no actions were produced or if playing ART_MODE
  if (context.actions.length === 0 || ART_MODE) {
    return {
      verified: true,
      saveAt,
      farm: context.state,
      announcements: context.announcements,
    };
  }

  const { verified, farm, announcements } = await autosave({
    farmId,
    sessionId: context.sessionId as string,
    actions: context.actions,
    token: rawToken,
    fingerprint: context.fingerprint as string,
    deviceTrackerId: context.deviceTrackerId as string,
    transactionId: context.transactionId as string,
  });

  // This gives the UI time to indicate that a save is taking place both when clicking save
  // and when autosaving
  await new Promise((res) => setTimeout(res, 500));

  return {
    saveAt,
    verified,
    farm,
    announcements,
  };
};

const handleSuccessfulSave = (context: Context, event: any) => {
  // Actions that occured since the server request
  const recentActions = context.actions.filter(
    (action) => action.createdAt.getTime() > event.data.saveAt.getTime(),
  );

  const updatedState = recentActions.reduce((state, action) => {
    return processEvent({
      state,
      action,
      announcements: context.announcements,
      farmId: context.farmId,
    });
  }, event.data.farm);

  return {
    actions: recentActions,
    state: updatedState,
    saveQueued: false,
    announcements: event.data.announcements,
  };
};

// Hashed eth 0 value
export const INITIAL_SESSION = "0x0";

export function startGame(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, BlockchainState>(
    {
      id: "gameMachine",
      initial: "loading",
      context: {
        fslId: "123",
        farmId:
          CONFIG.NETWORK === "mainnet" ? 0 : Math.floor(Math.random() * 1000),
        actions: [],
        state: EMPTY,
        sessionId: INITIAL_SESSION,
        announcements: {},
        prices: {
          sfl: {
            timestamp: Date.now(),
            usd: 1.23,
          },
        },
        moderation: {
          muted: [],
          kicked: [],
        },
        saveQueued: false,
        verified: !CONFIG.API_URL,
        purchases: [],
        oauthNonce: "",
      },
      states: {
        ...EFFECT_STATES,
        loading: {
          id: "loading",
          always: [
            {
              target: "loadLandToVisit",
              cond: () => window.location.href.includes("visit"),
            },
            {
              target: "error",
              cond: () => !!getError(),
              actions: assign({
                errorCode: (_) => getError() as ErrorCode,
              }),
            },
            {
              target: "notifying",
              cond: () => ART_MODE,
              actions: assign({
                state: (_context) => OFFLINE_FARM,
              }),
            },
          ],
          entry: () => {
            if (CONFIG.API_URL)
              preloadHotNow(authContext.user.rawToken as string);
          },
          invoke: {
            src: async (context) => {
              const fingerprint = "X";

              const response = await loadSession({
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              // If no farm go no farms route

              setOnboardingComplete();

              return {
                farmId: Number(response.farmId),
                isBlacklisted: response.isBlacklisted,
                state: response.game,
                sessionId: response.sessionId,
                fingerprint,
                deviceTrackerId: response.deviceTrackerId,
                announcements: response.announcements,
                moderation: response.moderation,
                promoCode: response.promoCode,
                farmAddress: response.farmAddress,
                analyticsId: response.analyticsId,
                linkedWallet: response.linkedWallet,
                nftId: response.nftId,
                wallet: response.wallet,
                verified: response.verified,
                purchases: response.purchases,
                discordId: response.discordId,
                fslId: response.fslId,
                oauthNonce: response.oauthNonce,
                prices: response.prices,
              };
            },
            onDone: [
              {
                target: "blacklisted",
                cond: (_, event) => event.data.isBlacklisted,
              },
              {
                target: "portalling",
                cond: () => !!portalName,
                actions: ["assignGame"],
              },

              {
                target: "notifying",
                actions: ["assignGame", "assignUrl", "initialiseAnalytics"],
              },
            ],
            onError: [
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        blacklisted: {},
        portalling: {
          id: "portalling",
          invoke: {
            src: async (context) => {
              const portalId = portalName as MinigameName;
              const { token } = await portal({
                portalId,
                token: authContext.user.rawToken as string,
                farmId: context.farmId,
              });

              const redirect = getRedirect() as string;

              if (!isValidRedirect(redirect)) {
                throw new Error("Invalid redirect");
              }

              window.location.href = `${redirect}?jwt=${token}`;
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },

        loadLandToVisit: {
          invoke: {
            src: async (_, event) => {
              let landId: number;

              // We can enter this state two ways
              // 1. Directly on load if the url has a visit path (/visit)
              // 2. From a VISIT event passed back to the machine which will include a farmId in the payload

              if (!(event as VisitEvent).landId) {
                landId = Number(window.location.href.split("/").pop());
              } else {
                landId = (event as VisitEvent).landId;
              }

              const { state } = await loadGameStateForVisit(Number(landId));

              return {
                state: makeGame(state),
                farmId: landId,
              };
            },
            onDone: {
              target: "visiting",
              actions: assign({
                state: (_context, event) => event.data.state,
                farmId: (_context, event) => event.data.farmId,
              }),
            },
            onError: {
              target: "landToVisitNotFound",
            },
          },
        },
        landToVisitNotFound: {
          entry: assign({
            state: () => EMPTY,
          }),
          on: {
            VISIT: {
              target: "loadLandToVisit",
            },
          },
        },
        visiting: {
          on: {
            VISIT: {
              target: "loadLandToVisit",
            },
            END_VISIT: {
              target: "loading",
            },
          },
        },
        notifying: {
          always: [
            {
              target: "gameRules",
              cond: () => {
                const lastRead = getGameRulesLastRead();

                // Don't show game rules if they have been read in the last 7 days
                // or if the user has come from a pwa install magic link
                return (
                  !lastRead ||
                  Date.now() - lastRead.getTime() > 7 * 24 * 60 * 60 * 1000
                );
              },
            },

            {
              target: "introduction",
              cond: (context) => {
                return (
                  context.state.bumpkin?.experience === 0 &&
                  !getIntroductionRead()
                );
              },
            },

            {
              target: "gems",
              cond: (context) => {
                return !!context.state.inventory["Block Buck"]?.gte(1);
              },
            },

            // TODO - FIX
            // {
            //   target: "mailbox",
            //   cond: (context) =>
            //     hasUnreadMail(context.announcements, context.state.mailbox),
            // },
            {
              target: "swarming",
              cond: () => isSwarming(),
            },
            {
              target: "specialOffer",
              cond: (context) =>
                (context.state.bumpkin?.experience ?? 0) > 100 &&
                !context.state.collectibles["Bull Run Banner"] &&
                !getSeasonPassRead(),
            },
            {
              target: "somethingArrived",
              cond: (context) => !!context.revealed,
            },

            {
              target: "seasonChanged",
              cond: (context) => {
                return (
                  hasFeatureAccess(context.state, "TEMPERATE_SEASON") &&
                  context.state.season.startedAt !==
                    getLastTemperateSeasonStartedAt()
                );
              },
            },

            {
              target: "calendarEvent",
              cond: (context) => {
                if (!hasFeatureAccess(context.state, "WEATHER_SHOP")) {
                  return false;
                }

                const game = context.state;

                const activeEvent = getActiveCalenderEvent({
                  game,
                });

                if (!activeEvent) return false;

                const isAcknowledged =
                  game?.calendar[activeEvent as SeasonalEventName]
                    ?.acknowledgedAt;

                return !isAcknowledged;
              },
            },

            // EVENTS THAT TARGET NOTIFYING OR LOADING MUST GO ABOVE THIS LINE

            // EVENTS THAT TARGET PLAYING MUST GO BELOW THIS LINE
            {
              target: "promo",
              cond: (context) => {
                return (
                  context.state.bumpkin?.experience === 0 &&
                  getPromoCode() === "crypto-com"
                );
              },
            },
            {
              target: "airdrop",
              cond: (context) => {
                const airdrop = context.state.airdrops?.find(
                  (airdrop) => !airdrop.coordinates,
                );

                return !!airdrop;
              },
            },

            {
              // auctionResults needs to be the last check as it transitions directly
              // to playing. It does not target notifying.
              target: "auctionResults",
              cond: (context: Context) => !!context.state.auctioneer.bid,
            },
            {
              target: "offers",
              cond: (context: Context) =>
                getKeys(context.state.trades.offers ?? {}).some(
                  (id) => !!context.state.trades.offers![id].fulfilledAt,
                ),
            },
            {
              target: "marketplaceSale",
              cond: (context: Context) =>
                getKeys(context.state.trades.listings ?? {}).some(
                  (id) => !!context.state.trades.listings![id].fulfilledAt,
                ),
            },
            {
              target: "competition",
              cond: (context: Context) => {
                if (!hasFeatureAccess(context.state, "ANIMAL_COMPETITION"))
                  return false;

                const level = getBumpkinLevel(
                  context.state.bumpkin?.experience ?? 0,
                );

                if (level <= 5) return false;

                const competition = context.state.competitions.progress.ANIMALS;

                // Show the competition introduction if they have not started it yet
                return !competition;
              },
            },
            {
              target: "playing",
            },
          ],
        },
        specialOffer: {
          on: {
            "banner.purchased": (GAME_EVENT_HANDLERS as any)[
              "banner.purchased"
            ],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        somethingArrived: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
              actions: assign((_) => ({
                revealed: undefined,
              })),
            },
          },
        },
        seasonChanged: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        calendarEvent: {
          on: {
            "calendarEvent.acknowledged": (GAME_EVENT_HANDLERS as any)[
              "calendarEvent.acknowledged"
            ],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        promo: {
          on: {
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },
        buds: {
          on: {
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },

        gameRules: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        mailbox: {
          on: {
            "message.read": (GAME_EVENT_HANDLERS as any)["message.read"],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },
        airdrop: {
          on: {
            "airdrop.claimed": (GAME_EVENT_HANDLERS as any)["airdrop.claimed"],
            CLOSE: {
              target: "playing",
            },
          },
        },
        offers: {
          on: {
            "offer.claimed": (GAME_EVENT_HANDLERS as any)["offer.claimed"],
            RESET: {
              target: "refreshing",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        marketplaceSale: {
          on: {
            "purchase.claimed": (GAME_EVENT_HANDLERS as any)[
              "purchase.claimed"
            ],
            RESET: {
              target: "refreshing",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        auctionResults: {
          entry: "setTransactionId",
          invoke: {
            src: async (context: Context) => {
              const {
                user: { rawToken },
              } = authContext;

              const auctionResults = await getAuctionResults({
                farmId: Number(context.farmId),
                token: rawToken as string,
                auctionId: context.state.auctioneer.bid?.auctionId as string,
                transactionId: context.transactionId as string,
              });

              return { auctionResults };
            },
            onDone: [
              {
                target: "claimAuction",
                cond: (_, event) =>
                  event.data.auctionResults.status === "winner",
                actions: assign((_, event) => ({
                  auctionResults: event.data.auctionResults,
                })),
              },
              {
                target: "refundAuction",
                cond: (_, event) =>
                  event.data.auctionResults.status === "loser" ||
                  event.data.auctionResults.status === "tiebreaker",
                actions: assign((_, event) => ({
                  auctionResults: event.data.auctionResults,
                })),
              },
              {
                target: "playing",
              },
            ],
            onError: {
              target: "playing",
            },
          },
        },
        claimAuction: {
          on: {
            TRANSACT: {
              target: "transacting",
            },
            CLOSE: {
              target: "playing",
            },
          },
        },
        refundAuction: {
          on: {
            "bid.refunded": (GAME_EVENT_HANDLERS as any)["bid.refunded"],
            CLOSE: {
              target: "autosaving",
            },
          },
        },
        playing: {
          id: "playing",
          entry: "clearTransactionId",
          invoke: {
            /**
             * An in game loop that checks if Blockchain becomes out of sync
             * It is a rare event but it saves a user from making too much progress that would not be synced
             */
            src: (context) => (cb) => {
              const interval = setInterval(
                async () => {
                  if (!context.farmAddress) return;

                  const sessionID = await getSessionId(
                    context.farmId as number,
                  );

                  if (sessionID !== context.sessionId) {
                    cb("EXPIRED");
                  }
                },
                1000 * 60 * 2,
              );

              return () => {
                clearInterval(interval);
              };
            },
            onError: [
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
          on: {
            ...EFFECT_EVENT_HANDLERS,
            ...GAME_EVENT_HANDLERS,
            UPDATE_USERNAME: {
              actions: assign((context, event) => ({
                state: {
                  ...context.state,
                  username: event.username,
                },
              })),
            },
            SAVE: {
              target: "autosaving",
            },
            TRANSACT: {
              target: "transacting",
            },
            BUY_GEMS: {
              target: "buyingBlockBucks",
            },
            REVEAL: {
              target: "revealing",
            },
            EXPIRED: {
              target: "error",
              actions: assign((_) => ({
                errorCode: ERRORS.SESSION_EXPIRED as ErrorCode,
              })),
            },
            RESET: {
              target: "refreshing",
            },
            DEPOSIT: {
              target: "depositing",
            },
            REFRESH: {
              target: "loading",
            },
            LANDSCAPE: {
              target: "landscaping",
            },
            RANDOMISE: {
              target: "randomising",
            },
            BUY_SFL: {
              target: "buyingSFL",
            },
            LIST_TRADE: { target: "listing" },
            // POST_EFFECT: { target: "effectPending" },
            DELETE_TRADE_LISTING: { target: "deleteTradeListing" },
            FULFILL_TRADE_LISTING: { target: "fulfillTradeListing" },
            SELL_MARKET_RESOURCE: { target: "sellMarketResource" },
            UPDATE_GEMS: {
              actions: assign((context, event) => ({
                state: {
                  ...context.state,
                  inventory: {
                    ...context.state.inventory,
                    Gem: (context.state.inventory["Gem"] ?? new Decimal(0)).add(
                      event.amount,
                    ),
                  },
                },
                purchases: [
                  ...context.purchases,
                  {
                    id: "Gem",
                    method: "XSOLLA",
                    purchasedAt: Date.now(),
                    usd: 1, // Placeholder
                  } as Purchase,
                ],
              })),
            },
            UPDATE: {
              actions: assign((_, event) => ({
                state: event.state,
              })),
            },
            PROVE_PERSONHOOD: {
              target: "provingPersonhood",
            },
          },
        },
        buyingSFL: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              await buySFL({
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
                matic: (event as BuySFLEvent).maticAmount,
                amountOutMin: (event as BuySFLEvent).amountOutMin,
              });
            },
            onDone: {
              target: "refreshing",
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        autosaving: {
          entry: "setTransactionId",
          id: "autosaving",
          on: {
            ...GAME_EVENT_HANDLERS,
            SAVE: {
              actions: assign({
                saveQueued: (c) => c.actions.length > 0,
              }),
            },
          },
          invoke: {
            src: async (context, event) => {
              const data = await saveGame(
                context,
                event,
                context.farmId as number,
                authContext.user.rawToken as string,
              );

              return data;
            },
            onDone: [
              {
                target: "autosaving",
                // If a SAVE was queued up, go back into saving
                cond: (c) => c.saveQueued,
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "seasonChanged",
                cond: (context, event) => {
                  if (!hasFeatureAccess(context.state, "TEMPERATE_SEASON")) {
                    return false;
                  }

                  return (
                    event.data.farm.season.startedAt !==
                    getLastTemperateSeasonStartedAt()
                  );
                },
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "calendarEvent",
                cond: (_, event) => {
                  if (!hasFeatureAccess(event.data.farm, "WEATHER_SHOP")) {
                    return false;
                  }

                  const game = event.data.farm;

                  const activeEvent = getActiveCalenderEvent({
                    game,
                  });

                  if (!activeEvent) return false;

                  const isAcknowledged =
                    game.calendar[activeEvent].acknowledgedAt;

                  return !isAcknowledged;
                },
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
              {
                target: "playing",
                actions: assign((context: Context, event) =>
                  handleSuccessfulSave(context, event),
                ),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        transacting: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              // Autosave just in case
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { transaction, request } = event as TransactEvent;

              const { game } = await TRANSACTION_SIGNATURES[transaction]({
                ...request,
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return {
                // sessionId: sessionId,
                farm: game,
              };
            },
            onDone: {
              target: "playing",
              actions: [
                assign((_, event) => ({
                  state: event.data.farm,
                  actions: [],
                })),
              ],
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign((_) => ({
                  actions: [],
                })),
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },

        buyingBlockBucks: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const transaction = await buyBlockBucks({
                farmId: Number(context.farmId),
                type: (event as BuyBlockBucksEvent).currency,
                amount: (event as BuyBlockBucksEvent).amount,
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              const response = await buyBlockBucksMATIC(transaction);

              return {
                ...response,
                amount: transaction.amount,
              };
            },
            onDone: {
              target: "playing",
              actions: assign((context, event) => ({
                state: {
                  ...context.state,
                  inventory: {
                    ...context.state.inventory,
                    Gem: (context.state.inventory["Gem"] ?? new Decimal(0)).add(
                      event.data.amount,
                    ),
                  },
                },
                purchases: [
                  ...context.purchases,
                  {
                    id: `${event.data.amount} Gem`,
                    method: "MATIC",
                    purchasedAt: Date.now(),
                    usd: 1, // Placeholder
                  },
                ],
              })),
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign((_) => ({
                  actions: [],
                })),
              },
              {
                target: "#error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },

        // Similar to autosaving, but for events that are only processed server side
        revealing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, e) => {
              // Grab the server side event to fire
              const { event } = e as { event: any; type: "REVEAL" };

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { farm, changeset } = await autosave({
                farmId: Number(context.farmId),
                sessionId: context.sessionId as string,
                actions: [event],
                token: authContext.user.rawToken as string,
                fingerprint: context.fingerprint as string,
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
              });

              return {
                event,
                farm,
                changeset,
              };
            },
            onDone: [
              {
                target: "beanRevealed",
                cond: (_, event) => event.data.event.type === "bean.harvested",
                actions: assign((context, event) => {
                  return {
                    // Remove events
                    actions: [],
                    // Update immediately with state from server except for collectibles
                    state: {
                      ...event.data.farm,
                      collectibles: {
                        ...event.data.farm.collectibles,
                        "Magic Bean": context.state.collectibles["Magic Bean"],
                      },
                    },
                    revealed: event.data.changeset,
                  };
                }),
              },
              {
                target: "genieRevealed",
                cond: (_, event) =>
                  event.data.event.type === "genieLamp.rubbed",
                actions: assign((context, event) => {
                  const lamps = context.state.collectibles["Genie Lamp"]?.map(
                    (lamp) => {
                      if (lamp.id === event.data.event.id) {
                        return {
                          ...lamp,
                          rubbedCount: (lamp.rubbedCount ?? 0) + 1,
                        };
                      }

                      return lamp;
                    },
                  );

                  return {
                    // Remove events
                    actions: [],
                    // Update immediately with state from server except for collectibles
                    state: {
                      ...event.data.farm,
                      collectibles: {
                        ...event.data.farm.collectibles,
                        "Genie Lamp": lamps,
                      },
                    },
                    revealed: event.data.changeset,
                  };
                }),
              },
              {
                target: "revealed",
                actions: assign((_, event) => ({
                  // Remove events
                  actions: [],
                  // Update immediately with state from server
                  state: event.data.farm,
                  revealed: event.data.changeset,
                })),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        revealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign((_, event) => ({
                revealed: undefined,
              })),
            },
          },
        },

        genieRevealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign((context, event) => {
                const shouldRemoveLamp = (lamp: PlacedLamp) =>
                  lamp.id === event.id && (lamp.rubbedCount ?? 0) >= 3;

                // Delete the Lamp from the collectibles after it's been rubbed 3 times
                const lamps = context.state.collectibles["Genie Lamp"];
                const newLamps = lamps?.filter(
                  (lamp) => !shouldRemoveLamp(lamp),
                );

                return {
                  state: {
                    ...context.state,
                    collectibles: {
                      ...context.state.collectibles,
                      "Genie Lamp": newLamps,
                    },
                  },
                  revealed: undefined,
                };
              }),
            },
          },
        },
        beanRevealed: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: assign((context, event) => {
                // Delete the Bean from the collectibles
                const beans = context.state.collectibles["Magic Bean"];
                const newBeans = beans?.filter(
                  (bean) => !(bean.id === event.id),
                );

                return {
                  state: {
                    ...context.state,
                    collectibles: {
                      ...context.state.collectibles,
                      "Magic Bean": newBeans,
                    },
                  },
                  revealed: undefined,
                };
              }),
            },
          },
        },
        listing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { sellerId, items, sfl, signature } = event as ListingEvent;

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const state = await listRequest({
                sellerId,
                token: authContext.user.rawToken as string,
                items,
                sfl,
                transactionId: context.transactionId as string,
                signature,
              });

              return { state };
            },
            onDone: [
              {
                target: "listed",
                actions: [
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.state,
                  })),
                ],
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        listed: {
          on: {
            CONTINUE: "playing",
          },
        },
        effectPending: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { effect } = event as PostEffectEvent;

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { gameState, data } = await postEffect({
                farmId: Number(context.farmId),
                effect,
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return { state: gameState, response: data };
            },
            onDone: [
              {
                target: "effectSuccess",
                actions: [
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.state,
                  })),
                ],
              },
            ],
            onError: {
              target: "effectFailure",
              actions: "assignErrorMessage",
            },
          },
        },
        effectFailure: {
          on: {
            ACKNOWLEDGE: "playing",
          },
        },
        effectSuccess: {
          on: {
            CONTINUE: "playing",
          },
        },
        deleteTradeListing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { listingId, listingType, sellerId } =
                event as DeleteTradeListingEvent;

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { farm, error } = await deleteListingRequest({
                sellerId,
                listingId,
                listingType,
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return { farm, error };
            },
            onDone: [
              {
                target: "tradeAlreadyFulfilled",
                cond: (_, event) => event.data.error === "ALREADY_BOUGHT",
                actions: [
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.farm,
                  })),
                ],
              },
              {
                target: "tradeListingDeleted",
                actions: [
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.farm,
                  })),
                ],
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        tradeListingDeleted: {
          on: {
            CONTINUE: "playing",
          },
        },
        fulfillTradeListing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { sellerId, listingId, listingType } =
                event as FulfillTradeListingEvent;

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { farm, error } = await fulfillTradeListingRequest({
                buyerId: Number(context.farmId),
                sellerId,
                listingId,
                listingType,
                token: authContext.user.rawToken as string,
                transactionId: context.transactionId as string,
              });

              return {
                farm,
                buyerId: String(context.farmId),
                sellerId: String(sellerId),
                listingId,
                error,
              };
            },
            onDone: [
              {
                target: "sniped",
                cond: (_, event) => event.data.error === "ALREADY_BOUGHT",
              },
              {
                target: "playing",
                actions: [
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.farm,
                  })),
                  (_, event) => {
                    mmoBus.send({
                      trade: {
                        buyerId: event.data.buyerId,
                        sellerId: event.data.sellerId,
                        tradeId: event.data.listingId,
                      },
                    });
                  },
                ],
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        sniped: {
          on: {
            CONTINUE: "playing",
          },
        },
        tradeAlreadyFulfilled: {
          on: {
            CONTINUE: "playing",
          },
        },
        sellMarketResource: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { item, pricePerUnit } = event as SellMarketResourceEvent;

              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { farm, prices, error } = await sellMarketResourceRequest({
                farmId: Number(context.farmId),
                token: authContext.user.rawToken as string,
                soldAt: new Date().toISOString(),
                item,
                pricePerUnit,
              });

              return {
                farm,
                error,
                prices,
              };
            },
            onDone: [
              {
                target: "priceChanged",
                cond: (_, event) => event.data.error === "PRICE_CHANGED",
              },
              {
                target: "playing",
                actions: [
                  (_context, event) => {
                    setCachedMarketPrices(event.data.prices);
                  },
                  assign((_, event) => ({
                    actions: [],
                    state: event.data.farm,
                  })),
                ],
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        priceChanged: {
          on: {
            CONTINUE: "playing",
          },
        },
        depositing: {
          invoke: {
            src: async (context, event) => {
              if (!wallet.getAccount()) throw new Error("No account");

              const {
                sfl,
                itemAmounts,
                itemIds,
                wearableIds,
                wearableAmounts,
                budIds,
              } = event as DepositEvent;

              await depositToFarm({
                account: wallet.getAccount() as `0x${string}`,
                farmId: context.nftId as number,
                sfl: sfl,
                itemIds: itemIds,
                itemAmounts: itemAmounts,
                wearableAmounts,
                wearableIds,
                budIds,
              });
            },
            onDone: {
              target: "refreshing",
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        refreshing: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, e) => {
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(context.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.user.rawToken as string,
                  fingerprint: context.fingerprint as string,
                  deviceTrackerId: context.deviceTrackerId as string,
                  transactionId: context.transactionId as string,
                });
              }

              const { success, changeset } = await reset({
                farmId: context.farmId,
                token: authContext.user.rawToken as string,
                fingerprint: context.fingerprint as string,
                transactionId: context.transactionId as string,
              });

              return { success, changeset };
            },
            onDone: [
              {
                target: "loading",
                actions: assign({
                  revealed: (_, event) => event.data.changeset,
                  actions: (_) => [],
                }),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        error: {
          id: "error",
          on: {
            CONTINUE: "playing",
            REFRESH: {
              target: "loading",
            },
          },
        },
        hoarding: {
          on: {
            TRANSACT: {
              target: "transacting",
            },
            ACKNOWLEDGE: {
              target: "playing",
            },
          },
        },
        introduction: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        competition: {
          on: {
            "competition.started": (GAME_EVENT_HANDLERS as any)[
              "competition.started"
            ],
            ACKNOWLEDGE: {
              target: "notifying",
            },
          },
        },

        gems: {
          on: {
            ACKNOWLEDGE: {
              target: "notifying",
            },
            "garbage.sold": (GAME_EVENT_HANDLERS as any)["garbage.sold"],
          },
        },

        swarming: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        landscaping: {
          invoke: {
            id: "landscaping",
            src: landscapingMachine,
            data: {
              placeable: (_: Context, event: LandscapeEvent) => event.placeable,
              action: (_: Context, event: LandscapeEvent) => event.action,
              requirements: (_: Context, event: LandscapeEvent) =>
                event.requirements,
              coordinates: { x: 0, y: 0 },
              collisionDetected: true,
              multiple: (_: Context, event: LandscapeEvent) => event.multiple,
              maximum: (_: Context, event: LandscapeEvent) => event.maximum,
              location: (_: Context, event: LandscapeEvent) => event.location,
            },
            onDone: {
              target: "autosaving",
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
          on: {
            ...PLACEMENT_EVENT_HANDLERS,
            SAVE: {
              actions: send(
                (context) =>
                  ({
                    type: "SAVE",
                    gameMachineContext: context,
                    rawToken: authContext.user.rawToken as string,
                    farmId: context.farmId,
                  }) as SaveEvent,
                { to: "landscaping" },
              ),
            },
            SAVE_SUCCESS: {
              actions: assign((context: Context, event: any) =>
                handleSuccessfulSave(context, event),
              ),
            },
          },
        },

        provingPersonhood: {
          on: {
            PERSONHOOD_FINISHED: {
              actions: assign({
                verified: (_context, event) => event.verified,
              }),
              target: "playing",
            },
            PERSONHOOD_CANCELLED: {
              target: "playing",
            },
          },
        },
        randomising: {
          invoke: {
            src: async () => {
              const { game } = await generateTestLand();

              return { game };
            },
            onDone: {
              target: "playing",
              actions: assign<Context, any>({
                state: (context, event) => ({
                  ...context.state,
                  ...makeGame(event.data.game),
                }),
              }),
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
      },
      on: {
        PAUSE: {
          actions: assign({
            paused: (_) => true,
          }),
        },
        PLAY: {
          actions: assign({
            paused: (_) => false,
          }),
        },
        COMMUNITY_UPDATE: {
          actions: assign({
            state: (_, event) => {
              return event.game;
            },
          }),
        },
        WALLET_UPDATED: {
          actions: assign({
            nftId: (_, event) => {
              return event.nftId;
            },
            farmAddress: (_, event) => {
              return event.farmAddress;
            },
            linkedWallet: (_, event) => {
              return event.linkedWallet;
            },
          }),
        },
      },
    },
    {
      actions: {
        initialiseAnalytics: (context, event: any) => {
          if (!ART_MODE) {
            gameAnalytics.initialise({
              id: event.data.analyticsId,
              experiments: context.state?.experiments ?? [],
            });
            onboardingAnalytics.initialise({
              id: context.farmId,
            });
            onboardingAnalytics.logEvent("login");
          }
        },
        assignUrl: (context) => {
          if (window.location.hash.includes("retreat")) return;
          if (window.location.hash.includes("world")) return;

          // if (!ART_MODE) {
          //   window.history.replaceState(
          //     null,
          //     "",
          //     `${window.location.pathname}#/land/${context.farmId}`
          //   );
          // }
        },
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
          actions: [],
        }),
        assignGame: assign<Context, any>({
          farmId: (_, event) => event.data.farmId,
          state: (_, event) => event.data.state,
          sessionId: (_, event) => event.data.sessionId,
          fingerprint: (_, event) => event.data.fingerprint,
          deviceTrackerId: (_, event) => event.data.deviceTrackerId,
          announcements: (_, event) => event.data.announcements,
          moderation: (_, event) => event.data.moderation,
          promoCode: (_, event) => event.data.promoCode,
          farmAddress: (_, event) => event.data.farmAddress,
          linkedWallet: (_, event) => event.data.linkedWallet,
          wallet: (_, event) => event.data.wallet,
          nftId: (_, event) => event.data.nftId,
          verified: (_, event) => event.data.verified,
          purchases: (_, event) => event.data.purchases,
          discordId: (_, event) => event.data.discordId,
          fslId: (_, event) => event.data.fslId,
          oauthNonce: (_, event) => event.data.oauthNonce,
          prices: (_, event) => event.data.prices,
        }),
        setTransactionId: assign<Context, any>({
          transactionId: () => randomID(),
        }),
        clearTransactionId: assign<Context, any>({
          transactionId: () => undefined,
        }),
      },
    },
  );
}
