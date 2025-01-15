import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  achievementsUnlocked,
  claimPrize,
  purchase,
} from "features/portal/lib/portalUtil";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";

interface Props {
  onClose: () => void;
}
export const PortalNPCExample: React.FC<Props> = ({ onClose }) => {
  const [showIntro, setShowIntro] = useState(true);
  const { t } = useAppTranslation();

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: t("portal.example.intro"),
          },
        ]}
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.portaller}
      />
    );
  }

  return (
    <CloseButtonPanel
      title={t("portal.examples")}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.portaller}
    >
      <Button
        onClick={() => {
          // What it costs
          purchase({
            items: {
              Sunflower: 10,
            },
            sfl: 10,
          });
          onClose();
        }}
      >
        {t("portal.example.purchase")}
      </Button>
      <Button
        onClick={() => {
          // Once a user has finished a mission - let's them claim a prize
          claimPrize();
          onClose();
        }}
      >
        {t("portal.example.claimPrize")}
      </Button>
      <Button
        onClick={() => {
          // Unlock multiple achievements at the same time
          achievementsUnlocked({
            achievementNames: ["Achievement 1", "Achievement 2"],
          });
          onClose();
        }}
      >
        {t("portal.example.unlockAchievements")}
      </Button>
    </CloseButtonPanel>
  );
};
