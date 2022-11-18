import cloneDeep from "lodash.clonedeep";
import { GameState } from "../../types/game";

export type LandExpansionMigrateAction = {
  type: "game.migrated";
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionMigrateAction;
  createdAt?: number;
};

export const canMigrate = (state: GameState) => {
  const { skills, inventory } = state;
  const { farming, gathering } = skills;

  // const hasEnoughXP = farming.add(gathering).gte(new Decimal(25000));
  const hasEnoughXP = false; // TODO
  const isWarrior = inventory.Warrior?.gte(1);
  const isMod = inventory["Discord Mod"]?.gte(1);
  const isCoder = inventory.Coder?.gte(1);
  const isArtist = inventory.Artist?.gte(1);

  return !!isMod || !!isCoder || !!isArtist;
};

export function migrate({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;

  stateCopy.migrated = true;

  return stateCopy;
}
