import React from "react";
import { Button } from "components/ui/Button";
import { SEASON_DETAILS } from "features/game/types/calendar";
import { CALENDAR_EVENT_ICONS } from "features/game/types/calendar";
import { LocalCalendarDetails } from "./GameCalendar";
import classNames from "classnames";

type Props = {
  index: number;
  details: LocalCalendarDetails;
  onClick: () => void;
};

export const DateCard: React.FC<Props> = ({ details, onClick }) => {
  const { specialEvent } = details;
  const seasonIcon = SEASON_DETAILS[details.season].icon;

  return (
    <Button
      key={details.dateString}
      variant={details.isPastDay ? "secondary" : "primary"}
      className={classNames(
        "min-h-[58px] w-full relative",
        details.specialEvent ? "cursor-pointer" : "",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-full h-full">
        <span className="absolute text-xxs -top-1 -left-0.5">
          {details.dateNumber}
        </span>
        {specialEvent && (
          <img
            src={CALENDAR_EVENT_ICONS[specialEvent]}
            className="w-5 mt-2.5"
          />
        )}
        <img
          src={seasonIcon}
          className="absolute h-[20px] -top-[11px] -right-[11px]"
        />
      </div>
    </Button>
  );
};
