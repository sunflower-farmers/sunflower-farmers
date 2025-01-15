import React, { useContext, useRef, useState } from "react";
import { Transition } from "@headlessui/react";

import emptyPot from "assets/greenhouse/greenhouse_pot.webp";
import grapeSeedling from "assets/greenhouse/grape_seedling.webp";
import grapeGrowing from "assets/greenhouse/grape_growing.webp";
import grapeAlmost from "assets/greenhouse/grape_almost.webp";
import grapeReady from "assets/greenhouse/grape_ready.webp";
import oliveSeedling from "assets/greenhouse/olive_seedling.webp";
import oliveGrowing from "assets/greenhouse/olive_growing.webp";
import oliveAlmost from "assets/greenhouse/olive_almost.webp";
import oliveReady from "assets/greenhouse/olive_ready.webp";
import riceSeedling from "assets/greenhouse/rice_seedling.webp";
import riceGrowing from "assets/greenhouse/rice_growing.webp";
import riceAlmost from "assets/greenhouse/rice_almost.webp";
import riceReady from "assets/greenhouse/rice_ready.webp";
import barrelIcon from "assets/resources/oil_barrel.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  GreenHouseCropName,
  GreenHouseCropSeedName,
} from "features/game/types/crops";
import { GreenHouseFruitName } from "features/game/types/fruits";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { LiveProgressBar } from "components/ui/ProgressBar";
import { getReadyAt } from "features/game/events/landExpansion/harvestGreenHouse";
import { ITEM_DETAILS } from "features/game/types/images";
import { GreenhousePlant } from "features/game/types/game";
import {
  getOilUsage,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { QuickSelect } from "./QuickSelect";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";

type Stage = "seedling" | "growing" | "almost" | "ready";
const PLANT_STAGES: Record<
  GreenHouseCropName | GreenHouseFruitName,
  Record<Stage, string>
> = {
  Grape: {
    seedling: grapeSeedling,
    almost: grapeAlmost,
    growing: grapeGrowing,
    ready: grapeReady,
  },
  Olive: {
    almost: oliveAlmost,
    growing: oliveGrowing,
    ready: oliveReady,
    seedling: oliveSeedling,
  },
  Rice: {
    almost: riceAlmost,
    growing: riceGrowing,
    ready: riceReady,
    seedling: riceSeedling,
  },
};

interface Props {
  id: number;
}

const _state = (state: MachineState) => state.context.state;

export const GreenhousePot: React.FC<Props> = ({ id }) => {
  const {
    gameService,
    selectedItem,
    showAnimations,
    enableQuickSelect,
    showTimers,
  } = useContext(Context);

  const { t } = useAppTranslation();
  const [_, setRender] = useState<number>(0);
  const [showHarvested, setShowHarvested] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showTimeRemaining, setShowTimeRemaining] = useState(false);
  const [showOilWarning, setShowOilWarning] = useState(false);
  const harvested = useRef<GreenhousePlant>();

  const state = useSelector(gameService, _state);
  const { inventory, greenhouse } = state;
  const { pots } = greenhouse;

  const pot = pots[id];

  const oilRequired = getOilUsage({
    seed: selectedItem as GreenHouseCropSeedName,
    game: state,
  });

  const plant = async (
    seed: GreenHouseCropSeedName = selectedItem as GreenHouseCropSeedName,
  ) => {
    if (
      !seed ||
      !SEED_TO_PLANT[seed as GreenHouseCropSeedName] ||
      !inventory[seed]?.gte(1)
    ) {
      if (enableQuickSelect) {
        setShowQuickSelect(true);
      }
      return;
    }

    if (oilRequired > gameService.state.context.state.greenhouse.oil) {
      setShowOilWarning(true);
      await new Promise((res) => setTimeout(res, 2000));
      setShowOilWarning(false);
      return;
    }

    gameService.send("greenhouse.planted", {
      id,
      seed,
    });
  };

  if (!pot?.plant) {
    return (
      <div
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
      >
        {/* Harvest Animation */}
        {showAnimations && (
          <Transition
            appear={true}
            id="oil-reserve-collected-amount"
            show={showHarvested}
            enter="transition-opacity transition-transform duration-200"
            enterFrom="opacity-0 translate-y-6"
            enterTo="opacity-100 -translate-y-2"
            leave="transition-opacity duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="flex -top-2 left-[40%] absolute w-full z-40 pointer-events-none"
          >
            <img
              src={ITEM_DETAILS[harvested.current?.name ?? "Rice"].image}
              className="mr-2 img-highlight-heavy"
              style={{
                width: `${PIXEL_SCALE * 7}px`,
              }}
            />
            <span className="text-sm yield-text">{`+${formatNumber(harvested.current?.amount ?? 0)}`}</span>
          </Transition>
        )}

        {/* Quick Select */}
        <Transition
          appear={true}
          show={showQuickSelect}
          enter="transition-opacity  duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex top-[-200%] left-[50%] absolute z-40 shadow-md"
        >
          <QuickSelect
            options={[
              { name: "Grape Seed", icon: "Grape", showSecondaryImage: true },
              { name: "Rice Seed", icon: "Rice", showSecondaryImage: true },
              { name: "Olive Seed", icon: "Olive", showSecondaryImage: true },
            ]}
            onClose={() => setShowQuickSelect(false)}
            onSelected={(seed) => {
              plant(seed as GreenHouseCropSeedName);
              setShowQuickSelect(false);
            }}
            type={t("quickSelect.greenhouseSeeds")}
            showExpanded
          />
        </Transition>

        {/* Oil Warning */}
        <Transition
          appear={true}
          show={showOilWarning}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-4 left-[80%] absolute z-40 shadow-md w-auto"
        >
          <Label type="danger" icon={barrelIcon} className="whitespace-nowrap">
            {`${oilRequired} ${t("greenhouse.oilRequired")}`}
          </Label>
        </Transition>

        <img
          src={emptyPot}
          className="cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 28}px`,
          }}
          onClick={() => plant()}
        />
      </div>
    );
  }

  const plantedAt = pot.plant.plantedAt;
  const readyAt = getReadyAt({
    game: gameService.state.context.state,
    plant: pot.plant.name,
    createdAt: plantedAt,
  });
  const harvestSeconds = (readyAt - plantedAt) / 1000;
  const secondsLeft = (readyAt - Date.now()) / 1000;
  const startAt = plantedAt ?? 0;

  const percentage = ((harvestSeconds - secondsLeft) / harvestSeconds) * 100;

  const harvest = async () => {
    if (Date.now() < readyAt) {
      setShowTimeRemaining(true);
      await new Promise((res) => setTimeout(res, 2000));
      setShowTimeRemaining(false);
      return;
    }

    harvested.current = pot.plant;

    gameService.send("greenhouse.harvested", {
      id,
    });

    if (showAnimations) {
      setShowHarvested(true);

      await new Promise((res) => setTimeout(res, 2000));

      setShowHarvested(false);
    }
  };

  let stage: Stage = "ready";

  if (percentage < 20) {
    stage = "seedling";
  } else if (percentage < 50) {
    stage = "growing";
  } else if (percentage < 100) {
    stage = "almost";
  }

  return (
    <div
      style={{
        width: `${PIXEL_SCALE * 28}px`,
      }}
    >
      <img
        src={PLANT_STAGES[pot.plant.name][stage]}
        className="cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 28}px`,
        }}
        onClick={harvest}
      />
      {showTimers && Date.now() < readyAt && (
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 2.5}px`,
            left: `${PIXEL_SCALE * 6.5}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <LiveProgressBar
            key={`${startAt}-${readyAt}`}
            startAt={startAt}
            endAt={readyAt}
            formatLength="short"
            onComplete={() => setRender((r) => r + 1)}
          />
        </div>
      )}

      {/* Time left */}
      <Transition
        appear={true}
        show={showTimeRemaining}
        enter="transition-opacity transition-transform duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-0 left-[90%] absolute z-40 shadow-md w-[200px]"
      >
        <Label
          type="info"
          icon={ITEM_DETAILS[pot.plant.name].image}
          secondaryIcon={SUNNYSIDE.icons.stopwatch}
        >
          {`${pot.plant.name}: ${secondsToString(secondsLeft, {
            length: "medium",
          })}`}
        </Label>
      </Transition>
    </div>
  );
};
