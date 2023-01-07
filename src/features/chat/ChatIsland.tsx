import React, { useContext, useLayoutEffect } from "react";
import { useActor, useInterpret } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import background from "assets/land/levels/level_2.webp";

import { Context } from "features/game/GameProvider";
import { Chat } from "./Chat";
import { chatMachine, MachineInterpreter } from "./chatMachine";
import { PlaceableBumpkin } from "./PlaceableBumpkin";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { ChatUI } from "./ChatUI";
import { Bumpkin } from "features/game/types/game";

export const ChatIsland: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const myBumpkin = state.bumpkin as Bumpkin;

  const chatService = useInterpret(chatMachine, {
    context: {
      bumpkin: myBumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.HeliosBackGround, "auto");

    return () => {
      chatService.send("DISCONNECT");
    };
  }, []);

  // Load data
  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          src={background}
          id={Section.HeliosBackGround}
          className="h-auto"
          style={{
            width: `${36 * GRID_WIDTH_PX}px`,
          }}
        />

        <Modal show={chatState.matches("connecting")} centered>
          <Panel>
            <span className="loading">Connecting</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("loadingPlayers")} centered>
          <Panel>
            <span className="loading">Loading Players</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("disconnected")} centered>
          <Panel>
            <span>Disconnected</span>
          </Panel>
        </Modal>
        <Modal show={chatState.matches("error")} centered>
          <Panel>
            <span>Error</span>
          </Panel>
        </Modal>

        <Chat
          messages={chatState.context.messages}
          bumpkin={myBumpkin}
          chatService={chatService}
          position={chatState.context.currentPosition}
          bumpkins={chatState.context.bumpkins}
        />
      </div>
      {chatState.matches("connected") && !chatState.context.currentPosition && (
        <PlaceableBumpkin
          onPlace={(coordinates) => {
            console.log("Send", coordinates);
            chatService.send("SEND_LOCATION", { coordinates });
          }}
          bumpkin={myBumpkin}
        />
      )}
      {chatState.context.currentPosition && (
        <ChatUI
          onMessage={(text) => {
            chatService.send("SEND_CHAT_MESSAGE", {
              text,
            });
          }}
        />
      )}
    </>
  );
};
