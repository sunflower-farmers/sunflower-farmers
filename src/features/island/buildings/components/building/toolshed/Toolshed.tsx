import React from "react";

import toolshed from "assets/buildings/toolshed.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

export const Toolshed: React.FC<BuildingProps> = ({ onRemove, isBuilt }) => {
  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      return;
    }
  };

  return (
    <BuildingImageWrapper
      name="Toolshed"
      onClick={handleClick}
      nonInteractible={!onRemove}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 36}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -2}px`,
        }}
      >
        <img
          src={toolshed}
          style={{
            width: `${PIXEL_SCALE * 36}px`,
          }}
        />
      </div>
    </BuildingImageWrapper>
  );
};
