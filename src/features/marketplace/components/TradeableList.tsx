import React, { useContext, useState } from "react";
import { useActor, useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import {
  CollectionName,
  MARKETPLACE_TAX,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

import tradeIcon from "assets/icons/trade.png";
import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import lockIcon from "assets/icons/lock.png";

import { TradeableDisplay } from "../lib/tradeables";
import { Button } from "components/ui/Button";
import {
  getBasketItems,
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { NumberInput } from "components/ui/NumberInput";
import { GameWallet } from "features/wallet/Wallet";
import { CONFIG } from "lib/config";
import { formatNumber } from "lib/utils/formatNumber";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { TradeableSummary } from "./TradeableSummary";
import { getTradeType } from "../lib/getTradeType";
import { ResourceList } from "./ResourceList";
import { KNOWN_ITEMS } from "features/game/types";
import Decimal from "decimal.js-light";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { ITEM_DETAILS } from "features/game/types/images";
import { calculateTradePoints } from "features/game/events/landExpansion/addTradePoints";
import { MachineState } from "features/game/lib/gameMachine";
import { getDayOfYear } from "lib/utils/time";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { StoreOnChain } from "./StoreOnChain";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";

const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

type TradeableListItemProps = {
  authToken: string;
  display: TradeableDisplay;
  id: number;
  floorPrice: number;
  onClose: () => void;
};

export const TradeableListItem: React.FC<TradeableListItemProps> = ({
  authToken,
  display,
  id,
  floorPrice,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [isSigning, setIsSigning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showItemInUseWarning, setShowItemInUseWarning] = useState(false);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [needsSync, setNeedsSync] = useState(false);

  const { openModal } = useContext(ModalContext);

  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);

  const { state } = gameState.context;

  const getDailyListings = () => {
    const today = getDayOfYear(new Date());
    const dailyListings = gameState.context.state.trades.dailyListings ?? {
      date: 0,
      count: 0,
    };

    return dailyListings.date === today ? dailyListings.count : 0;
  };

  const dailyListings = getDailyListings();

  const hasAccess = hasTradeReputation || dailyListings < 1;

  const tradeType = getTradeType({
    collection: display.type,
    id,
    trade: {
      sfl: price,
    },
  });

  const isResource =
    getKeys(TRADE_LIMITS).includes(display.name as InventoryItemName) &&
    display.type === "collectibles";

  // Check inventory count
  const getCount = () => {
    switch (display.type) {
      case "collectibles":
        return (
          state.inventory[display.name as InventoryItemName]?.toNumber() || 0
        );
      case "buds":
        return getChestBuds(state)[id] ? 1 : 0;
      case "wearables":
        return state.wardrobe[display.name as BumpkinItem] || 0;

      default:
        return 0;
    }
  };

  const getAvailable = () => {
    const isPlaceable =
      COLLECTIBLES_DIMENSIONS[display.name as CollectibleName];
    switch (display.type) {
      case "collectibles":
        if (isPlaceable) {
          return (
            getChestItems(state)[
              display.name as InventoryItemName
            ]?.toNumber() ?? 0
          );
        }

        return (
          getBasketItems(state.inventory)[
            display.name as InventoryItemName
          ]?.toNumber() ?? 0
        );
      case "buds":
        return getChestBuds(state)[id] ? 1 : 0;
      case "wearables":
        return availableWardrobe(state)[display.name as BumpkinItem] ?? 0;
      default:
        return 0;
    }
  };

  const getOnChainStatus = (name: string, collection: CollectionName) => {
    if (collection === "wearables") {
      const prevBalance = state.previousWardrobe[name as BumpkinItem] ?? 0;

      return prevBalance >= Math.max(1, quantity);
    }

    if (collection === "collectibles") {
      const prevBalance =
        state.previousInventory[name as InventoryItemName] ?? new Decimal(0);

      return prevBalance.gte(Math.max(1, quantity));
    }

    if (collection === "buds") return true;

    return false;
  };

  // Otherwise show the list item UI
  const submitListing = () => {
    if (count > 0 && available === 0) {
      setShowItemInUseWarning(true);
      return;
    }

    if (tradeType === "onchain") {
      const isItemOnChain = getOnChainStatus(display.name, display.type);

      if (!isItemOnChain) {
        setNeedsSync(true);
        return;
      }

      setIsSigning(true);
      return;
    }

    setShowConfirmation(true);
  };

  const confirm = async ({ signature }: { signature?: string }) => {
    gameService.send("marketplace.listed", {
      effect: {
        type: "marketplace.listed",
        itemId: id,
        collection: display.type,
        sfl: price,
        signature,
        quantity: Math.max(1, quantity),
        contract: CONFIG.MARKETPLACE_VERIFIER_CONTRACT,
      },
      authToken,
    });

    onClose();
  };

  const sign = async () => {
    const signature = await signTypedData(config, {
      primaryType: "Listing",
      types: {
        Listing: [
          { name: "farmId", type: "uint256" },
          { name: "collection", type: "string" },
          { name: "itemId", type: "uint256" },
          { name: "item", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "SFL", type: "uint256" },
        ],
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
      },
      message: {
        farmId: BigInt(gameState.context.nftId as number),
        collection: display.type,
        itemId: BigInt(id),
        item: display.name,
        quantity: BigInt(Math.max(1, quantity)),
        SFL: BigInt(price),
      },
      domain: {
        name: CONFIG.NETWORK === "mainnet" ? "Sunflower Land" : "TESTING",
        version: "1",
        chainId: BigInt(CONFIG.POLYGON_CHAIN_ID),
        verifyingContract:
          CONFIG.MARKETPLACE_VERIFIER_CONTRACT as `0x${string}`,
      },
    });

    confirm({ signature });
    setIsSigning(false);
  };

  const count = getCount();
  const available = getAvailable();

  if (showItemInUseWarning) {
    return (
      <div className="flex flex-col">
        <Label type="danger" className="my-1 ml-2" icon={lockIcon}>
          {t("marketplace.itemInUse")}
        </Label>
        <div className="p-2 mb-1">{t("marketplace.itemInUseWarning")}</div>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  if (needsSync) {
    return (
      <StoreOnChain
        onClose={onClose}
        itemName={display.name}
        actionType="listing"
      />
    );
  }

  const estTradePoints =
    price === 0
      ? 0
      : calculateTradePoints({
          sfl: price,
          points: tradeType === "instant" ? 1 : 3,
        }).multipliedPoints;

  if (showConfirmation) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("are.you.sure")}
          </Label>
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableSummary
            display={display}
            sfl={price}
            quantity={Math.max(1, quantity)}
            estTradePoints={estTradePoints}
          />
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)} className="mr-1">
            {t("cancel")}
          </Button>
          <Button onClick={() => confirm({})}>{t("confirm")}</Button>
        </div>
      </>
    );
  }

  if (isSigning) {
    return (
      <GameWallet action="marketplace">
        <>
          <div className="p-2">
            <Label type="danger" className="-ml-1 mb-2">
              {t("are.you.sure")}
            </Label>
            <p className="text-xs mb-2">{t("marketplace.signOffer")}</p>
            <TradeableSummary
              display={display}
              sfl={price}
              quantity={Math.max(1, quantity)}
              estTradePoints={estTradePoints}
            />
          </div>

          <div className="flex">
            <Button onClick={() => setIsSigning(false)} className="mr-1">
              {t("cancel")}
            </Button>
            <Button onClick={sign}>{t("marketplace.signAndList")}</Button>
          </div>
        </>
      </GameWallet>
    );
  }

  if (isResource) {
    return (
      <ResourceList
        inventoryCount={new Decimal(available)}
        itemName={KNOWN_ITEMS[id] as InventoryItemName}
        floorPrice={floorPrice}
        isSaving={false}
        onCancel={onClose}
        onList={submitListing}
        price={price}
        quantity={quantity}
        setPrice={setPrice}
        setQuantity={setQuantity}
      />
    );
  }

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
          {t("marketplace.listItem", {
            type: `${display.type.slice(0, display.type.length - 1)}`,
          })}
        </Label>
        {tradeType === "onchain" && (
          <Label type="formula" icon={walletIcon} className="my-1 mr-0.5">
            {t("marketplace.walletRequired")}
          </Label>
        )}

        {!hasAccess && (
          <RequiredReputation reputation={Reputation.Cropkeeper} />
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Box image={display.image} disabled />
          <span className="text-sm">{display.name}</span>
        </div>
        <div className="flex items-center mr-1">
          <Label type={available < 1 ? "danger" : "default"}>
            {t("marketplace.availableCount", { count: available })}
          </Label>
        </div>
      </div>
      {count < 1 ? (
        <>
          <div className="p-2">{t("marketplace.youDontOwn")}</div>
          <Button onClick={onClose}>{t("close")}</Button>
        </>
      ) : (
        <>
          <div className="flex flex-col p-2">
            <Label type="default" icon={sflIcon}>
              {t("bumpkinTrade.price")}
            </Label>
            <div className="my-2 -mx-2">
              <NumberInput
                value={price}
                onValueChange={(decimal) => setPrice(decimal.toNumber())}
                maxDecimalPlaces={tradeType === "onchain" ? 0 : 2}
                icon={sflIcon}
              />
              <p className="text-xxs ml-2">
                {`$${new Decimal(usd).mul(price).toFixed(2)}`}
              </p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs"> {t("bumpkinTrade.listingPrice")}</span>
              <p className="text-xs font-secondary">{`${price} SFL`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
              <p className="text-xs font-secondary">{`${formatNumber(
                price * 0.1,
                {
                  decimalPlaces: 1,
                  showTrailingZeros: false,
                },
              )} SFL`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                borderBottom: "1px solid #ead4aa",
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs">
                {t("bumpkinTrade.youWillReceive")}
              </span>
              <p className="text-xs font-secondary">{`${formatNumber(
                new Decimal(price).mul(1 - MARKETPLACE_TAX),
                {
                  decimalPlaces: 1,
                  showTrailingZeros: false,
                },
              )} SFL`}</p>
            </div>
            <div
              className="flex justify-between"
              style={{
                padding: "5px 5px 5px 2px",
              }}
            >
              <span className="text-xs">{`Trade Points earned`}</span>
              <div className="flex flex-row">
                <p className="text-xs font-secondary mr-1">{`${formatNumber(
                  new Decimal(estTradePoints),
                  {
                    decimalPlaces: 2,
                    showTrailingZeros: false,
                  },
                )}`}</p>
                <img src={ITEM_DETAILS["Trade Point"].image} />
              </div>
            </div>
            <Label type="default" icon={lockIcon} className="my-1 -ml-0.5">
              {t("marketplace.itemSecured")}
            </Label>
            <div className="text-xxs">
              {t("marketplace.itemSecuredWarning")}
            </div>
          </div>

          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("close")}</Button>
            <Button
              disabled={!price}
              onClick={submitListing}
              className="relative"
            >
              <span>{t("list")}</span>
              {tradeType === "onchain" && (
                <img
                  src={walletIcon}
                  className="absolute right-1 top-0.5 h-7"
                />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
