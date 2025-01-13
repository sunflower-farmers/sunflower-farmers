import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import React, { useContext, useState } from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getReputation,
  getReputationPoints,
  Reputation,
  REPUTATION_NAME,
  REPUTATION_POINTS,
  REPUTATION_TASKS,
  REPUTATION_TIERS,
} from "features/game/lib/reputation";
import { useGame } from "features/game/GameProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { ITEM_DETAILS } from "features/game/types/images";

import lockIcon from "assets/icons/lock.png";
import tradeIcon from "assets/icons/trade.png";
import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";
import hammerinHarry from "assets/npcs/hammerin_harry.webp";
import salesIcon from "assets/icons/sale.webp";

export const MyReputation: React.FC = () => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const { gameState } = useGame();

  return (
    <ButtonPanel onClick={() => openModal("REPUTATION")}>
      <div className="flex flex-col">
        <Label type="vibrant" icon={SUNNYSIDE.icons.heart}>
          {`${t("reputation.title")} - ${REPUTATION_NAME[getReputation({ game: gameState.context.state })]}`}
        </Label>
        <p className="text-xs">{t("reputation.description")}</p>
      </div>
    </ButtonPanel>
  );
};

export const RequiredReputation: React.FC<{
  reputation: Reputation;
  text?: string;
}> = ({ reputation, text }) => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  return (
    <ButtonPanel onClick={() => openModal("REPUTATION")}>
      <div className="flex flex-col">
        <Label type="danger" icon={lockIcon}>
          {`You are not a ${REPUTATION_NAME[reputation]}`}
        </Label>
        <p className="text-xs">{text ?? t("reputation.description")}</p>
      </div>
    </ButtonPanel>
  );
};

export const ReputationSystem: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.heart,
          name: "Tiers",
        },
        {
          icon: salesIcon,
          name: "Earn points",
        },
      ]}
    >
      {tab === 0 && <ReputationTiers />}
      {tab === 1 && <ReputationPoints />}
    </CloseButtonPanel>
  );
};

export const ReputationTiers: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameState } = useGame();
  const reputation = getReputation({ game: gameState.context.state });

  return (
    <div className="p-2 scrollable overflow-y-scroll max-h-[350px]">
      <p className="text-xs mb-2">{t("reputation.description")}</p>

      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.crops.sprout} className="mr-2">
          {t("reputation.sprout")}
        </Label>
        <Label type="warning">
          {t("reputation.points", {
            amount: REPUTATION_TIERS[Reputation.Sprout],
          })}
        </Label>
      </div>

      <NoticeboardItems
        items={[
          {
            text: t("reputation.sprout.description"),
            icon: tradeIcon,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.crops.seedling} className="mr-2">
          {t("reputation.seedling")}
        </Label>
        <Label type="warning">
          {t("reputation.points", {
            amount: REPUTATION_TIERS[Reputation.Seedling],
          })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.seedling.trades"),
            icon: tradeIcon,
          },

          {
            text: t("reputation.seedling.nft"),
            icon: ITEM_DETAILS["Grinx's Hammer"].image,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.crops.grower} className="mr-2">
          {t("reputation.grower")}
        </Label>
        <Label type="warning">
          {t("reputation.points", {
            amount: REPUTATION_TIERS[Reputation.Grower],
          })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.grower.trades"),
            icon: tradeIcon,
          },
          {
            text: t("reputation.grower.description"),
            icon: walletIcon,
          },

          {
            text: t("reputation.grower.auctions"),
            icon: hammerinHarry,
          },
        ]}
      />
      <div className="flex items-center mb-1 mt-2">
        <Label
          type="default"
          icon={ITEM_DETAILS["Sunflower"].image}
          className="mr-2"
        >
          {t("reputation.cropkeeper")}
        </Label>
        <Label type="warning">
          {t("reputation.points", {
            amount: REPUTATION_TIERS[Reputation.Cropkeeper],
          })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.cropkeeper.trades"),
            icon: tradeIcon,
          },
          {
            text: t("reputation.cropkeeper.description"),
            icon: sflIcon,
          },

          {
            text: t("reputation.cropkeeper.resources"),
            icon: ITEM_DETAILS.Eggplant.image,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label
          type={"default"}
          icon={ITEM_DETAILS["Black Magic"].image}
          className="mr-2"
        >
          {t("reputation.grandHarvester")}
        </Label>
        <Label type="warning">
          {t("reputation.points", {
            amount: REPUTATION_TIERS[Reputation.GrandHarvester],
          })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.grandHarvester.description"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />
    </div>
  );
};

export const ReputationPoints: React.FC = () => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const { gameState } = useGame();

  const points = getReputationPoints({ game: gameState.context.state });
  return (
    <>
      <div className="p-1">
        <div className="flex justify-between items-center mb-2">
          <Label type="default">
            {t("reputation.points.title", {
              name: REPUTATION_NAME[
                getReputation({ game: gameState.context.state })
              ],
            })}
          </Label>
          <Label className="mr-1" type="warning">
            {t("reputation.points.amount", { points })}
          </Label>
        </div>
        <p className="text-xs mb-2">{t("reputation.points.description")}</p>

        <NoticeboardItems
          items={[
            {
              text: t("reputation.unlock.spring", {
                points: REPUTATION_POINTS.SpringIsland,
              }),
              icon: REPUTATION_TASKS.SpringIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.desert", {
                points: REPUTATION_POINTS.DesertIsland,
              }),
              icon: REPUTATION_TASKS.DesertIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.volcano", {
                points: REPUTATION_POINTS.VolcanoIsland,
              }),
              icon: REPUTATION_TASKS.VolcanoIsland({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.discord", {
                points: REPUTATION_POINTS.Discord,
              }),
              icon: REPUTATION_TASKS.Discord({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.humanity", {
                points: REPUTATION_POINTS.ProofOfHumanity,
              }),
              icon: REPUTATION_TASKS.ProofOfHumanity({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.level", {
                points: REPUTATION_POINTS.Level100,
              }),
              icon: REPUTATION_TASKS.Level100({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.bud", {
                points: REPUTATION_POINTS.Bud,
              }),
              icon: REPUTATION_TASKS.Bud({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
            {
              text: t("reputation.unlock.vip", {
                points: REPUTATION_POINTS.VIP,
              }),
              icon: REPUTATION_TASKS.VIP({
                game: gameState.context.state,
              })
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel,
            },
          ]}
        />
      </div>
      {!hasVipAccess(gameState.context.state.inventory) && (
        <Button onClick={() => openModal("VIP_ITEMS")}>
          {t("reputation.vip.purchase")}
        </Button>
      )}
    </>
  );
};
