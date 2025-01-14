import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import {
  CollectionName,
  TradeableDetails,
  Tradeable,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";
import { GameWallet } from "features/wallet/Wallet";
import { Context } from "features/game/GameProvider";
import confetti from "canvas-confetti";
import {
  BlockchainEvent,
  Context as ContextType,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { PurchaseModalContent } from "./PurchaseModalContent";
import { TradeableDisplay } from "../lib/tradeables";
import { formatNumber } from "lib/utils/formatNumber";
import { KNOWN_ITEMS } from "features/game/types";
import { useSelector } from "@xstate/react";
import { useParams } from "react-router";
import { getKeys } from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMobile } from "mobile-device-detect";
import Decimal from "decimal.js-light";
import { Reputation } from "features/game/lib/reputation";
import { hasReputation } from "features/game/lib/reputation";

type TradeableHeaderProps = {
  authToken: string;
  dailyListings: number;
  farmId: number;
  collection: CollectionName;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
  count: number;
  pricePerUnit?: number;
  onBack: () => void;
  onListClick: () => void;
  reload: () => void;
};

const _balance = (state: MachineState) => state.context.state.balance;
const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });
const _bertObsession = (state: MachineState) =>
  state.context.state.bertObsession;
const _npcs = (state: MachineState) => state.context.state.npcs;

