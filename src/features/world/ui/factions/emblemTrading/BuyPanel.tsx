import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FactionEmblem, GameState } from "features/game/types/game";
import {
  Listing,
  getTradeListings,
} from "features/game/actions/getTradeListings";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { Label } from "components/ui/Label";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { VIPAccess } from "features/game/components/VipAccess";
import { getDayOfYear } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { Loading } from "features/auth/components";
import { hasMaxItems } from "features/game/lib/processEvent";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { formatNumber } from "lib/utils/formatNumber";
import token from "assets/icons/sfl.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import { isMobile } from "mobile-device-detect";
import { hasReputation, Reputation } from "features/game/lib/reputation";

const MAX_NON_VIP_PURCHASES = 3;

function getRemainingFreePurchases(dailyPurchases: {
  count: number;
  date: number;
}) {
  if (dailyPurchases.date != getDayOfYear(new Date())) {
    return MAX_NON_VIP_PURCHASES;
  }
  return MAX_NON_VIP_PURCHASES - dailyPurchases.count;
}

export const BuyPanel: React.FC<{
  emblem: FactionEmblem;
  setUpdatedAt: (updatedAt: number | undefined) => void;
}> = ({ emblem, setUpdatedAt }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const hasTradeReputation = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
  });
  const dailyPurchases = state.trades.dailyPurchases ?? { count: 0, date: 0 };
  const remainingFreePurchases = getRemainingFreePurchases(dailyPurchases);
  const hasPurchasesRemaining =
    hasTradeReputation || remainingFreePurchases > 0;

  return (
    <div className="flex flex-col divide-brown-600">
      <div className="pl-2 pt-2 space-y-1 sm:space-y-0 sm:flex items-center justify-between ml-1.5">
        <VIPAccess
          isVIP={hasTradeReputation}
          onUpgrade={() => openModal("BUY_BANNER")}
          text={t("bumpkinTrade.unlockMoreTrades")}
        />
        {!hasTradeReputation && (
          <Label
            type={hasPurchasesRemaining ? "success" : "danger"}
            className="-ml-2"
          >
            {remainingFreePurchases === 1
              ? `${t("remaining.free.purchase")}`
              : `${t("remaining.free.purchases", {
                  purchasesRemaining: hasPurchasesRemaining
                    ? remainingFreePurchases
                    : t("no"),
                })}`}
          </Label>
        )}
      </div>
      <div className="flex flex-col items-start justify-between mt-1">
        <div className="flex overflow-y-auto relative w-full max-h-[400px] scrollable">
          <ListView
            emblem={emblem}
            hasPurchasesRemaining={hasPurchasesRemaining}
            setUpdatedAt={setUpdatedAt}
          />
        </div>
      </div>
    </div>
  );
};

interface ListViewProps {
  emblem: FactionEmblem;
  hasPurchasesRemaining: boolean;
  setUpdatedAt: (updatedAt: number | undefined) => void;
}

