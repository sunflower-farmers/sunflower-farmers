import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import boat from "assets/npcs/island_boat_pirate.png";
import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { IslandList } from "./IslandList";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Equipped } from "features/game/types/bumpkin";
import { Tutorial } from "./Tutorial";
import { Bumpkin, Inventory } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import * as Auth from "features/auth/lib/Provider";

interface Props {
  isOpen: boolean;
  bumpkin: Bumpkin | undefined;
  inventory: Inventory;
  isVisiting?: boolean;
  isTravelAllowed?: boolean;
  hasWallet?: boolean;
  onShow?: () => void;
  onClose: () => void;
}

export const IslandTravelModal = ({
  bumpkin,
  inventory,
  isVisiting = false,
  isTravelAllowed = true,
  hasWallet,
  isOpen,
  onShow,
  onClose,
}: Props) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Boat")
  );

  const { authService } = useContext(Auth.Context);

  const bumpkinParts: Partial<Equipped> = {
    body: "Goblin Potion",
    hair: "Sun Spots",
    pants: "Brown Suspenders",
    shirt: "SFL T-Shirt",
    tool: "Sword",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  const acknowledge = () => {
    acknowledgeTutorial("Boat");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <Modal centered show={isOpen} onHide={acknowledge} onShow={onShow}>
        <Tutorial onClose={acknowledge} bumpkinParts={bumpkinParts} />
      </Modal>
    );
  }

  const Content = () => {
    if (!isTravelAllowed) {
      return <span className="loading">Loading</span>;
    }

    if (!hasWallet) {
      return (
        <>
          <p className="text-xs mt-2 text-center mb-2">
            Connect a Web3 wallet to travel to islands and trade with other
            players.
          </p>
          <Button onClick={() => authService.send("CONNECT")}>
            Connect Wallet
          </Button>
        </>
      );
    }

    return (
      <IslandList
        bumpkin={bumpkin}
        showVisitList={isVisiting}
        inventory={inventory}
      />
    );
  };

  return (
    <Modal centered show={isOpen} onHide={onClose} onShow={onShow}>
      <Panel className="relative" hasTabs bumpkinParts={bumpkinParts}>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab isActive>
            <img src={boat} className="h-5 mr-2" />
            <span className="text-sm whitespace-nowrap">Travel To</span>
          </Tab>
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <Content />
      </Panel>
    </Modal>
  );
};
