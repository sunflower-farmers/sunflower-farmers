import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getTotalOilMillisInMachine } from "./supplyCropMachine";

export type ResetSkillsAction = {
  type: "skills.reset";
};

type Options = {
  state: GameState;
  action: ResetSkillsAction;
  createdAt?: number;
};

export function resetSkills({ state, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    const { bumpkin, buildings } = game;

    // Check if bumpkin exists
    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    // Check if bumpkin has any skills
    if (Object.keys(bumpkin.skills).length === 0) {
      throw new Error("You do not have any skills to reset");
    }

    // Check if allowed to reset skills (once per 3 months)
    if (bumpkin.previousSkillsResetAt) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (bumpkin.previousSkillsResetAt > threeMonthsAgo.getTime()) {
        throw new Error("You can only reset your skills once every 3 months");
      }
    }

    const cropMachine = buildings["Crop Machine"];
    const { queue = [], unallocatedOilTime = 0 } = cropMachine?.[0] ?? {};
    // If player has Crop Expansion Module, they can't reset skills if they have any crops in the additional slots
    if (bumpkin.skills["Field Expansion Module"]) {
      if (queue.length > 5) {
        throw new Error(
          "You can't reset skills with crops in the additional slots",
        );
      }
    }

    // If player has more oil in Crop Machine than regular tank limit, they can't reset skills
    if (bumpkin.skills["Leak-Proof Tank"]) {
      const oilMillisInMachine = getTotalOilMillisInMachine(
        queue,
        unallocatedOilTime,
      );
      if (oilMillisInMachine > 48 * 60 * 60 * 1000) {
        throw new Error("Oil tank would exceed capacity after reset");
      }
    }

    // Check of player has enough SFL to reset skills
    if (game.balance.lt(10)) {
      throw new Error("You do not have enough SFL to reset your skills");
    }

    // All checks passed, reset skills
    bumpkin.skills = {};
    bumpkin.previousSkillsResetAt = createdAt;
    game.balance = game.balance.minus(10);

    return game;
  });
}
