import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import budIcon from "assets/icons/bud.png";
import wearableIcon from "assets/icons/wearables.webp";
import lightning from "assets/icons/lightning.png";
import filterIcon from "assets/icons/filter_icon.webp";
import tradeIcon from "assets/icons/trade.png";
import trade_point from "src/assets/icons/trade_points_coupon.webp";
import sflIcon from "assets/icons/sfl.webp";
import crownIcon from "assets/icons/vip.webp";

import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { Collection, preloadCollections } from "./Collection";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { SquareIcon } from "components/ui/SquareIcon";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MarketplaceProfile } from "./MarketplaceProfile";
import { MyTrades } from "./profile/MyTrades";
import { MarketplaceRewards } from "./MarketplaceRewards";
import { Tradeable } from "./Tradeable";
import classNames from "classnames";
import { MarketplaceHotNow } from "./MarketplaceHotNow";
import { CONFIG } from "lib/config";
import { MarketplaceUser } from "./MarketplaceUser";
import { Context } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import {
  getRemainingTrades,
  hasReputation,
  Reputation,
} from "features/game/lib/reputation";

const _hasTradeReputation = (state: MachineState) =>
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

export const MarketplaceNavigation: React.FC = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showQuickswap, setShowQuickswap] = useState(false);

  const { openModal } = useContext(ModalContext);

  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  useEffect(() => {
    const token = authState.context.user.rawToken as string;
    if (CONFIG.API_URL) preloadCollections(token);
  }, []);
  const { t } = useTranslation();

  const { gameService } = useContext(Context);
  const price = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;
  const { farmId } = gameService.getSnapshot().context;

  const hasTradeReputation = useSelector(gameService, _hasTradeReputation);

  return (
    <>
      <Modal show={showFilters} onHide={() => setShowFilters(false)}>
        <CloseButtonPanel>
          <Filters onClose={() => setShowFilters(false)} farmId={farmId} />
          <EstimatedPrice
            price={price}
            onClick={() => setShowQuickswap(true)}
          />
        </CloseButtonPanel>
      </Modal>

      <Modal show={showQuickswap} onHide={() => setShowQuickswap(false)}>
        <CloseButtonPanel onClose={() => setShowQuickswap(false)}>
          <div className="p-1">
            <Label type="danger" className="mb-2">
              {t("marketplace.quickswap")}
            </Label>
            <p className="text-sm mb-2">
              {t("marketplace.quickswap.description")}
            </p>
            <p className="text-sm mb-2">{t("marketplace.quickswap.warning")}</p>
            <Button
              onClick={() => {
                window.open(
                  "https://quickswap.exchange/#/swap?swapIndex=0&currency0=ETH&currency1=0xD1f9c58e33933a993A3891F8acFe05a68E1afC05",
                  "_blank",
                );
              }}
            >
              {t("continue")}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>

      <div className="flex items-center lg:hidden h-[50px]">
        <TextInput
          icon={SUNNYSIDE.icons.search}
          value={search}
          onValueChange={setSearch}
        />
        <img
          src={filterIcon}
          onClick={() => setShowFilters(true)}
          className="h-8 mx-1 block cursor-pointer"
        />
      </div>

      <div className="flex h-[calc(100%-50px)] lg:h-full">
        <div className="w-64  mr-1 hidden lg:flex  flex-col">
          <InnerPanel className="w-full flex-col mb-1">
            <div className="flex  items-center">
              <TextInput
                icon={SUNNYSIDE.icons.search}
                value={search}
                onValueChange={setSearch}
                onCancel={() => setSearch("")}
              />
            </div>
            <div className="flex-1">
              <Filters onClose={() => setShowFilters(false)} farmId={farmId} />
            </div>
          </InnerPanel>

          <EstimatedPrice
            price={price}
            onClick={() => setShowQuickswap(true)}
          />

          {!hasTradeReputation && (
            <InnerPanel
              className="cursor-pointer"
              onClick={() => openModal("REPUTATION")}
            >
              <div className="flex flex-col p-1">
                <Label type="danger" icon={crownIcon}>
                  {`${getRemainingTrades({ game: gameService.getSnapshot().context.state })} Trades left`}
                </Label>
                <p className="text-xs">{t("reputation.marketplace.trades")}</p>
              </div>
            </InnerPanel>
          )}
        </div>

        <div className="flex-1 flex flex-col w-full">
          {search ? (
            <Collection search={search} onNavigated={() => setSearch("")} />
          ) : (
            <Routes>
              <Route path="/profile" element={<MarketplaceProfile />} />
              <Route path="/hot" element={<MarketplaceHotNow />} />
              <Route path="/collection/*" element={<Collection />} />
              <Route path="/:collection/:id" element={<Tradeable />} />
              <Route path="/profile/:id" element={<MarketplaceUser />} />
              <Route path="/profile/:id/trades" element={<MyTrades />} />
              <Route path="/profile/rewards" element={<MarketplaceRewards />} />
              {/* default to hot */}
              <Route path="/" element={<MarketplaceHotNow />} />
            </Routes>
          )}
        </div>
      </div>
    </>
  );
};

export type MarketplacePurpose = "boost" | "decoration" | "resource";

interface OptionProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  options?: OptionProps[];
}

