import React, { useRef, useState } from "react";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import dropSheet from "assets/resources/gold/gold_rock_drop.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import gold from "assets/resources/gold_ore.png";

const DROP_SHEET_FRAME_WIDTH = 112;
const DROP_SHEET_FRAME_HEIGHT = 48;

interface Props {
  resourceAmount?: number;
}

const DepletingGoldComponent: React.FC<Props> = ({ resourceAmount }) => {
  const [playing, setPlaying] = useState(false);
  const sparkGif = useRef<SpriteSheetInstance>();

  return (
    <div className="absolute w-full h-full pointer-events-none">
      <Spritesheet
        style={{
          opacity: playing ? 1 : 0,
          transition: "opacity 0.2s ease-in",

          width: `${DROP_SHEET_FRAME_WIDTH * PIXEL_SCALE}px`,
          height: `${DROP_SHEET_FRAME_HEIGHT * PIXEL_SCALE}px`,
          imageRendering: "pixelated",

          // Adjust the base of resource to be perfectly aligned to
          // on a grid point.
          bottom: `${PIXEL_SCALE * -13}px`,
          right: `${PIXEL_SCALE * -63}px`,
        }}
        className="absolute z-40"
        getInstance={(spritesheet) => {
          sparkGif.current = spritesheet;
          spritesheet.goToAndPlay(0);
          setPlaying(true);
        }}
        image={dropSheet}
        widthFrame={DROP_SHEET_FRAME_WIDTH}
        heightFrame={DROP_SHEET_FRAME_HEIGHT}
        fps={20}
        steps={10}
        direction={`forward`}
        autoplay={false}
        loop={true}
        onLoopComplete={async (spritesheet) => {
          // fade out resource sprite then remove sprite from render
          spritesheet.pause();
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setPlaying(false);
        }}
      />

      {/* Collected resource amount */}
      {!!resourceAmount && (
        <div
          className="flex justify-center absolute w-full z-40"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            left: `${PIXEL_SCALE * -16}px`,
            top: `${PIXEL_SCALE * -12}px`,
            opacity: playing ? 1 : 0,
            transition: "opacity 0.2s ease-in",
          }}
        >
          <img
            src={gold}
            className="mr-2"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
          <span className="text-sm">{`+${resourceAmount}`}</span>
        </div>
      )}
    </div>
  );
};

export const DepletingGold = React.memo(DepletingGoldComponent);
