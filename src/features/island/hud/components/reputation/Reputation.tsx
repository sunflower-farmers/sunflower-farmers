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
  REPUTATION_TASKS,
} from "features/game/lib/reputation";
import { useGame } from "features/game/GameProvider";
import { hasVipAccess } from "features/game/lib/vipAccess";
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
          icon: SUNNYSIDE.icons.heart,
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
      <Label type="default" icon={SUNNYSIDE.icons.plant} className="mb-1">
        {t("reputation.sprout")}
      </Label>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.sprout.description"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.icons.plant} className="mr-2">
          {t("reputation.seedling")}
        </Label>
        <Label type="transparent">
          {t("reputation.points", { amount: 250 })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.seedling.trades"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.seedling.deliveries"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.seedling.nft"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.icons.plant} className="mr-2">
          {t("reputation.grower")}
        </Label>
        <Label type="transparent">
          {t("reputation.points", { amount: 350 })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.grower.description"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />
      <NoticeboardItems
        items={[
          {
            text: t("reputation.grower.trades"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.grower.deliveries"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.grower.sfl"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />
      <div className="flex items-center mb-1 mt-2">
        <Label type="default" icon={SUNNYSIDE.icons.plant} className="mr-2">
          {t("reputation.cropkeeper")}
        </Label>
        <Label type="transparent">
          {t("reputation.points", { amount: 600 })}
        </Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: t("reputation.cropkeeper.description"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />
      <NoticeboardItems
        items={[
          {
            text: t("reputation.cropkeeper.trades"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.cropkeeper.deliveries"),
            icon: SUNNYSIDE.icons.basket,
          },
          {
            text: t("reputation.cropkeeper.resources"),
            icon: SUNNYSIDE.icons.basket,
          },
        ]}
      />

      <div className="flex items-center mb-1 mt-2">
        <Label
          type={
            reputation >= Reputation.GrandHarvester ? "transparent" : "default"
          }
          icon={SUNNYSIDE.icons.plant}
          className="mr-2"
        >
          {t("reputation.grandHarvester")}
        </Label>
        <Label type="transparent">
          {t("reputation.points", { amount: 800 })}
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
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label type="default">{t("reputation.points.title")}</Label>
        <Label className="mr-2" type="transparent">
          {t("reputation.points.amount", { points })}
        </Label>
      </div>
      <p className="text-xs mb-2">{t("reputation.points.description")}</p>

      <NoticeboardItems
        items={[
          {
            text: t("reputation.unlock.spring", { points: 50 }),
            icon: REPUTATION_TASKS.SpringIsland({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.desert", { points: 50 }),
            icon: REPUTATION_TASKS.DesertIsland({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.volcano", { points: 100 }),
            icon: REPUTATION_TASKS.VolcanoIsland({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.discord", { points: 100 }),
            icon: REPUTATION_TASKS.Discord({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.humanity", { points: 100 }),
            icon: REPUTATION_TASKS.ProofOfHumanity({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.level", { points: 150 }),
            icon: REPUTATION_TASKS.Level100({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.bud", { points: 300 }),
            icon: REPUTATION_TASKS.Bud({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
          {
            text: t("reputation.unlock.vip", { points: 600 }),
            icon: REPUTATION_TASKS.VIP({
              game: gameState.context.state,
            })
              ? SUNNYSIDE.icons.confirm
              : SUNNYSIDE.icons.cancel,
          },
        ]}
      />
      {!hasVipAccess(gameState.context.state.inventory) && (
        <Button onClick={() => openModal("VIP_ITEMS")}>
          {t("reputation.vip.purchase")}
        </Button>
      )}
    </div>
  );
};
