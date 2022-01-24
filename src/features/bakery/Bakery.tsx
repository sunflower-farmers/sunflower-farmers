import React from "react";
import { Modal } from "react-bootstrap";

import bakery from "assets/buildings/bakery.png";
import soup from "assets/icons/bakery.png";

import { Crafting } from "./components/Crafting";
import { Action } from "components/ui/Action";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Bakery: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 100}px`,
        height: `${GRID_WIDTH_PX * 5.2}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * -12}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 19}px)`,
      }}
    >
      <img
        src={bakery}
        alt="market"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:img-highlight"
        style={{
          width: "300px",
          height: "300px",
        }}
      />
      <Action
        className="relative bottom-9 left-28"
        text="Bake"
        icon={soup}
        onClick={() => setIsOpen(true)}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Crafting onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
