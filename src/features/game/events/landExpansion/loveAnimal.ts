import Decimal from "decimal.js-light";
import {
  getAnimalLevel,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { AnimalLevel, ANIMALS, AnimalType } from "features/game/types/animals";
import { GameState, LoveAnimalItem } from "features/game/types/game";
import { produce } from "immer";

export type LoveAnimalAction = {
  type: "animal.loved";
  animal: AnimalType;
  id: string;
  item: LoveAnimalItem;
};

type Options = {
  state: Readonly<GameState>;
  action: LoveAnimalAction;
  createdAt?: number;
};

export function loveAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (createdAt > animal.asleepAt + 24 * 60 * 60 * 1000) {
      throw new Error("The animal is not sleeping");
    }

    if (createdAt < animal.asleepAt + 8 * 60 * 60 * 1000) {
      throw new Error("The animal has not been sleeping for more than 8 hours");
    }

    if (createdAt < animal.lovedAt + 8 * 60 * 60 * 1000) {
      throw new Error("The animal was loved in the last 8 hours");
    }

    if (animal.item !== action.item) {
      throw new Error(`${action.item} is the wrong item`);
    }

    if ((copy.inventory[action.item] ?? new Decimal(0)).lt(1)) {
      throw new Error(`Missing item, ${action.item}`);
    }

    animal.experience += 2;
    animal.lovedAt = createdAt;

    animal.item = getAnimalItem(
      getAnimalLevel(animal.experience, action.animal),
      Math.random,
    );

    return copy;
  });
}

const ANIMAL_ITEM_CHANCES: Record<
  AnimalLevel,
  Record<LoveAnimalItem, number>
> = {
  1: {
    "Petting Hand": 10,
    Brush: 0,
    "Music Box": 0,
  },
  2: {
    "Petting Hand": 8,
    Brush: 2,
    "Music Box": 0,
  },
  3: {
    "Petting Hand": 7,
    Brush: 3,
    "Music Box": 0,
  },
};

function getAnimalItem(level: AnimalLevel, randomGenerator: () => number) {
  // Pick weighted item from array - https://gist.github.com/oepn/33bc587bc09ce9895c43
  const weighted = Object.entries(ANIMAL_ITEM_CHANCES[level])
    .map(([item, weighting]) => new Array(weighting).fill(item))
    .reduce((acc, current) => [...acc, ...current], [] as LoveAnimalItem[]);

  const random = weighted[Math.floor(randomGenerator() * weighted.length)];
  return random;
}
