import { Dimensions } from "./craftables";
import { translate } from "lib/i18n/translate";

export type CommodityName =
  | "Wood"
  | "Stone"
  | "Iron"
  | "Gold"
  | "Ruby"
  | "Diamond"
  | "Egg"
  | "Honey"
  | "Chicken"
  | "Wild Mushroom"
  | "Magic Mushroom";

export type MushroomName = Extract<
  CommodityName,
  "Wild Mushroom" | "Magic Mushroom"
>;

export type Commodity = {
  description: string;
};

export const COMMODITIES: Record<CommodityName, Commodity> = {
  Wood: {
    description: translate("use.craft"),
  },
  Stone: {
    description: translate("use.craft"),
  },
  Iron: {
    description: translate("use.craft"),
  },
  Gold: {
    description: translate("use.craft"),
  },
  Ruby: {
    description: translate("use.craft"),
  },
  Diamond: {
    description: translate("use.craft"),
  },
  Egg: {
    description: translate("use.craft"),
  },
  Chicken: {
    description: translate("chicken.description"),
  },
  Honey: {
    description: translate("honey.description"),
  },
  "Wild Mushroom": {
    description: translate("wildMushroom.description"),
  },
  "Magic Mushroom": {
    description: translate("magicMushroom.description"),
  },
};

export type ResourceName =
  | "Tree"
  | "Stone Rock"
  | "Iron Rock"
  | "Gold Rock"
  | "Ruby Rock"
  | "Crop Plot"
  | "Fruit Patch"
  | "Boulder"
  | "Beehive"
  | "Flower Bed";

export const RESOURCES: Record<ResourceName, string> = {
  "Crop Plot": "Plant crops",
  "Fruit Patch": "Plant fruit",
  "Gold Rock": "Mine gold",
  "Iron Rock": "Mine iron",
  "Stone Rock": "Mine stone",
  "Ruby Rock": "Mine ruby",
  Boulder: "Mine rare minerals",
  Tree: "Chop Wood",
  Beehive: "Collect honey",
  "Flower Bed": "Plant flowers",
};

export const RESOURCE_DIMENSIONS: Record<ResourceName, Dimensions> = {
  "Crop Plot": {
    width: 1,
    height: 1,
  },
  "Gold Rock": {
    width: 1,
    height: 1,
  },
  "Iron Rock": {
    width: 1,
    height: 1,
  },
  "Stone Rock": {
    width: 1,
    height: 1,
  },
  "Ruby Rock": {
    width: 1,
    height: 1,
  },
  Tree: {
    width: 2,
    height: 2,
  },
  "Fruit Patch": {
    width: 2,
    height: 2,
  },
  Boulder: {
    width: 2,
    height: 2,
  },
  Beehive: {
    width: 1,
    height: 1,
  },
  "Flower Bed": {
    width: 3,
    height: 1,
  },
};

export const MUSHROOM_DIMENSIONS = {
  width: 1,
  height: 1,
};
