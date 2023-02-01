import React from "react";

import keyStaffCase from "assets/sfts/skeleton_key_staff_case.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const SkeletonKeyStaff: React.FC = () => {
  return (
    <>
      <img
        src={keyStaffCase}
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          bottom: 0,
        }}
        className="absolute"
        alt="Skeleton Key Staff"
      />
    </>
  );
};
