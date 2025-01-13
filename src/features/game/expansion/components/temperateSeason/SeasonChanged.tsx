import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

import winterBanner from "assets/temperate_seasons/winter_banner.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getHasReadTemperateSeasonTutorial,
  setHasReadTemperateSeasonTutorial,
  setLastTemperateSeasonStartedAt,
} from "features/game/lib/temperateSeason";
import { SeasonsIntroduction } from "./SeasonsIntroduction";
import { useTranslation } from "react-i18next";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { getRelativeTime } from "lib/utils/time";

export const SEASON_DETAILS: Record<
  TemperateSeasonName,
  {
    icon: string;
    inSeason: InventoryItemName[];
  }
> = {
  spring: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      // "Rhubarb",
      "Carrot",
      "Cabbage",
      "Beetroot",
      "Parsnip",
      "Corn",
      "Radish",
      "Wheat",
      "Barley",
    ],
  },
  summer: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      // "Zucchini",
      "Soybean",
      // "Hot Pepper",
      // "Coffee",
      "Eggplant",
      "Corn",
      "Radish",
      "Wheat",
    ],
  },
  autumn: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      "Pumpkin",
      "Carrot",
      // "Broccoli",
      "Beetroot",
      "Eggplant",
      "Wheat",
      // "Artichoke",
      "Barley",
    ],
  },
  winter: {
    icon: SUNNYSIDE.resource.tree_stump,
    inSeason: [
      "Sunflower",
      "Potato",
      // "Yam",
      "Cabbage",
      "Beetroot",
      "Cauliflower",
      "Parsnip",
      // "Onion",
      // "Turnip",
      "Wheat",
      "Kale",
    ],
  },
};

type SeasonEventName = "Tornado" | "Tsunami" | "Unknown";
const DUMMY_EVENT_DATA: Record<
  SeasonEventName,
  {
    icon: string;
    description: string;
    resolution?: string;
  }
> = {
  Tornado: {
    icon: SUNNYSIDE.icons.firePitIcon,
    description: "A destructive tornado past through your farm!",
    resolution: "Construct wind turbines to dissipate its energy.",
  },
  Tsunami: {
    icon: SUNNYSIDE.icons.water,
    description: "There was a large tsunami that hit your farm!",
    resolution: "Build mangroves along the coast to protect your farm.",
  },
  Unknown: {
    icon: SUNNYSIDE.icons.lightning,
    description: "Something is upcoming!",
  },
};

type WeekData = {
  day: string;
  event: SeasonEventName | "Unknown";
};

const DUMMY_WEEK_DATA: WeekData[] = [
  { day: "Monday", event: "Tornado" },
  { day: "Tuesday", event: "Tsunami" },
  { day: "Wednesday", event: "Tornado" },
  { day: "Thursday", event: "Tsunami" },
  { day: "Friday", event: "Unknown" },
  { day: "Saturday", event: "Unknown" },
  { day: "Sunday", event: "Unknown" },
];

