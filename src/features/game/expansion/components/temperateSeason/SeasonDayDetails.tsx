import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  CALENDAR_EVENT_ICONS,
  CalendarEventName,
  SEASON_DETAILS,
} from "features/game/types/calendar";
import {
  CalendarEventDetails,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getRelativeTime } from "lib/utils/time";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  season: TemperateSeasonName;
  event?: CalendarEventDetails;
  timestamp: number;
  onClose: () => void;
};

// TODO: Finalise the information for the events
const DUMMY_EVENT_INFORMATION: Record<
  Exclude<CalendarEventName, "calendar">,
  {
    title: string;
    description: string;
    prevention?: InventoryItemName | "Mangrove";
  }
> = {
  tornado: {
    title: "calendar.events.tornado.title",
    description: "calendar.events.tornado.description",
    prevention: "Tornado Pinwheel",
  },
  fullMoon: {
    title: "calendar.events.fullMoon.title",
    description: "calendar.events.fullMoon.description",
  },
  tsunami: {
    title: "calendar.events.tsunami.title",
    description: "calendar.events.tsunami.description",
    prevention: "Mangrove",
  },
  unknown: {
    title: "calendar.events.unknown.title",
    description: "calendar.events.unknown.description",
  },
};

export const SeasonDayDetails: React.FC<Props> = ({
  event,
  season,
  timestamp,
  onClose,
}) => {
  const { t } = useTranslation();
  const [showIngredients, setShowIngredients] = useState(false);

  const seasonDetails = SEASON_DETAILS[season];

  if (!seasonDetails) {
    return null;
  }

  if (!event) {
    return (
      <InnerPanel className="shadow inset-3 mx-5 sm:mx-0">
        <div className="p-1 mb-2">
          <Label type="default" className="ml-1 mb-1" icon={seasonDetails.icon}>
            {t(`season.${season}`)}
          </Label>
          <div className="text-xs mb-2">{seasonDetails.description}</div>
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
                <img
                  key={item}
                  src={ITEM_DETAILS[item].image}
                  className="w-6"
                />
              ))}
            </div>
          </div>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </InnerPanel>
    );
  }

  const { name } = event;
  const title =
    name === "calendar"
      ? event.title
      : t(
          DUMMY_EVENT_INFORMATION[
            name as Exclude<CalendarEventName, "calendar">
          ].title,
        );
  const description =
    name === "calendar"
      ? event.description
      : t(
          DUMMY_EVENT_INFORMATION[
            name as Exclude<CalendarEventName, "calendar">
          ].description,
        );

  const icon = CALENDAR_EVENT_ICONS[name];

  return (
    <InnerPanel className="shadow mx-5 sm:mx-0">
      <div className="flex flex-row justify-between mb-2">
        <Label type="default">{title}</Label>
        <Label type="info">{getRelativeTime(timestamp)}</Label>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex flex-col items-center">
          <InnerPanel>
            <img src={icon} className="w-12 h-12 object-contain" />
          </InnerPanel>
        </div>

        <div className="flex-1 text-xs">{description}</div>
      </div>

      {name === "unknown" && (
        <div className="flex flex-col gap-2 my-2 w-full">
          <Label type="default">{t("temperateSeason.possibleEvents")}</Label>
          <div className="flex flex-col gap-2">
            {Object.entries(DUMMY_EVENT_INFORMATION)
              .filter(([name]) => name !== "unknown")
              .map(([name, data]) => (
                <div key={name} className="flex items-center gap-1">
                  <img
                    src={CALENDAR_EVENT_ICONS[name as CalendarEventName]}
                    className="w-6 h-6"
                  />

                  <div className="flex flex-col">
                    <span className="text-xs">{name}</span>
                    {data.prevention && (
                      <span className="text-xxs">{data.prevention}</span>
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
