import React, { useContext, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Reward,
  PlantedCrop,
  PlacedItem,
  InventoryItemName,
} from "features/game/types/game";
import { CROPS, CROP_SEEDS } from "features/game/types/crops";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";
import {
  getAffectedWeather,
  getCompletedWellCount,
  isPlotFertile,
} from "features/game/events/landExpansion/plant";
import Spritesheet from "components/animation/SpriteAnimator";
import { HARVEST_PROC_ANIMATION } from "features/island/plots/lib/plant";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { NonFertilePlot } from "./components/NonFertilePlot";
import { FertilePlot } from "./components/FertilePlot";
import { ChestReward } from "../common/chest-reward/ChestReward";
import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { BuildingName } from "features/game/types/buildings";
import { ZoomContext } from "components/ZoomProvider";
import { CROP_COMPOST } from "features/game/types/composters";
import { gameAnalytics } from "lib/gameAnalytics";
import { SUNNYSIDE } from "assets/sunnyside";
import { SeedName } from "features/game/types/seeds";
import { getBumpkinLevel } from "features/game/lib/level";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transition } from "@headlessui/react";
import { QuickSelect } from "features/greenhouse/QuickSelect";
import { formatNumber } from "lib/utils/formatNumber";
import { hasFeatureAccess } from "lib/flags";
import { useSound } from "lib/utils/hooks/useSound";
import { TornadoPlot } from "./components/TornadoPlot";
import { hasReputation, Reputation } from "features/game/lib/reputation";

export function getYieldColour(yieldAmount: number) {
  if (yieldAmount < 2) {
    return "white";
  }

  if (yieldAmount < 10) {
    return "#ffeb37"; // Yellow
  }

  return "#71e358"; // Green
}

const selectCrops = (state: MachineState) => state.context.state.crops;
const selectBuildings = (state: MachineState) => state.context.state.buildings;
const selectLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

const selectHarvests = (state: MachineState) => {
  return getKeys(CROPS).reduce(
    (total, crop) =>
      total +
      (state.context.state.bumpkin?.activity?.[`${crop} Harvested`] ?? 0),
    0,
  );
};

const selectPlants = (state: MachineState) =>
  getKeys(CROPS).reduce(
    (total, crop) =>
      total + (state.context.state.bumpkin?.activity?.[`${crop} Planted`] ?? 0),
    0,
  );

const selectCropsSold = (state: MachineState) =>
  state.context.state.bumpkin?.activity?.["Sunflower Sold"] ?? 0;

const compareBuildings = (
  prev: Partial<Record<BuildingName, PlacedItem[]>>,
  next: Partial<Record<BuildingName, PlacedItem[]>>,
) => {
  return getCompletedWellCount(prev) === getCompletedWellCount(next);
};

const _bumpkinLevel = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0);

// A player that has been vetted and is engaged in the season.
const isSeasonedPlayer = (state: MachineState) =>
  // - level 60+
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 60 &&
  // - verified (personhood verification)
  state.context.verified &&
  hasReputation({ game: state.context.state, reputation: Reputation.Grower });

