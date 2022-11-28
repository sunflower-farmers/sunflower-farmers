import React from "react";

import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";
import { getKeys } from "features/game/types/craftables";
import close from "assets/icons/close.png";
import chefHat from "src/assets/bumpkins/small/hats/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Consumable,
  ConsumableName,
  CONSUMABLES,
} from "features/game/types/consumables";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Tab } from "components/ui/Tab";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: ConsumableName) => void;
}
export const FirePitModal: React.FC<Props> = ({ isOpen, onCook, onClose }) => {
  const firePitRecipes = getKeys(CONSUMABLES).reduce((acc, name) => {
    if (CONSUMABLES[name].building !== "Fire Pit") {
      return acc;
    }

    return [...acc, CONSUMABLES[name]];
  }, [] as Consumable[]);

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel
        bumpkinParts={{
          body: "Beige Farmer Potion",
          hair: "Buzz Cut",
          pants: "Farmer Pants",
          shirt: "Yellow Farmer Shirt",
          coat: "Chef Apron",
          tool: "Farmer Pitchfork",
          background: "Farm Background",
          shoes: "Black Farmer Boots",
        }}
        hasTabs
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 3}px`,
            right: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Tab isActive>
            <img src={chefHat} className="h-5 mr-2" />
            <span className="text-sm">Fire Pit</span>
          </Tab>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <Recipes recipes={firePitRecipes} onCook={onCook} onClose={onClose} />
      </Panel>
    </Modal>
  );
};