const SeasonDayDetails: React.FC<{
  weekDay: number;
  timestamp: number;
  onClose: () => void;
}> = ({ weekDay, timestamp, onClose }) => {
  const { t } = useTranslation();

  return (
    <InnerPanel className="shadow">
      <div className="flex flex-row justify-between mb-2">
        <Label type="default">{DUMMY_WEEK_DATA[weekDay].event}</Label>
        <Label type="info">{getRelativeTime(timestamp)}</Label>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex flex-col items-center">
          <InnerPanel>
            <img
              src={DUMMY_EVENT_DATA[DUMMY_WEEK_DATA[weekDay].event].icon}
              className="w-12 h-12 object-contain"
            />
          </InnerPanel>
        </div>

        <div className="flex-1 text-sm">
          {DUMMY_EVENT_DATA[DUMMY_WEEK_DATA[weekDay].event].description}
        </div>
      </div>

      {DUMMY_WEEK_DATA[weekDay].event === "Unknown" && (
        <div className="flex flex-col gap-2 my-2 w-full">
          <Label type="default">{t("temperateSeason.possibleEvents")}</Label>
          <div className="flex flex-col gap-2">
            {Object.entries(DUMMY_EVENT_DATA)
              .filter(([name]) => name !== "Unknown")
              .map(([name, data]) => (
                <div key={name} className="flex items-center gap-1">
                  <img src={data.icon} className="w-6 h-6" />

                  <div className="flex flex-col">
                    <span className="text-xs">{name}</span>
                    {data.resolution && (
                      <span className="text-xxs">{data.resolution}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <Button onClick={onClose}>{t("close")}</Button>
    </InnerPanel>
  );
};

const SeasonWeek = () => {
  const { gameService } = useContext(Context);

  const season = useSelector(gameService, _season);
  const { t } = useTranslation();

  const [showWeekday, setShowWeekday] = useState<number>();

  const today = new Date().getUTCDay();
  const weekDayStartsAt = new Date(season.startedAt);

  return (
    <div>
      <ModalOverlay
        show={showWeekday !== undefined}
        onBackdropClick={() => setShowWeekday(undefined)}
        className="inset-3 top-4"
      >
        <SeasonDayDetails
          weekDay={showWeekday ?? 0}
          timestamp={new Date(
            weekDayStartsAt.getTime() +
              1000 * 60 * 60 * 24 * (showWeekday ?? 0),
          ).getTime()}
          onClose={() => setShowWeekday(undefined)}
        />
      </ModalOverlay>

      <div className="grid grid-cols-7 gap-1">
        {DUMMY_WEEK_DATA.map((data, index) => {
          return (
            <ButtonPanel
              variant={index < today ? "primary" : "secondary"}
              key={data.day}
              className="h-12 relative flex items-center justify-center"
              onClick={() => setShowWeekday(index)}
            >
              <img
                src={DUMMY_EVENT_DATA[data.event].icon}
                className="absolute w-6 h-6 object-contain"
              />
              <span className="absolute -top-1 -right-1 text-xxs">
                {data.day[0]}
              </span>
            </ButtonPanel>
          );
        })}
      </div>
    </div>
  );
};

const _season = (state: MachineState) => state.context.state.season;

const SeasonChangedContent = () => {
  const { gameService } = useContext(Context);
  const [hasReadTutorial, setHasReadTutorial] = useState(
    getHasReadTemperateSeasonTutorial(),
  );

  const { t } = useTranslation();

  const season = useSelector(gameService, _season);

  const [showIngredients, setShowIngredients] = useState(false);

  const seasonDetails = SEASON_DETAILS[season.season];

  const acknowledgeTutorial = () => {
    setHasReadTemperateSeasonTutorial();
    setHasReadTutorial(true);
  };

  const acknowledgeSeason = () => {
    setLastTemperateSeasonStartedAt(season.startedAt);
    gameService.send("ACKNOWLEDGE");
  };

  if (!hasReadTutorial) {
    return <SeasonsIntroduction onClose={acknowledgeTutorial} />;
  }

  return (
    <Panel>
      <div
        className="flex flex-col gap-1"
        onClick={() => setShowIngredients(false)}
      >
        <div className="relative w-full">
          <div className="flex justify-between absolute w-full p-1 pr-0">
            <Label
              type="default"
              icon={seasonDetails.icon}
              className="capitalize"
            >
              {season.season}
            </Label>
            <Label type="warning">{t("temperateSeason.newSeason")}</Label>
          </div>
        </div>
        <img
          src={winterBanner}
          className="w-full h-24 object-cover rounded-t-md"
          alt="Season banner"
        />

        <Label type="default" className="capitalize">
          {t("temperateSeason.seasonDetails")}
        </Label>
        <SeasonWeek />

        <IngredientsPopover
          ingredients={seasonDetails.inSeason}
          show={showIngredients}
          onClick={() => setShowIngredients(false)}
          title={t("temperateSeason.seasonalCrops")}
        />
        <div
          className="flex flex-col gap-1 mt-3"
          onClick={(e) => {
            e.stopPropagation();
            setShowIngredients(!showIngredients);
          }}
        >
          <Label type="default">{t("temperateSeason.seasonalCrops")}</Label>
          <div className="flex items-center gap-1">
            {seasonDetails.inSeason.map((item) => (
              <img key={item} src={ITEM_DETAILS[item].image} className="w-6" />
            ))}
          </div>
        </div>
      </div>
      <Button className="mt-1 capitalize" onClick={acknowledgeSeason}>
        {t("temperateSeason.enterSeason", { season: season.season })}
      </Button>
    </Panel>
  );
};

export const SeasonChanged: React.FC = () => {
  return (
    <Modal show>
      <SeasonChangedContent />
    </Modal>
  );
};
