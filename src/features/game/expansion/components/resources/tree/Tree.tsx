import React, { useContext, useEffect, useRef, useState } from "react";

import { TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { getTimeLeft } from "lib/utils/time";
import {
  GameState,
  InventoryItemName,
  Reward,
  Tree as TreeType,
} from "features/game/types/game";
import {
  canChop,
  getRequiredAxeAmount,
} from "features/game/events/landExpansion/chop";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { DepletedTree } from "./components/DepletedTree";
import { DepletingTree } from "./components/DepletingTree";
import { RecoveredTree } from "./components/RecoveredTree";
import { gameAnalytics } from "lib/gameAnalytics";
import { getBumpkinLevel } from "features/game/lib/level";
import { useSound } from "lib/utils/hooks/useSound";
import { hasReputation, Reputation } from "features/game/lib/reputation";

const HITS = 3;
const tool = "Axe";

const HasTool = (
  inventory: Partial<Record<InventoryItemName, Decimal>>,
  gameState: GameState,
) => {
  const axesNeeded = getRequiredAxeAmount(inventory, gameState);

  // has enough axes to chop the tree

  if (axesNeeded.lte(0)) return true;

  return (inventory[tool] ?? new Decimal(0)).gte(axesNeeded);
};

const selectIsland = (state: MachineState) => state.context.state.island.type;
const selectInventory = (state: MachineState) => state.context.state.inventory;
const selectTreesChopped = (state: MachineState) =>
  state.context.state.bumpkin?.activity?.["Tree Chopped"] ?? 0;
const selectGame = (state: MachineState) => state.context.state;

const compareResource = (prev: TreeType, next: TreeType) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
const compareGame = (prev: GameState, next: GameState) =>
  isCollectibleBuilt({ name: "Foreman Beaver", game: prev }) ===
  isCollectibleBuilt({ name: "Foreman Beaver", game: next });

// A player that has been vetted and is engaged in the season.
const isSeasonedPlayer = (state: MachineState) =>
  // - level 60+
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 60 &&
  // - verified (personhood verification)
  state.context.verified &&
  hasReputation({
    game: state.context.state,
    reputation: Reputation.Cropkeeper,
  });

interface Props {
  id: string;
  index: number;
}

export const Tree: React.FC<Props> = ({ id }) => {
  const { gameService, shortcutItem, showAnimations } = useContext(Context);

  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward>();

  // When to hide the resource that pops out
  const [collecting, setCollecting] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState<number>();

  const isSeasoned = useSelector(gameService, isSeasonedPlayer);

  const divRef = useRef<HTMLDivElement>(null);

  const { play: treeFallAudio } = useSound("tree_fall");

  // Reset the shake count when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setTouchCount(0);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const resource = useSelector(
    gameService,
    (state) => state.context.state.trees[id],
    compareResource,
  );
  const game = useSelector(gameService, selectGame, compareGame);
  const inventory = useSelector(
    gameService,
    selectInventory,
    (prev, next) =>
      HasTool(prev, game) === HasTool(next, game) &&
      (prev.Logger ?? new Decimal(0)).equals(next.Logger ?? new Decimal(0)),
  );

  const treesChopped = useSelector(gameService, selectTreesChopped);
  const island = useSelector(gameService, selectIsland);

  const hasTool = HasTool(inventory, game);
  const timeLeft = getTimeLeft(resource.wood.choppedAt, TREE_RECOVERY_TIME);
  const chopped = !canChop(resource);

  useUiRefresher({ active: chopped });

  const claimAnyReward = () => {
    if (resource.wood.reward) {
      gameService.send("treeReward.collected", {
        treeIndex: id,
      });
    }
  };

  const shake = () => {
    if (!hasTool) return;

    setTouchCount((count) => count + 1);
    if (!isCollectibleBuilt({ name: "Foreman Beaver", game }))
      shortcutItem(tool);

    if (game.bumpkin.skills["Insta-Chop"]) {
      // insta-chop the tree
      claimAnyReward();
      chop();
    }

    // need to hit enough times to collect resource
    if (touchCount < HITS - 1) return;

    if (resource.wood.reward) {
      // they have touched enough!
      if (isSeasoned) {
        claimAnyReward();
      } else {
        setReward(resource.wood.reward);
        return;
      }
    }

    // can collect resources otherwise
    chop();
    setTouchCount(0);
  };

  const onCollectChest = (success: boolean) => {
    setReward(undefined);
    if (success) {
      chop();
    }
  };

  const chop = async () => {
    const newState = gameService.send("timber.chopped", {
      index: id,
      item: "Axe",
    });

    if (!newState.matches("hoarding")) {
      if (showAnimations) {
        setCollecting(true);
        setCollectedAmount(resource.wood.amount);
      }

      treeFallAudio();

      if (showAnimations) {
        await new Promise((res) => setTimeout(res, 3000));
        setCollecting(false);
        setCollectedAmount(undefined);
      }
    }

    if (newState.context.state.bumpkin?.activity?.["Tree Chopped"] === 1) {
      gameAnalytics.trackMilestone({ event: "Tutorial:TreeChopped:Completed" });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Resource ready to collect */}
      {!chopped && (
        <div ref={divRef} className="absolute w-full h-full" onClick={shake}>
          <RecoveredTree
            hasTool={hasTool}
            touchCount={touchCount}
            showHelper={treesChopped < 3 && treesChopped + 1 === Number(id)}
            island={island}
          />
        </div>
      )}

      {/* Depleting resource animation */}
      {collecting && <DepletingTree resourceAmount={collectedAmount} />}

      {/* Depleted resource */}
      {chopped && <DepletedTree timeLeft={timeLeft} island={island} />}

      {/* Chest reward */}
      {reward && (
        <ChestReward
          collectedItem={"Wood"}
          reward={reward}
          onCollected={onCollectChest}
          onOpen={claimAnyReward}
        />
      )}
    </div>
  );
};
