import React from "react";

import palmTree from "assets/seasons/solar-flare/palm_tree.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PalmTree: React.FC = () => {
  return (
    <>
      <img
        src={palmTree}
        style={{
          width: `${PIXEL_SCALE * 29}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute"
        alt="Palm Tree"
      />
    </>
  );
};