const Option: React.FC<OptionProps> = ({
  icon,
  label,
  onClick,
  options,
  isActive,
}) => {
  return (
    <div className="mb-1">
      <div
        className={classNames(
          "flex justify-between items-center cursor-pointer mb-1 ",
          { "bg-brown-100 px-2 -mx-2": isActive },
        )}
        onClick={onClick}
      >
        <div className="flex items-center">
          <SquareIcon icon={icon} width={10} />
          <span className="text-sm ml-2">{label}</span>
        </div>
        <img
          src={
            options
              ? SUNNYSIDE.icons.chevron_down
              : SUNNYSIDE.icons.chevron_right
          }
          className={options ? "w-6" : "w-[18px]"}
        />
      </div>

      {options?.map((option) => (
        <div
          key={option.label}
          className={classNames(
            "flex justify-between items-center cursor-pointer mb-1 ml-4",
            { "bg-brown-100 px-2 -mr-2 ml-0": option.isActive },
          )}
          onClick={option.onClick}
        >
          <div className="flex items-center">
            <SquareIcon icon={option.icon} width={10} />
            <span className="text-sm ml-2">{option.label}</span>
          </div>
          <img
            src={SUNNYSIDE.icons.chevron_right}
            className={"w-[18px] mr-5"}
          />
        </div>
      ))}
    </div>
  );
};

const Filters: React.FC<{ onClose: () => void; farmId: number }> = ({
  onClose,
  farmId,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [queryParams] = useSearchParams();
  const filters = queryParams.get("filters");
  const { t } = useTranslation();
  const isWorldRoute = pathname.includes("/world");

  const baseUrl = `${isWorldRoute ? "/world" : ""}/marketplace`;
  const navigateTo = ({
    path,
    filterParams,
  }: {
    path: string;
    filterParams?: string;
  }) => {
    const url = filterParams
      ? `${baseUrl}/collection?filters=${filterParams}`
      : `${baseUrl}/${path}`;

    navigate(url);
    onClose();
  };

  return (
    <div className="p-1 h-full">
      <div className="flex flex-col h-full">
        <div>
          <Option
            icon={SUNNYSIDE.icons.expression_alerted}
            label={t("marketplace.trending")}
            onClick={() => navigateTo({ path: "hot" })}
            isActive={pathname === `${baseUrl}/hot`}
          />
          <Option
            icon={lightning}
            label={t("marketplace.powerUps")}
            onClick={() =>
              navigateTo({
                path: "collection",
                filterParams: "collectibles,wearables,utility",
              })
            }
            isActive={filters === "collectibles,wearables,utility"}
            options={
              filters?.includes("utility")
                ? [
                    {
                      icon: ITEM_DETAILS["Freya Fox"].image,
                      label: t("marketplace.collectibles"),
                      isActive: filters === "utility,collectibles",
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: "utility,collectibles",
                        }),
                    },
                    {
                      icon: wearableIcon,
                      label: t("marketplace.wearables"),
                      isActive: filters === "utility,wearables",
                      onClick: () =>
                        navigateTo({
                          path: "collection",
                          filterParams: "utility,wearables",
                        }),
                    },
                  ]
                : undefined
            }
          />
          <Option
            icon={ITEM_DETAILS.Eggplant.image}
            label={t("marketplace.resources")}
            onClick={() =>
              navigateTo({
                path: "collection",
                filterParams: "resources",
              })
            }
            isActive={filters === "resources"}
          />
          <Option
            icon={SUNNYSIDE.icons.stopwatch}
            label={t("marketplace.limited")}
            onClick={() =>
              navigateTo({
                path: "collection",
                filterParams: "temporary",
              })
            }
            isActive={filters === "temporary"}
          />
          <Option
            icon={SUNNYSIDE.icons.heart}
            label={t("marketplace.cosmetics")}
            onClick={() =>
              navigateTo({
                path: "collection",
                filterParams: "collectibles,wearables,cosmetic",
              })
            }
            isActive={filters === "collectibles,wearables,cosmetic"}
          />
          <Option
            icon={budIcon}
            label={t("marketplace.budNfts")}
            onClick={() =>
              navigateTo({
                path: "collection",
                filterParams: "buds",
              })
            }
            isActive={filters === "buds"}
          />
        </div>

        <div>
          <Option
            icon={SUNNYSIDE.icons.player}
            label={t("marketplace.myProfile")}
            onClick={() =>
              navigateTo({
                path: `profile/${farmId}`,
              })
            }
            options={
              pathname.includes("profile")
                ? [
                    {
                      icon: SUNNYSIDE.icons.lightning,
                      label: t("marketplace.stats"),
                      onClick: () =>
                        navigateTo({
                          path: `profile/${farmId}`,
                        }),
                      isActive: pathname === `${baseUrl}/profile/${farmId}`,
                    },
                    {
                      icon: tradeIcon,
                      label: t("marketplace.trades"),
                      onClick: () =>
                        navigateTo({
                          path: `profile/${farmId}/trades`,
                        }),
                      isActive:
                        pathname === `${baseUrl}/profile/${farmId}/trades`,
                    },
                    {
                      icon: trade_point,
                      label: t("marketplace.rewards"),
                      onClick: () =>
                        navigateTo({
                          path: "profile/rewards",
                        }),
                      isActive: pathname === `${baseUrl}/profile/rewards`,
                    },
                  ]
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};

const EstimatedPrice: React.FC<{ price: number; onClick: () => void }> = ({
  price,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <InnerPanel className="cursor-pointer mb-1" onClick={onClick}>
      <div className="flex justify-between items-center pr-1">
        <div className="flex items-center">
          <img src={sflIcon} className="w-6" />
          <span className="text-sm ml-2">{`$${price.toFixed(4)}`}</span>
        </div>
        <p className="text-xxs underline">{t("marketplace.quickswap")}</p>
      </div>
      <p className="text-xxs italic">{t("marketplace.estimated.price")}</p>
    </InnerPanel>
  );
};
