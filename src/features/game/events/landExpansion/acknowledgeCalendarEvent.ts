import {
  getActiveCalenderEvent,
  SeasonalEventName,
} from "features/game/types/calendar";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type AcknowledgeCalendarEventAction = {
  type: "calendarEvent.acknowledged";
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeCalendarEventAction;
  createdAt?: number;
};

export function acknowledgeCalendarEvent({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const event = getActiveCalenderEvent({ game: stateCopy });

    if (!event) {
      throw new Error("Event not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    stateCopy.calendar[event as SeasonalEventName]!.acknowledgedAt = createdAt;

    return stateCopy;
  });
}