interface Props {
  id: string;
  index: number;
}
export const Plot: React.FC<Props> = ({ id, index }) => {
  const { t } = useAppTranslation();

  const { scale } = useContext(ZoomContext);
  const {
    gameService,
    selectedItem,
    showAnimations,
    enableQuickSelect,
    showTimers,
    shortcutItem,
  } = useContext(Context);
  const [procAnimation, setProcAnimation] = useState<JSX.Element>();
  const [touchCount, setTouchCount] = useState(0);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [reward, setReward] = useState<Omit<Reward, "sfl">>();
  const clickedAt = useRef<number>(0);
  const [pulsating, setPulsating] = useState(false);

  const crops = useSelector(gameService, selectCrops, (prev, next) => {
    return JSON.stringify(prev[id]) === JSON.stringify(next[id]);
  });
  const buildings = useSelector(gameService, selectBuildings, compareBuildings);
  const harvestCount = useSelector(gameService, selectHarvests);
  const plantCount = useSelector(gameService, selectPlants);
  const soldCount = useSelector(gameService, selectCropsSold);
  const isSeasoned = useSelector(gameService, isSeasonedPlayer);
  const harvested = useRef<PlantedCrop>();
  const [showHarvested, setShowHarvested] = useState(false);

  const { openModal } = useContext(ModalContext);

  const { play: plantAudio } = useSound("plant");
  const { play: harvestAudio } = useSound("harvest");

  const crop = crops?.[id]?.crop;
  const fertiliser = crops?.[id]?.fertiliser;

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;
  const bumpkin = state.bumpkin;
  const buds = state.buds;
  const plot = crops[id];

  const isFertile = isPlotFertile({
    plotIndex: id,
    crops: crops,
    buildings: buildings,
    bumpkin: bumpkin,
  });

  if (!isFertile) return <NonFertilePlot />;

  const weather = getAffectedWeather({ id, game: state });

  if (weather === "tornado") return <TornadoPlot game={state} />;

  const harvestCrop = async (crop: PlantedCrop) => {
    const newState = gameService.send("crop.harvested", {
      index: id,
    });

    if (newState.matches("hoarding")) return;

    harvestAudio();

    // firework animation
    if (showAnimations && crop.amount && crop.amount >= 10) {
      setProcAnimation(
        <Spritesheet
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -23}px`,
            left: `${PIXEL_SCALE * -10}px`,
            width: `${PIXEL_SCALE * HARVEST_PROC_ANIMATION.size}px`,
            imageRendering: "pixelated",
          }}
          image={HARVEST_PROC_ANIMATION.sprites[crop.name]}
          widthFrame={HARVEST_PROC_ANIMATION.size}
          heightFrame={HARVEST_PROC_ANIMATION.size}
          zoomScale={scale}
          fps={HARVEST_PROC_ANIMATION.fps}
          steps={HARVEST_PROC_ANIMATION.steps}
          onPause={() => setProcAnimation(<></>)}
        />,
      );
    }

    if (
      newState.context.state.bumpkin?.activity?.["Sunflower Harvested"] === 1
    ) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:SunflowerHarvested:Completed",
      });
    }

    harvested.current = crop;

    if (showAnimations) {
      setShowHarvested(true);

      await new Promise((res) => setTimeout(res, 2000));

      setShowHarvested(false);
    }
  };

  const onClick = (seed: SeedName = selectedItem as SeedName) => {
    const now = Date.now();

    // small buffer to prevent accidental double clicks
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // already looking at a reward
    if (reward) {
      return;
    }

    // increase touch count if there is a reward
    const readyToHarvest =
      !!crop && isReadyToHarvest(now, crop, CROPS[crop.name]);

    if (crop?.reward && readyToHarvest) {
      if (!isSeasoned && touchCount < 1) {
        // Add to touch count for reward pickup
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      if (isSeasoned) {
        gameService.send("cropReward.collected", {
          plotIndex: id,
        });
        harvestCrop(crop);
      } else {
        setReward(crop.reward);
      }

      return;
    }

    // apply fertilisers
    if (!readyToHarvest && seed && seed in CROP_COMPOST) {
      const state = gameService.send("plot.fertilised", {
        plotID: id,
        fertiliser: seed,
      });

      if (state.context.state.bumpkin?.activity?.["Crop Fertilised"] === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:Fertilised:Completed",
        });
      }

      return;
    }

    // plant
    if (!crop) {
      if (
        hasFeatureAccess(state, "CROP_QUICK_SELECT") &&
        enableQuickSelect &&
        (!seed || !(seed in CROP_SEEDS) || !inventory[seed]?.gte(1))
      ) {
        setShowQuickSelect(true);
        return;
      }

      const newState = gameService.send("seed.planted", {
        index: id,
        item: seed,
        cropId: uuidv4().slice(0, 8),
      });

      plantAudio();

      const planted =
        newState.context.state.bumpkin?.activity?.["Sunflower Planted"] ?? 0;

      if (planted === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:SunflowerPlanted:Completed",
        });
      }

      if (
        planted >= 3 &&
        seed === "Sunflower Seed" &&
        !newState.context.state.inventory["Sunflower Seed"]?.gt(0) &&
        !newState.context.state.inventory["Basic Scarecrow"]
      ) {
        openModal("BLACKSMITH");
      }

      return;
    }

    // harvest crop when ready
    if (readyToHarvest) {
      harvestCrop(crop);
    }

    setTouchCount(0);
  };

  const onCollectReward = (success: boolean) => {
    setReward(undefined);
    setTouchCount(0);

    if (success && crop) {
      harvestCrop(crop);
    }
  };

  return (
    <>
      <Transition
        appear={true}
        show={showQuickSelect}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="flex top-[-255%] left-[50%] absolute z-40"
      >
        <QuickSelect
          options={getKeys(CROP_SEEDS).map((seed) => ({
            name: seed as InventoryItemName,
            icon: CROP_SEEDS[seed].yield as InventoryItemName,
            showSecondaryImage: true,
          }))}
          onClose={() => setShowQuickSelect(false)}
          onSelected={(seed) => {
            onClick(seed as SeedName);
            setShowQuickSelect(false);
          }}
          type={t("quickSelect.cropSeeds")}
        />
      </Transition>

      <div onClick={() => onClick()} className="w-full h-full relative">
        {harvestCount < 3 &&
          harvestCount + 1 === Number(id) &&
          !!inventory.Shovel && (
            <img
              className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
              src={SUNNYSIDE.icons.dig_icon}
              onClick={() => onClick()}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * -8}px`,
                top: `${PIXEL_SCALE * -14}px`,
              }}
            />
          )}

        {plantCount < 3 && plantCount + 1 === Number(id) && soldCount > 0 && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            onClick={() => onClick()}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}

        <FertilePlot
          cropName={crop?.name}
          inventory={inventory}
          // TODO
          game={gameService.state?.context?.state ?? TEST_FARM}
          buds={buds}
          plot={plot}
          plantedAt={crop?.plantedAt}
          fertiliser={fertiliser}
          procAnimation={procAnimation}
          touchCount={touchCount}
          showTimers={showTimers}
          pulsating={showQuickSelect && pulsating}
        />
      </div>
      {reward && (
        <ChestReward
          collectedItem={crop?.name}
          reward={reward}
          onCollected={onCollectReward}
          onOpen={() =>
            gameService.send("cropReward.collected", {
              plotIndex: id,
            })
          }
        />
      )}

      {/* Harvest Animation */}
      {showAnimations && (
        <Transition
          appear={true}
          id="oil-reserve-collected-amount"
          show={showHarvested}
          enter="transition-opacity transition-transform duration-200"
          enterFrom="opacity-0 translate-y-4"
          enterTo="opacity-100 -translate-y-0"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex -top-2 left-[40%] absolute z-40 pointer-events-none"
        >
          <span
            className="text-sm yield-text"
            style={{
              color: getYieldColour(harvested.current?.amount ?? 0),
            }}
          >{`+${formatNumber(harvested.current?.amount ?? 0)}`}</span>
        </Transition>
      )}
    </>
  );
};
