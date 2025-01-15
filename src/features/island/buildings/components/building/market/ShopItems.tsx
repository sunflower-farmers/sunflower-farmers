import React, { useContext, useState } from "react";
import { Seeds } from "./Seeds";
import { Crops } from "./Crops";
import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ConversationName } from "features/game/types/announcements";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { OuterPanel, Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { SeasonalSeeds } from "./SeasonalSeeds";
import { Context } from "features/game/GameProvider";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `betty-read.${host}-${window.location.pathname}`;
const INTRO_LOCAL_STORAGE_KEY = `betty-intro-read.${host}-${window.location.pathname}`;

function acknowledgeIntroRead() {
  localStorage.setItem(INTRO_LOCAL_STORAGE_KEY, new Date().toString());
}

function hasReadIntro() {
  return !!localStorage.getItem(INTRO_LOCAL_STORAGE_KEY);
}

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

interface Props {
  onClose: () => void;
  conversation?: ConversationName;
  hasSoldBefore?: boolean;
  showBuyHelper?: boolean;
  cropShortage?: boolean;
}

export const ShopItems: React.FC<Props> = ({
  onClose,
  hasSoldBefore,
  showBuyHelper,
}) => {
  const [tab, setTab] = useState(0);
  const [showIntro, setShowIntro] = React.useState(!hasReadIntro());
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.betty;

  if (showIntro) {
    return (
      <Panel bumpkinParts={NPC_WEARABLES.betty}>
        <SpeakingText
          message={[
            {
              text: t("betty.welcome"),
              actions: [
                {
                  text: t("betty.buySeeds"),
                  cb: () => {
                    setTab(0);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
                {
                  text: t("betty.sellCrops"),
                  cb: () => {
                    setTab(1);
                    acknowledgeIntroRead();
                    setShowIntro(false);
                  },
                },
              ],
            },
          ]}
          onClose={() => {
            acknowledgeRead();
          }}
        />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      tabs={[
        {
          icon: SUNNYSIDE.icons.seeds,
          name: t("buy"),
          unread: showBuyHelper,
        },
        {
          icon: CROP_LIFECYCLE.Sunflower.crop,
          name: t("sell"),
          unread: !hasSoldBefore,
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
    >
      {tab === 0 &&
        (hasFeatureAccess(
          gameService.getSnapshot().context.state,
          "SEASONAL_SEEDS",
        ) ? (
          <SeasonalSeeds />
        ) : (
          <Seeds />
        ))}
      {tab === 1 && <Crops />}
    </CloseButtonPanel>
  );
};
