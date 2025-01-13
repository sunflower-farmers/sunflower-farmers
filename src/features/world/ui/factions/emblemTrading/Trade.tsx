import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import token from "assets/icons/sfl.webp";
import {
  FactionEmblem,
  GameState,
  Inventory,
  InventoryItemName,
  IslandType,
  TradeListing,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";
import tradeIcon from "assets/icons/trade.png";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { Label } from "components/ui/Label";
import { FloorPrices } from "features/game/actions/getListingsFloorPrices";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { VIPAccess } from "features/game/components/VipAccess";
import { NumberInput } from "components/ui/NumberInput";
import {
  EMBLEM_TRADE_MINIMUMS,
  EMBLEM_TRADE_LIMITS,
} from "features/game/actions/tradeLimits";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CannotTrade } from "../../CannotTrade";
import { Reputation } from "features/game/lib/reputation";
import { hasReputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { getDayOfYear } from "lib/utils/time";
import { hasVipAccess } from "features/game/lib/vipAccess";

const MAX_SFL = 150;
type Items = Partial<Record<InventoryItemName, number>>;

const ListTrade: React.FC<{
  inventory: Inventory;
  onList: (items: Items, sfl: number) => void;
  onCancel: () => void;
  isSaving: boolean;
  floorPrices: FloorPrices;
  emblem: FactionEmblem;
}> = ({ inventory, onList, onCancel, isSaving, floorPrices, emblem }) => {
  const { t } = useAppTranslation();
  const [quantity, setQuantity] = useState(new Decimal(0));
  const [sfl, setSfl] = useState(new Decimal(0));

  const maxSFL = sfl.greaterThan(MAX_SFL);

  const unitPrice = quantity.equals(0)
    ? new Decimal(0)
    : sfl.dividedBy(quantity);
  const tooLittle =
    !!quantity && quantity.lessThan(EMBLEM_TRADE_MINIMUMS[emblem] ?? 0);

  const isTooHigh =
    !!sfl &&
    !!quantity &&
    !!floorPrices[emblem] &&
    new Decimal(floorPrices[emblem] ?? 0).mul(1.2).lt(unitPrice);

  const isTooLow =
    !!sfl &&
    !!quantity &&
    !!floorPrices[emblem] &&
    new Decimal(floorPrices[emblem] ?? 0).mul(0.8).gt(unitPrice);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Box image={ITEM_DETAILS[emblem].image} disabled />
          <span className="text-sm">{emblem}</span>
        </div>
        <div className="flex flex-col items-end pr-1">
          <Label
            type={
              (inventory?.[emblem] ?? new Decimal(0)).lt(quantity)
                ? "danger"
                : "info"
            }
            className="my-1"
          >
            {t("bumpkinTrade.available")}
          </Label>
          <span className="text-sm mr-1">
            {formatNumber(inventory?.[emblem] ?? new Decimal(0), {
              decimalPlaces: 0,
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label
          type={
            unitPrice.lessThan(floorPrices[emblem] ?? 0)
              ? "danger"
              : unitPrice.greaterThan(floorPrices[emblem] ?? 0)
                ? "success"
                : "warning"
          }
          className="my-1"
        >
          {t("bumpkinTrade.floorPrice", {
            price: floorPrices[emblem]
              ? formatNumber(floorPrices[emblem] ?? 0, {
                  decimalPlaces: 4,
                })
              : "?",
          })}
        </Label>
        {isTooLow && (
          <Label type="danger" className="my-1 ml-2 mr-1">
            {t("bumpkinTrade.minimumFloor", {
              min: formatNumber(
                new Decimal(floorPrices[emblem] ?? 0).mul(0.8),
                {
                  decimalPlaces: 4,
                },
              ),
            })}
          </Label>
        )}
        {isTooHigh && (
          <Label type="danger" className="my-1 ml-2 mr-1">
            {t("bumpkinTrade.maximumFloor", {
              max: formatNumber(
                new Decimal(floorPrices[emblem] ?? 0).mul(1.2),
                {
                  decimalPlaces: 4,
                },
              ),
            })}
          </Label>
        )}
      </div>

      <div className="flex">
        <div className="w-1/2 mr-1">
          <div className="flex items-center">
            <Label
              icon={SUNNYSIDE.icons.basket}
              className="my-1 ml-2"
              type="default"
            >
              {t("bumpkinTrade.quantity")}
            </Label>
            {quantity.greaterThan(EMBLEM_TRADE_LIMITS[emblem] ?? 0) && (
              <Label type="danger" className="my-1 ml-2 mr-1">
                {t("bumpkinTrade.max", {
                  max: EMBLEM_TRADE_LIMITS[emblem] ?? 0,
                })}
              </Label>
            )}
            {tooLittle && (
              <Label type="danger" className="my-1 ml-2 mr-1">
                {t("bumpkinTrade.min", {
                  min: EMBLEM_TRADE_MINIMUMS[emblem] ?? 0,
                })}
              </Label>
            )}
          </div>

          <NumberInput
            value={quantity}
            maxDecimalPlaces={0}
            isOutOfRange={
              inventory[emblem]?.lt(quantity) ||
              quantity.greaterThan(EMBLEM_TRADE_LIMITS[emblem] ?? 0) ||
              quantity.equals(0)
            }
            onValueChange={(value) => {
              setQuantity(value);

              // auto generate price
              if (floorPrices[emblem]) {
                const estimated = setPrecision(
                  new Decimal(floorPrices[emblem] ?? 0).mul(value),
                );
                setSfl(estimated);
              }
            }}
          />
        </div>
        <div className="flex-1 flex flex-col items-end">
          <div className="flex items-center">
            {sfl.greaterThan(MAX_SFL) && (
              <Label type="danger" className="my-1 ml-2 mr-1">
                {t("bumpkinTrade.max", { max: MAX_SFL })}
              </Label>
            )}
            <Label icon={token} type="default" className="my-1 ml-2 mr-1">
              {t("bumpkinTrade.price")}
            </Label>
          </div>
          <NumberInput
            value={sfl}
            maxDecimalPlaces={4}
            isRightAligned={true}
            isOutOfRange={maxSFL || sfl.equals(0) || isTooHigh || isTooLow}
            onValueChange={(value) => {
              setSfl(value);
            }}
          />
        </div>
      </div>

      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("bumpkinTrade.listingPrice")}</span>
        <p className="text-xs">{`${formatNumber(sfl, {
          decimalPlaces: 4,
          showTrailingZeros: true,
        })} SFL`}</p>
      </div>
      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs">
          {t("bumpkinTrade.pricePerUnit", { resource: emblem })}
        </span>
        <p className="text-xs">
          {quantity.equals(0)
            ? "0.0000 SFL"
            : `${formatNumber(unitPrice, {
                decimalPlaces: 4,
                showTrailingZeros: true,
              })} SFL`}
        </p>
      </div>
      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
        <p className="text-xs">{`${formatNumber(sfl.mul(0.1), {
          decimalPlaces: 4,
          showTrailingZeros: true,
        })} SFL`}</p>
      </div>
      <div
        className="flex justify-between"
        style={{
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("bumpkinTrade.youWillReceive")}</span>
        <p className="text-xs">{`${formatNumber(sfl.mul(0.9), {
          decimalPlaces: 4,
          showTrailingZeros: true,
        })} SFL`}</p>
      </div>
      <div className="flex mt-2">
        <Button onClick={onCancel} className="mr-1">
          {t("bumpkinTrade.cancel")}
        </Button>
        <Button
          disabled={
            tooLittle ||
            isTooHigh ||
            isTooLow ||
            maxSFL ||
            quantity.gt(inventory?.[emblem] ?? new Decimal(0)) ||
            quantity.gt(EMBLEM_TRADE_LIMITS?.[emblem] ?? new Decimal(0)) ||
            quantity.equals(0) || // Disable when quantity is 0
            sfl.equals(0) || // Disable when sfl is 0
            isSaving
          }
          onClick={() => onList({ [emblem]: quantity }, sfl.toNumber())}
        >
          {t("bumpkinTrade.list")}
        </Button>
      </div>
    </>
  );
};

const TradeDetails: React.FC<{
  trade: TradeListing;
  isOldListing: boolean;
  onCancel: () => void;
  onClaim: () => void;
}> = ({ trade, onCancel, onClaim, isOldListing }) => {
  const { t } = useAppTranslation();

  if (trade.boughtAt) {
    return (
      <div>
        <OuterPanel>
          <div className="flex justify-between">
            <div>
              <div className="flex flex-wrap">
                {getKeys(trade.items).map((name) => (
                  <Box
                    image={ITEM_DETAILS[name as InventoryItemName].image}
                    count={new Decimal(trade.items[name] ?? 0)}
                    disabled
                    key={name}
                  />
                ))}

                <div>
                  <Label type="success" className="ml-1 mt-0.5">
                    {t("bought")}
                  </Label>
                  <div className="flex items-center mr-0.5 mt-1">
                    <img src={token} className="h-6 mr-1" />
                    <p className="text-xs">{`${trade.sfl} SFL`}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <Button className="mb-1" onClick={onClaim}>
                {t("claim")}
              </Button>
            </div>
          </div>
        </OuterPanel>
      </div>
    );
  }

  return (
    <>
      <OuterPanel>
        <div className="flex justify-between">
          <div className="flex flex-wrap">
            {getKeys(trade.items).map((name) => (
              <Box
                image={ITEM_DETAILS[name as InventoryItemName].image}
                count={new Decimal(trade.items[name] ?? 0)}
                disabled
                key={name}
              />
            ))}
            <div>
              <Label type="default" className="ml-1 mt-0.5">
                {t("bumpkinTrade.listed")}
              </Label>
              <div className="flex items-center mr-0.5 mt-1">
                <img src={token} className="h-6 mr-1" />
                <p className="text-xs">{`${trade.sfl} SFL`}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={onCancel}>
              {isOldListing ? "Cancel old" : t("cancel")}
            </Button>
          </div>
        </div>
      </OuterPanel>
    </>
  );
};

const ISLAND_LIMITS: Record<IslandType, number> = {
  basic: 5,
  spring: 10,
  desert: 20,
};

export function getRemainingListings({ game }: { game: GameState }) {
  let remaining = ISLAND_LIMITS[game.island?.type] ?? 0;

  if (
    !hasReputation({
      game: game,
      reputation: Reputation.Cropkeeper,
    })
  ) {
    remaining = 1;
  }

  // Bonus trades based on level
  const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);

  if (level >= 70) {
    remaining += 10;
  }

  if (level >= 60) {
    remaining += 10;
  }

  if (level >= 50) {
    remaining += 10;
  }

  const dailyListings = game.trades.dailyListings ?? {
    count: 0,
    date: 0,
  };

  if (dailyListings.date === getDayOfYear(new Date())) {
    remaining -= dailyListings.count;
  }

  return remaining;
}

export const Trade: React.FC<{
  floorPrices: FloorPrices;
  emblem: FactionEmblem;
}> = ({ floorPrices, emblem }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { openModal } = useContext(ModalContext);

  const [showListing, setShowListing] = useState(false);

  const hasTradeReputation = hasReputation({
    game: gameState.context.state,
    reputation: Reputation.Seedling,
  });
  const remainingListings = getRemainingListings({
    game: gameState.context.state,
  });
  const hasListingsRemaining = hasTradeReputation || remainingListings > 0;
  // Show listings
  const trades = gameState.context.state.trades?.listings ?? {};
  const { t } = useAppTranslation();
  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0,
  );

  const emblemListings = getKeys(trades).filter((listingId) => {
    return (
      makeListingType(trades[listingId].items) ===
      makeListingType({ [emblem]: 0 })
    );
  });

  const onList = (items: Items, sfl: number) => {
    gameService.send("LIST_TRADE", {
      sellerId: gameState.context.farmId,
      items,
      sfl,
    });

    setShowListing(false);
  };

  const onCancel = (listingId: string, listingType: string) => {
    if (listingId.length < 38) {
      gameService.send("trade.cancelled", { tradeId: listingId });
      gameService.send("SAVE");
    } else
      gameService.send("DELETE_TRADE_LISTING", {
        sellerId: gameState.context.farmId,
        listingId,
        listingType,
      });
  };

  if (level < 10) {
    return <CannotTrade />;
  }

  if (showListing) {
    return (
      <ListTrade
        inventory={gameState.context.state.inventory}
        onCancel={() => setShowListing(false)}
        onList={onList}
        isSaving={gameState.matches("autosaving")}
        floorPrices={floorPrices}
        emblem={emblem}
      />
    );
  }

  if (emblemListings.length === 0) {
    return (
      <div className="relative">
        <div className="pl-2 pt-2 space-y-1 sm:space-y-0 sm:flex items-center justify-between ml-1.5">
          <VIPAccess
            isVIP={hasTradeReputation}
            onUpgrade={() => openModal("BUY_BANNER")}
            text={t("bumpkinTrade.unlockMoreTrades")}
          />
          {!hasTradeReputation && (
            <Label
              type={hasListingsRemaining ? "success" : "danger"}
              className="-ml-2"
            >
              {remainingListings === 1
                ? `${t("remaining.free.listing")}`
                : `${t("remaining.free.listings", {
                    listingsRemaining: hasListingsRemaining
                      ? remainingListings
                      : t("no"),
                  })}`}
            </Label>
          )}
        </div>
        <div className="p-1 flex flex-col items-center">
          <img
            src={tradeIcon}
            style={{
              width: `${PIXEL_SCALE * 17}px`,
            }}
          />
          <p className="text-sm">{t("bumpkinTrade.noTradeListed")}</p>
        </div>

        <Button
          onClick={() => setShowListing(true)}
          disabled={!hasListingsRemaining}
        >
          {t("list.trade")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="pl-2 pt-2 space-y-1 sm:space-y-0 sm:flex items-center justify-between ml-1.5">
        {!hasTradeReputation && (
          <RequiredReputation reputation={Reputation.Seedling} />
        )}
        {!hasTradeReputation && (
          <Label
            type={hasListingsRemaining ? "success" : "danger"}
            className="-ml-2"
          >
            {remainingListings === 1
              ? `${t("remaining.free.listing")}`
              : `${t("remaining.free.listings", {
                  listingsRemaining: hasListingsRemaining
                    ? remainingListings
                    : t("no"),
                })}`}
          </Label>
        )}
      </div>
      {emblemListings.map((listingId, index) => {
        return (
          <div className="mt-2" key={index}>
            <TradeDetails
              onCancel={() =>
                onCancel(listingId, makeListingType(trades[listingId].items))
              }
              onClaim={() => {
                gameService.send("trade.received", {
                  tradeId: listingId,
                });
                gameService.send("SAVE");
              }}
              trade={trades[listingId]}
              isOldListing={listingId.length < 38}
            />
          </div>
        );
      })}
      {emblemListings.length < 3 && (
        <div className="relative mt-2">
          <Button
            onClick={() => setShowListing(true)}
            disabled={!hasListingsRemaining}
          >
            {t("list.trade")}
          </Button>
        </div>
      )}
      {emblemListings.length >= 3 && (
        <div className="relative my-2">
          <Label type="danger" icon={SUNNYSIDE.icons.lock} className="mx-auto">
            {t("bumpkinTrade.maxListings")}
          </Label>
        </div>
      )}
    </div>
  );
};
