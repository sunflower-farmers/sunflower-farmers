import React from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { getActiveCalenderEvent } from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Tornado } from "./Tornado";
import { FullMoon } from "./FullMoon";

export const CalendarEvent: React.FC = () => {
  const { gameState, gameService } = useGame();
  const { t } = useAppTranslation();
  const event = getActiveCalenderEvent({ game: gameState.context.state });

  const handleAcknowledge = () => {
    gameService.send({ type: "calendarEvent.acknowledged" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  return (
    <Modal show>
      {event === "tornado" && <Tornado acknowledge={handleAcknowledge} />}
      {event === "full moon" && <FullMoon acknowledge={handleAcknowledge} />}
      {!event && (
        <Panel>
          <Button
            onClick={() => {
              gameService.send({ type: "ACKNOWLEDGE" });
            }}
          >
            {t("close")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