const ListView: React.FC<ListViewProps> = ({
  emblem,
  hasPurchasesRemaining,
  setUpdatedAt,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [warning, setWarning] = useState<"hoarding">();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);
  const [fulfillListing, setfulfillListing] = useState(false);
  const [
    {
      context: { state, farmId },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;
  const THIRTY_SECONDS = 1000 * 30;

  useEffect(() => {
    if (fulfillListing) return;

    const load = async () => {
      setLoading(true);
      try {
        const listings = await getTradeListings(
          makeListingType({ [emblem]: 1 }),
          authState.context.user.rawToken,
        );
        setUpdatedAt(Date.now());
        setListings(listings);
      } catch {
        setListings([]);
      }
      setLoading(false);
    };

    load();

    const interval = setInterval(load, THIRTY_SECONDS);

    return () => {
      clearInterval(interval);
      setUpdatedAt(undefined);
    };
  }, [
    THIRTY_SECONDS,
    authState.context.user.rawToken,
    emblem,
    setUpdatedAt,
    fulfillListing,
  ]);

  const onConfirm = async (listing: Listing) => {
    setfulfillListing(true);
    gameService.send("FULFILL_TRADE_LISTING", {
      sellerId: listing.farmId,
      listingId: listing.id,
      listingType: makeListingType(listing.items),
    });
    setLoading(true);
  };

  const confirm = (listing: Listing) => {
    const updatedInventory = getKeys(listing.items).reduce(
      (acc, name) => ({
        ...acc,
        [name]: (inventory[name] ?? new Decimal(0)).add(
          listing.items[name] ?? 0,
        ),
      }),
      inventory,
    );

    const hasMaxedOut = hasMaxItems({
      currentInventory: updatedInventory,
      oldInventory: state.previousInventory,
      currentWardrobe: state.wardrobe,
      oldWardrobe: state.previousWardrobe,
    });

    if (hasMaxedOut) {
      setWarning("hoarding");
      return;
    }

    setSelectedListing(listing);
  };

  if (loading && listings.length === 0) {
    return <Loading text={t("searching")} />;
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center pb-2">
          <img
            src={SUNNYSIDE.icons.search}
            className="mx-auto my-2"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <p className="text-sm">{t("trading.no.listings")}</p>
        </div>
      </div>
    );
  }

  if (warning === "hoarding") {
    return (
      <div className="flex flex-col items-center w-full">
        <img
          src={SUNNYSIDE.icons.lock}
          className="mb-2"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <p className="text-sm mb-1 text-center">{t("playerTrade.max.item")}</p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Progress")}</p>
        <Button
          className="mt-2"
          onClick={() => {
            setWarning(undefined);
          }}
        >
          {t("back")}
        </Button>
      </div>
    );
  }

  if (gameService.state.matches("fulfillTradeListing")) {
    return <Loading text={t("trading")} />;
  }

  if (fulfillListing && selectedListing) {
    const listingItem = selectedListing.items[
      getKeys(selectedListing.items)[0]
    ] as number;
    const unitPrice = selectedListing.sfl / listingItem;

    return (
      <div className="flex flex-col w-full p-2">
        <img src={SUNNYSIDE.icons.confirm} className="mx-auto h-6 my-2" />
        <p className="text-sm mb-2 text-center">
          {t("trading.listing.fulfilled")}
        </p>
        <OuterPanel>
          <div className="flex justify-between">
            <div>
              <div className="flex flex-wrap w-52 items-center">
                {getKeys(selectedListing.items).map((item, index) => (
                  <Box
                    image={ITEM_DETAILS[item].image}
                    count={new Decimal(selectedListing.items[item] ?? 0)}
                    disabled
                    key={`items-${index}`}
                  />
                ))}
                <div className="ml-1">
                  <div className="flex items-center mb-1">
                    <img src={token} className="h-6 mr-1" />
                    <p className="text-xs">{`${formatNumber(selectedListing.sfl, { decimalPlaces: 4 })} SFL`}</p>
                  </div>
                  <p className="text-xxs">
                    {t("bumpkinTrade.price/unit", {
                      price: formatNumber(unitPrice, {
                        decimalPlaces: 4,
                        showTrailingZeros: true,
                      }),
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <Label type="success">{t("purchased")}</Label>
            </div>
          </div>
        </OuterPanel>
        <Button
          className="mt-2"
          onClick={() => {
            setLoading(false);
            setfulfillListing(false);
            setSelectedListing(undefined);
          }}
        >
          {t("continue")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pl-2 pt-1">
      <div className="flex items-center ml-1">
        <Label type="default" icon={ITEM_DETAILS[emblem].image}>
          {emblem}
        </Label>
        {!!inventory[emblem] && (
          <Label type="warning" className="ml-auto">
            {`${t("inventory")}: ${formatNumber(inventory[emblem], { decimalPlaces: 0 })}`}
          </Label>
        )}
      </div>
      <div className="flex-1 pr-2 overflow-y-auto scrollable mt-1">
        {listings.map((listing, index) => {
          // only one resource listing
          const listingItem = listing.items[
            getKeys(listing.items)[0]
          ] as number;
          const unitPrice = listing.sfl / listingItem;
          return (
            <OuterPanel className="mb-2" key={`data-${index}`}>
              <div className="flex justify-between">
                <div className="justify-start">
                  <div className="flex flex-wrap w-50 sm:w-52 items-center">
                    {getKeys(listing.items).map((item) => (
                      <Box
                        image={ITEM_DETAILS[item].image}
                        count={new Decimal(listing.items[item] ?? 0)}
                        disabled
                        key={`items-${index}`}
                      />
                    ))}
                    <div className="ml-0.5 sm:ml-1">
                      <div className="flex items-center mb-1">
                        <img src={token} className="h-5 mr-1" />
                        <p className="text-xs">{`${formatNumber(listing.sfl, { decimalPlaces: 4 })} SFL`}</p>
                      </div>
                      <p className="text-xxs">
                        {t("bumpkinTrade.price/unit", {
                          price: formatNumber(unitPrice, {
                            decimalPlaces: 4,
                            showTrailingZeros: true,
                          }),
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ActionButtons
                    loading={loading}
                    listing={listing}
                    farmId={farmId}
                    selectedListing={selectedListing}
                    onConfirm={onConfirm}
                    confirm={confirm}
                    hasPurchasesRemaining={hasPurchasesRemaining}
                    state={state}
                  />
                </div>
              </div>
            </OuterPanel>
          );
        })}
      </div>
    </div>
  );
};

interface ActionButtonsProps {
  loading: boolean;
  listing: Listing;
  farmId: number;
  selectedListing?: Listing;
  onConfirm: (listing: Listing) => void;
  confirm: (listing: Listing) => void;
  hasPurchasesRemaining: boolean;
  state: GameState;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  loading,
  listing,
  farmId,
  selectedListing,
  onConfirm,
  confirm,
  hasPurchasesRemaining,
  state,
}) => {
  const { t } = useAppTranslation();
  const hasSFL = state.balance.gte(listing.sfl);
  const disabled = !hasSFL || !hasPurchasesRemaining;

  if (listing.farmId == farmId) {
    return (
      <div className="flex items-center sm:h-full">
        <Label type="danger">{t("trading.your.listing")}</Label>
      </div>
    );
  }

  if (selectedListing?.id == listing.id) {
    return (
      <Button disabled={loading} onClick={() => onConfirm(listing)}>
        <div className="flex items-center gap-1 sm:gap-2">
          <SquareIcon icon={SUNNYSIDE.icons.confirm} width={isMobile ? 6 : 7} />
          <span className="text-xxs sm:text-sm">{t("confirm")}</span>
        </div>
      </Button>
    );
  }

  return (
    <Button disabled={disabled} onClick={() => confirm(listing)}>
      {t("buy")}
    </Button>
  );
};
