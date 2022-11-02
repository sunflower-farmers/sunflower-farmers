import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { screenTracker } from "lib/utils/screen";
import { Refreshing } from "features/auth/components/Refreshing";
import { Context } from "../GameProvider";
import { StateValues } from "../lib/gameMachine";
import { ToastManager } from "../toast/ToastManager";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";
import { Expanding } from "./components/Expanding";
import { ExpansionSuccess } from "./components/ExpansionSuccess";

import { Notifications } from "../components/Notifications";
import { Announcements } from "features/announcements/Announcement";
import { Hoarding } from "../components/Hoarding";
import { NoBumpkin } from "features/island/bumpkin/NoBumpkin";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
import { Rules } from "../components/Rules";
import { PlaceableOverlay } from "./components/PlaceableOverlay";
import { Route, Routes } from "react-router-dom";
import { Land } from "./Land";
import { Helios } from "features/helios/Helios";
import { Hud } from "features/island/hud/Hud";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  levelling: false,
  refreshing: true,
  announcing: true,
  deposited: true,
  expanding: true,
  expanded: true,
  hoarding: true,
  editing: false,
  noBumpkinFound: true,
  swarming: true,
  coolingDown: true,
  gameRules: true,
  randomising: false,
  migrated: false,
  migrating: false,
  offerMigration: false,
  visiting: false,
  loadFarmToVisit: true,
  landToVisitNotFound: true,
  checkIsVisiting: false,
};

export const Game: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [gameState, send] = useActor(gameService);

  useInterval(() => send("SAVE"), AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (gameState.context.actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [gameState]);

  useEffect(() => {
    const save = () => {
      send("SAVE");
    };

    window.addEventListener("blur", save);

    screenTracker.start(authService);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("blur", save);
      screenTracker.pause();
    };
  }, []);

  const loading =
    gameState.matches("loading") || gameState.matches("loadFarmToVisit");

  if (loading) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Modal show centered backdrop={false}>
          <Panel>
            <Loading />
          </Panel>
        </Modal>
      </div>
    );
  }

  if (gameState.matches("landToVisitNotFound")) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <div className="absolute z-20">
          <VisitingHud />
        </div>
        <Modal show centered backdrop={false}>
          <Panel>
            <p className="text-center mb-2">
              It looks like this land has not migrated to Sunflower Isles yet!
            </p>
            <VisitLandExpansionForm />
          </Panel>
        </Modal>
      </div>
    );
  }

  const GameContent = () => {
    if (gameState.matches("visiting")) {
      return (
        <>
          <div className="absolute z-10 w-full h-full">
            <Routes>
              <Route path="/:id" element={<Land />} />
            </Routes>
          </div>
          <div className="absolute z-20">
            <VisitingHud />
          </div>
        </>
      );
    }

    return (
      <>
        <div className="absolute z-10 w-full h-full">
          <PlaceableOverlay>
            <Routes>
              <Route path="/" element={<Land />} />
              <Route path="/helios" element={<Helios key="helios" />} />
              <Route element={<Land />} />
            </Routes>
          </PlaceableOverlay>
        </div>
        <div className="absolute z-20">
          <Hud />
        </div>
      </>
    );
  };

  return (
    <>
      <ToastManager />

      <Modal show={SHOW_MODAL[gameState.value as StateValues]} centered>
        <Panel>
          {gameState.matches("loading") && <Loading />}
          {gameState.matches("refreshing") && <Refreshing />}
          {gameState.matches("deposited") && <Notifications />}
          {gameState.matches("announcing") && <Announcements />}
          {gameState.matches("error") && (
            <ErrorMessage
              errorCode={gameState.context.errorCode as ErrorCode}
            />
          )}
          {gameState.matches("synced") && <Success />}
          {gameState.matches("syncing") && <Syncing />}
          {gameState.matches("expanded") && <ExpansionSuccess />}
          {gameState.matches("expanding") && <Expanding />}
          {gameState.matches("hoarding") && <Hoarding />}
          {gameState.matches("swarming") && <Swarming />}
          {gameState.matches("noBumpkinFound") && <NoBumpkin />}
          {gameState.matches("coolingDown") && <Cooldown />}
          {gameState.matches("gameRules") && <Rules />}
        </Panel>
      </Modal>

      {GameContent()}
    </>
  );
};