export const TradeableHeader: React.FC<TradeableHeaderProps> = ({
  dailyListings,
  authToken,
  farmId,
  count,
  tradeable,
  display,
  onListClick,
  reload,
}) => {
  const { gameService } = useContext(Context);
  const balance = useSelector(gameService, _balance);
  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);
  const params = useParams();
  const bertObsession = useSelector(gameService, _bertObsession);
  const npcs = useSelector(gameService, _npcs);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const { t } = useAppTranslation();

  const cheapestListing = tradeable?.listings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, tradeable?.listings[0]);

  // Check if the item is a bert obsession and whether the bert obsession is completed
  const isItemBertObsession = bertObsession?.name === display.name;
  const obsessionCompletedAt = npcs?.bert?.questCompletedAt;
  const isBertsObesessionCompleted =
    !!obsessionCompletedAt &&
    bertObsession &&
    obsessionCompletedAt >= bertObsession.startDate &&
    obsessionCompletedAt <= bertObsession.endDate;

  // Handle instant purchase
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasingSuccess",
    "playing",
    reload,
    cheapestListing?.type === "instant",
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    confetti,
    cheapestListing?.type === "instant",
  );

  // Auto close this success modal because the transaction modal will be shown
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    () => {
      gameService.send("CONTINUE");
      setShowPurchaseModal(false);
    },
    cheapestListing?.type === "onchain",
  );

  const isResources =
    getKeys(TRADE_LIMITS).includes(KNOWN_ITEMS[Number(params.id)]) &&
    params.collection === "collectibles";

  const showBuyNow =
    !isResources &&
    cheapestListing &&
    tradeable?.isActive &&
    // Don't show buy now if the listing is mine
    cheapestListing.listedById !== farmId;
  const showWalletRequired = showBuyNow && cheapestListing?.type === "onchain";
  // const showFreeListing = !isVIP && dailyListings === 0;

  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  return (
    <>
      {cheapestListing && (
        <Modal
          show={showPurchaseModal}
          onHide={() => setShowPurchaseModal(false)}
        >
          <Panel>
            {cheapestListing.type === "onchain" ? (
              <GameWallet action="marketplace">
                <PurchaseModalContent
                  authToken={authToken}
                  listingId={cheapestListing.id}
                  price={cheapestListing?.sfl ?? 0}
                  tradeable={tradeable as Tradeable}
                  onClose={() => setShowPurchaseModal(false)}
                  listing={cheapestListing}
                />
              </GameWallet>
            ) : (
              <PurchaseModalContent
                authToken={authToken}
                listingId={cheapestListing.id}
                price={cheapestListing?.sfl ?? 0}
                tradeable={tradeable as Tradeable}
                onClose={() => setShowPurchaseModal(false)}
                listing={cheapestListing}
              />
            )}
          </Panel>
        </Modal>
      )}
      <InnerPanel className="w-full mb-1">
        <div className="p-2 pt-1">
          <div className="flex flex-wrap items-center justify-between mb-3 space-y-1">
            <div
              className={classNames(
                "flex items-center justify-between w-full",
                {
                  "w-full": isMobile && showWalletRequired,
                },
              )}
            >
              <Label
                type="default"
                className="mr-0 sm:mr-3"
                icon={
                  isResources
                    ? ITEM_DETAILS[KNOWN_ITEMS[Number(params.id)]].image
                    : undefined
                }
              >
                {t("marketplace.available", {
                  count: Math.floor(count),
                })}
              </Label>
              {showWalletRequired && (
                <Label type="formula" icon={walletIcon}>
                  {t("marketplace.walletRequired")}
                </Label>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap">
            {!isResources && (
              <div className="flex items-center mr-2 sm:mb-0.5 -ml-1">
                <>
                  <img src={sflIcon} className="h-8 mr-2" />
                  <div
                    className={classNames(
                      !tradeable ? "loading-fade-pulse" : "",
                    )}
                  >
                    <p className={classNames("text-base")}>
                      {!tradeable
                        ? "0.00 SFL"
                        : `${formatNumber(cheapestListing?.sfl ?? 0, {
                            decimalPlaces: 2,
                            showTrailingZeros: true,
                          })} SFL`}
                    </p>
                    <p className="text-xs">
                      {`$${new Decimal(usd)
                        .mul(cheapestListing?.sfl ?? 0)
                        .toFixed(2)}`}
                    </p>
                  </div>
                </>
              </div>
            )}
            {isResources ? (
              <div className="flex h-full items-center mr-2 sm:mb-0.5 -ml-1">
                <>
                  <div className="flex flex-col space-y-1">
                    <div className="flex">
                      <img src={sflIcon} className="h-8 mr-2" />
                      {tradeable ? (
                        <p className="text-base">
                          {t("marketplace.pricePerUnit", {
                            price: tradeable.floor
                              ? formatNumber(tradeable.floor, {
                                  decimalPlaces: 4,
                                  showTrailingZeros: true,
                                })
                              : "?",
                          })}
                        </p>
                      ) : (
                        <>
                          <span className="text-base loading-fade-pulse">
                            {t("marketplace.pricePerUnit", {
                              price: "0.0000",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              </div>
            ) : (
              // Dummy div to keep the layout consistent
              <div className="flex items-center mr-2 sm:mb-0.5 -ml-1" />
            )}
            {/* Desktop display */}
            <div className="flex-col hidden sm:flex sm:visible sm:w-auto">
              <div className="flex flex-row items-end justify-end w-full">
                {showBuyNow && (
                  <Button
                    onClick={() => setShowPurchaseModal(true)}
                    disabled={!balance.gt(cheapestListing.sfl)}
                    className="mr-1 w-full sm:w-auto"
                  >
                    {t("marketplace.buyNow")}
                  </Button>
                )}
                {tradeable?.isActive && (
                  <Button
                    disabled={
                      !count ||
                      (!hasTradeReputation && dailyListings >= 1) ||
                      (isItemBertObsession &&
                        isBertsObesessionCompleted &&
                        !isResources)
                    }
                    onClick={onListClick}
                    className="w-full sm:w-auto"
                  >
                    {t("marketplace.listForSale")}
                  </Button>
                )}
              </div>
              <div className="mt-1">
                {isItemBertObsession &&
                  isBertsObesessionCompleted &&
                  !isResources && (
                    <Label type="danger">
                      {`You have completed Bert's Obsession recently`}
                    </Label>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* Mobile display */}
        <div className="flex flex-col items-center sm:hidden w-full sm:w-auto">
          <div className="flex items-center justify-between w-full">
            {showBuyNow && (
              <Button
                onClick={() => setShowPurchaseModal(true)}
                disabled={!balance.gt(cheapestListing.sfl)}
                className="mr-1 w-full sm:w-auto"
              >
                {t("marketplace.buyNow")}
              </Button>
            )}
            {tradeable?.isActive && (
              <Button
                onClick={onListClick}
                disabled={
                  !count ||
                  (!hasTradeReputation && dailyListings >= 1) ||
                  (isItemBertObsession &&
                    isBertsObesessionCompleted &&
                    !isResources)
                }
                className="w-full sm:w-auto"
              >
                {t("marketplace.listForSale")}
              </Button>
            )}
          </div>
          <div className="mt-1">
            {isItemBertObsession &&
              isBertsObesessionCompleted &&
              !isResources && (
                <Label type="danger">
                  {`You have completed Bert's Obsession recently`}
                </Label>
              )}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
