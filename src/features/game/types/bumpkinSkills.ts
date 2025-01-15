import { getKeys } from "./craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";
import { Inventory, IslandType } from "./game";
import { BuffLabel } from ".";
import { ITEM_DETAILS } from "./images";
import powerup from "assets/icons/level_up.png";
import redArrowDown from "assets/icons/decrease_arrow.png";
import bee from "assets/icons/bee.webp";
import Decimal from "decimal.js-light";
import { NPCName } from "lib/npcs";

export type BumpkinSkillName =
  | "Green Thumb"
  | "Cultivator"
  | "Master Farmer"
  | "Golden Flowers"
  | "Plant Whisperer"
  | "Happy Crop"
  | "Lumberjack"
  | "Tree Hugger"
  | "Tough Tree"
  | "Money Tree"
  | "Digger"
  | "Coal Face"
  | "Seeker"
  | "Gold Rush"
  | "Rush Hour"
  | "Kitchen Hand"
  | "Michelin Stars"
  | "Curer"
  | "Stable Hand"
  | "Free Range"
  | "Horse Whisperer"
  | "Buckaroo";

export type BumpkinSkillTree =
  | "Crops"
  | "Trees"
  | "Rocks"
  | "Cooking"
  | "Animals";

export type BumpkinRevampSkillTree =
  | "Crops"
  | "Fruit Patch"
  | "Trees"
  | "Fishing"
  | "Animals"
  | "Greenhouse"
  | "Mining"
  | "Cooking"
  | "Bees & Flowers"
  | "Machinery"
  | "Compost";

export type BumpkinSkill = {
  name: BumpkinSkillName;
  tree: BumpkinSkillTree;
  requirements: {
    skill?: BumpkinSkillName;
    points: number;
  };
  boosts: string;
  image: string;
  disabled?: boolean;
};

export type BumpkinSkillRevamp = {
  name: string;
  tree: BumpkinRevampSkillTree;
  requirements: {
    points: number;
    tier: 1 | 2 | 3;
    island: IslandType;
    cooldown?: number;
    items?: Inventory;
  };
  boosts: {
    buff: BuffLabel;
    debuff?: BuffLabel;
  };
  image?: string;
  npc?: NPCName;
  disabled: boolean;
  power?: boolean;
};

export const BUMPKIN_SKILL_TREE: Record<BumpkinSkillName, BumpkinSkill> = {
  "Green Thumb": {
    name: "Green Thumb",
    tree: "Crops",
    requirements: {
      points: 1,
    },
    boosts: translate("description.green.thumb"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  Cultivator: {
    name: "Cultivator",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Green Thumb",
    },
    boosts: translate("description.cultivator"),
    image: SUNNYSIDE?.skills?.cultivator,
  },
  "Master Farmer": {
    name: "Master Farmer",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Cultivator",
    },
    boosts: translate("description.master.farmer"),
    image: SUNNYSIDE?.skills?.master_farmer,
  },
  "Golden Flowers": {
    name: "Golden Flowers",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.golden.flowers"),
    image: SUNNYSIDE?.skills?.golden_flowers,
  },
  "Plant Whisperer": {
    name: "Plant Whisperer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Master Farmer",
    },
    boosts: translate("coming.soon"),
    image: CROP_LIFECYCLE.Radish.crop,
    disabled: true,
  },
  "Happy Crop": {
    name: "Happy Crop",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.happy.crop"),
    image: SUNNYSIDE?.skills?.happy_crop,
  },
  Lumberjack: {
    name: "Lumberjack",
    tree: "Trees",
    requirements: {
      points: 1,
    },
    boosts: translate("description.lumberjack"),
    image: SUNNYSIDE?.skills?.lumberjack_LE,
  },
  "Tree Hugger": {
    name: "Tree Hugger",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Lumberjack",
    },
    boosts: translate("description.tree.hugger"),
    image: SUNNYSIDE?.skills?.tree_hugger,
  },
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: "Tree Hugger",
    },
    boosts: translate("description.tough.tree"),
    image: SUNNYSIDE?.skills?.tough_tree,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Tree Hugger",
    },
    boosts: translate("description.money.tree"),
    image: SUNNYSIDE?.skills?.money_tree,
  },
  Digger: {
    name: "Digger",
    tree: "Rocks",
    requirements: {
      points: 1,
    },
    boosts: translate("description.digger"),
    image: SUNNYSIDE?.skills?.digger,
  },
  "Coal Face": {
    name: "Coal Face",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Digger",
    },
    boosts: translate("description.coal.face"),
    image: SUNNYSIDE?.skills?.coal_face,
  },
  Seeker: {
    name: "Seeker",
    tree: "Rocks",
    requirements: {
      points: 3,
      skill: "Coal Face",
    },
    boosts: translate("description.seeker"),
    image: SUNNYSIDE?.skills?.seeker,
    disabled: true,
  },
  "Gold Rush": {
    name: "Gold Rush",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Coal Face",
    },
    boosts: translate("description.gold.rush"),
    image: SUNNYSIDE?.skills?.gold_rush_LE,
  },
  "Rush Hour": {
    name: "Rush Hour",
    tree: "Cooking",
    requirements: {
      points: 1,
    },
    boosts: translate("description.rush.hour"),
    image: SUNNYSIDE?.skills?.rush_hour,
  },
  "Kitchen Hand": {
    name: "Kitchen Hand",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Rush Hour",
    },
    boosts: translate("description.kitchen.hand"),
    image: SUNNYSIDE?.skills?.kitchen_hand,
  },
  "Michelin Stars": {
    name: "Michelin Stars",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Kitchen Hand",
    },
    boosts: translate("description.michelin.stars"),
    image: SUNNYSIDE?.skills?.michelin_stars,
  },
  Curer: {
    name: "Curer",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Michelin Stars",
    },
    boosts: translate("description.curer"),
    image: SUNNYSIDE?.skills?.curer,
  },
  "Stable Hand": {
    name: "Stable Hand",
    tree: "Animals",
    requirements: {
      points: 1,
    },
    boosts: translate("description.stable.hand"),
    image: SUNNYSIDE?.skills?.stable_hand,
  },
  "Free Range": {
    name: "Free Range",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Stable Hand",
    },
    boosts: translate("description.free.range"),
    image: SUNNYSIDE?.skills?.free_range,
  },
  "Horse Whisperer": {
    name: "Horse Whisperer",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Free Range",
    },
    boosts: translate("description.horse.whisperer"),
    image: SUNNYSIDE?.skills?.horse_whisperer,
  },
  Buckaroo: {
    name: "Buckaroo",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Horse Whisperer",
    },
    boosts: translate("description.buckaroo"),
    image: SUNNYSIDE?.skills?.buckaroo,
  },
};

export const BUMPKIN_REVAMP_SKILL_TREE = {
  // Crops - Tier 1
  "Green Thumb": {
    name: "Green Thumb",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greenThumb"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Young Farmer": {
    name: "Young Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.youngFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: ITEM_DETAILS.Sunflower.image,
    disabled: false,
  },
  "Experienced Farmer": {
    name: "Experienced Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.experiencedFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: ITEM_DETAILS.Cauliflower.image,
    disabled: false,
  },
  "Betty's Friend": {
    name: "Betty's Friend",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bettysFriend"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    npc: "betty",
    disabled: false,
  },
  "Old Farmer": {
    name: "Old Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oldFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Kale.image,
  },

  // Crops - Tier 2
  "Strong Roots": {
    name: "Strong Roots",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.strongRoots"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    disabled: false,
  },
  "Coin Swindler": {
    name: "Coin Swindler",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.coinSwindler"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    image: ITEM_DETAILS.Market.image,
    disabled: false,
  },
  "Golden Sunflower": {
    name: "Golden Sunflower",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.goldenSunflower"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.skills.golden_flowers,
      },
    },
    image: SUNNYSIDE?.skills?.golden_flowers,
    disabled: false,
  },
  "Chonky Scarecrow": {
    name: "Chonky Scarecrow",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.chonkyScarecrow"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Basic Scarecrow"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Basic Scarecrow"].image,
  },
  "Horror Mike": {
    name: "Horror Mike",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.horrorMike"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Scary Mike"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Scary Mike"].image,
  },
  // Crops - Tier 3
  "Instant Growth": {
    name: "Instant Growth",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
      cooldown: 1000 * 60 * 60 * 72,
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.instantGrowth"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
  },
  "Acre Farm": {
    name: "Acre Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.acreFarm.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.acreFarm.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Kale.image,
  },
  "Hectare Farm": {
    name: "Hectare Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.hectareFarm.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.hectareFarm.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Carrot.image,
  },
  "Laurie's Gains": {
    name: "Laurie's Gains",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.lauriesGains"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Laurie the Chuckle Crow"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Laurie the Chuckle Crow"].image,
  },

  // Fruit - Tier 1
  "Fruitful Fumble": {
    name: "Fruitful Fumble",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruitfulFumble"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Fruity Heaven": {
    name: "Fruity Heaven",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityHeaven"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
  },
  "Fruity Profit": {
    name: "Fruity Profit",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityProfit"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "tango",
  },
  "Loyal Macaw": {
    name: "Loyal Macaw",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.loyalMacaw"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Macaw"].image,
      },
    },
  },
  // Fruit - Tier 2
  Catchup: {
    name: "Catchup",
    tree: "Fruit Patch",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.catchup"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    disabled: false,
  },
  "No Axe No Worries": {
    name: "No Axe No Worries",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.noAxeNoWorries.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.noAxeNoWorries.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    image: ITEM_DETAILS.Axe.image,
  },
  "Fruity Woody": {
    name: "Fruity Woody",
    tree: "Fruit Patch",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityWoody"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    disabled: false,
  },
  "Pear Turbocharge": {
    name: "Pear Turbocharge",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.pearTurbocharge"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Immortal Pear"].image,
      },
    },
  },
  "Crime Fruit": {
    name: "Crime Fruit",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.crimeFruit"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Tomato"].image,
      },
    },
  },
  // Fruit - Tier 3
  "Generous Orchard": {
    name: "Generous Orchard",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.generousOrchard"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
  },
  "Long Pickings": {
    name: "Long Pickings",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.longPickings.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.longPickings.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: ITEM_DETAILS.Banana.image,
  },
  "Short Pickings": {
    name: "Short Pickings",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.shortPickings.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.shortPickings.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: ITEM_DETAILS.Blueberry.image,
  },
  "Zesty Vibes": {
    name: "Zesty Vibes",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.zestyVibes.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.zestyVibes.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    image: ITEM_DETAILS.Tomato.image,
  },

  // Trees - Tier 1
  "Lumberjack's Extra": {
    name: "Lumberjack's Extra",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.lumberjacksExtra"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    image: SUNNYSIDE.skills.lumberjack_LE,
    disabled: false,
  },
  "Tree Charge": {
    name: "Tree Charge",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.treeCharge"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.resource.tree,
      },
    },
    disabled: false,
  },
  "More Axes": {
    name: "More Axes",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.moreAxes"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Axe.image,
  },
  "Insta-Chop": {
    name: "Insta-Chop",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.instaChop"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
  },
  // Trees - Tier 2
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.toughTree"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    image: SUNNYSIDE?.skills?.tough_tree,
    disabled: false,
  },
  "Feller's Discount": {
    name: "Feller's Discount",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fellersDiscount"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    disabled: false,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.moneyTree"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: SUNNYSIDE?.skills?.money_tree,
    disabled: false,
  },
  // Trees - Tier 3
  "Tree Turnaround": {
    name: "Tree Turnaround",
    tree: "Trees",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.treeTurnaround"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
  },
  "Tree Blitz": {
    name: "Tree Blitz",
    tree: "Trees",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
      cooldown: 1000 * 60 * 60 * 24,
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.treeBlitz"),
        labelType: "transparent",
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Tree.image,
    power: true,
  },

  // Fishing - Tier 1
  "Fisherman's 5 Fold": {
    name: "Fisherman's 5 Fold",
    tree: "Fishing",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishermansFiveFold"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
    disabled: false,
  },
  "Fishy Chance": {
    name: "Fishy Chance",
    tree: "Fishing",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyChance"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Anchovy.image,
  },
  "Fishy Roll": {
    name: "Fishy Roll",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyRoll"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: ITEM_DETAILS["Red Snapper"].image,
  },
  "Reel Deal": {
    name: "Reel Deal",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.reelDeal"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
  },
  // Fishing - Tier 2
  "Fisherman's 10 Fold": {
    name: "Fisherman's 10 Fold",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishermansTenFold"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
    disabled: false,
  },
  "Fishy Fortune": {
    name: "Fishy Fortune",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyFortune"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "corale",
  },
  "Big Catch": {
    name: "Big Catch",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bigCatch"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: true,
  },
  "Fishy Gamble": {
    name: "Fishy Gamble",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyGamble"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: ITEM_DETAILS.Tuna.image,
  },
  // Fishing - Tier 3
  "Frenzied Fish": {
    name: "Frenzied Fish",
    tree: "Fishing",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.frenziedFish"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    disabled: false,
  },
  "More With Less": {
    name: "More With Less",
    tree: "Fishing",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.moreWithLess.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Rod.image,
      },
      debuff: {
        shortDescription: translate("skill.moreWithLess.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Earthworm.image,
      },
    },
    disabled: false,
  },
  "Fishy Feast": {
    name: "Fishy Feast",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyFeast"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
  },

  // Animals - Tier 1
  "Efficient Feeding": {
    name: "Efficient Feeding",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.efficientFeeding"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Hay.image,
      },
    },
  },
  "Restless Animals": {
    name: "Restless Animals",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.restlessAnimals"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: SUNNYSIDE.animals.chickenAsleep,
  },
  "Fine Fibers": {
    name: "Fine Fibers",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fineFibers"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Feather.image,
      },
    },
  },
  "Bountiful Bounties": {
    name: "Bountiful Bounties",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bountifulBounties"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
  },
  "Double Bale": {
    name: "Double Bale",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.doubleBale"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Bale.image,
      },
    },
  },
  "Bale Economy": {
    name: "Bale Economy",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.baleEconomy"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS.Bale.image,
      },
    },
  },
  // Animals - Tier 2
  "Abundant Harvest": {
    name: "Abundant Harvest",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.abundantHarvest"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.egg,
      },
    },
  },
  "Heartwarming Instruments": {
    name: "Heartwarming Instruments",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.heartwarmingInstruments"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Brush.image,
      },
    },
  },
  "Kale Mix": {
    name: "Kale Mix",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.kaleMix"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Mixed Grain"].image,
      },
    },
  },
  "Alternate Medicine": {
    tree: "Animals",
    name: "Alternate Medicine",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.alternateMedicine"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Barn Delight"].image,
      },
    },
  },
  "Healthy Livestock": {
    name: "Healthy Livestock",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.healthyLivestock"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: SUNNYSIDE.animals.chickenSick,
  },
  // Animals - Tier 3
  "Clucky Grazing": {
    name: "Clucky Grazing",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cluckyGrazing.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.chickenReady,
      },
      debuff: {
        shortDescription: translate("skill.cluckyGrazing.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  "Sheepwise Diet": {
    name: "Sheepwise Diet",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.sheepwiseDiet.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.sheepReady,
      },
      debuff: {
        shortDescription: translate("skill.sheepwiseDiet.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  "Cow-Smart Nutrition": {
    name: "Cow-Smart Nutrition",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cowSmartNutrition.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.cowReady,
      },
      debuff: {
        shortDescription: translate("skill.cowSmartNutrition.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  "Chonky Feed": {
    name: "Chonky Feed",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.chonkyFeed.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Hay.image,
      },
      debuff: {
        shortDescription: translate("skill.chonkyFeed.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },

  "Apple-Tastic": {
    name: "Apple-Tastic",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
      cooldown: 1000 * 60 * 60 * 24 * 7,
      items: {
        Apple: new Decimal(600),
      },
    },
    power: true,
    boosts: {
      buff: {
        shortDescription: translate("skill.appleTastic"),
        labelType: "transparent",
      },
    },
  },

  // Greenhouse - Tier 1
  "Glass Room": {
    name: "Glass Room",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.glassRoom"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
  },
  "Seedy Business": {
    name: "Seedy Business",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.seedyBusiness"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
      },
    },
  },
  "Rice and Shine": {
    name: "Rice and Shine",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.riceAndShine"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
  },
  "Victoria's Secretary": {
    name: "Victoria's Secretary",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.victoriasSecretary"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    npc: "victoria",
  },
  // Greenhouse - Tier 2
  "Olive Express": {
    name: "Olive Express",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oliveExpress"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Olive.image,
      },
    },
    disabled: false,
  },
  "Rice Rocket": {
    name: "Rice Rocket",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.riceRocket"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Rice.image,
      },
    },
    disabled: false,
  },
  "Vine Velocity": {
    name: "Vine Velocity",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.vineVelocity"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Grape.image,
      },
    },
    disabled: false,
  },
  "Seeded Bounty": {
    name: "Seeded Bounty",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.seededBounty.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.seededBounty.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  // Greenhouse - Tier 3
  "Greenhouse Guru": {
    name: "Greenhouse Guru",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
      cooldown: 96 * 60 * 60 * 1000,
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greenhouseGuru"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
  },
  "Greenhouse Gamble": {
    name: "Greenhouse Gamble",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greenhouseGamble"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
  },
  "Slick Saver": {
    name: "Slick Saver",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.slickSaver"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Oil.image,
      },
    },
    disabled: false,
  },
  "Greasy Plants": {
    name: "Greasy Plants",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greasyPlants.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.greasyPlants.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Oil.image,
      },
    },
  },

  // Mining - Tier 1
  "Rock'N'Roll": {
    name: "Rock'N'Roll",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.rockAndRoll"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
    disabled: false,
  },
  "Iron Bumpkin": {
    name: "Iron Bumpkin",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.ironBumpkin"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
    disabled: false,
  },
  "Speed Miner": {
    name: "Speed Miner",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.speedMiner"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
    disabled: false,
  },
  "Tap Prospector": {
    name: "Tap Prospector",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.tapProspector"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
  },
  "Forge-Ward Profits": {
    name: "Forge-Ward Profits",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.forgeWardProfits"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "blacksmith",
  },
  // Mining - Tier 2
  "Iron Hustle": {
    name: "Iron Hustle",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.ironHustle"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
    disabled: false,
  },
  "Frugal Miner": {
    name: "Frugal Miner",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.frugalMiner"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS.Pickaxe.image,
      },
    },
    disabled: false,
  },
  "Rocky Favor": {
    name: "Rocky Favor",
    tree: "Mining",
    requirements: { points: 2, tier: 2, island: "basic" },
    boosts: {
      buff: {
        shortDescription: translate("skill.rockyFavor.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
      debuff: {
        shortDescription: translate("skill.rockyFavor.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
    disabled: false,
  },
  "Fire Kissed": {
    name: "Fire Kissed",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fireKissed"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    },
    disabled: false,
  },
  // Mining - Tier 3
  "Ferrous Favor": {
    name: "Ferrous Favor",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.ferrousFavor.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
      debuff: {
        shortDescription: translate("skill.ferrousFavor.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
    disabled: false,
  },
  "Golden Touch": {
    name: "Golden Touch",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.goldenTouch"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    },
    disabled: false,
  },
  "Midas Sprint": {
    name: "Midas Sprint",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.midasSprint"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    },
    disabled: false,
  },
  "More Picks": {
    name: "More Picks",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.morePicks"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS.Pickaxe.image,
      },
    },
    disabled: false,
  },
  "Fireside Alchemist": {
    name: "Fireside Alchemist",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.firesideAlchemist"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    },
    disabled: false,
  },

  // Cooking - Tier 1
  "Fast Feasts": {
    name: "Fast Feasts",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fastFeasts"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Chef Hat"].image,
      },
    },
    disabled: false,
  },
  "Nom Nom": {
    name: "Nom Nom",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.nomNom"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
  },
  "Munching Mastery": {
    name: "Munching Mastery",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.munchingMastery"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Swift Sizzle": {
    name: "Swift Sizzle",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.swiftSizzle"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  // Cooking - Tier 2
  "Frosted Cakes": {
    name: "Frosted Cakes",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.frostedCakes"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Radish Cake"].image,
      },
    },
    disabled: false,
  },
  "Juicy Boost": {
    name: "Juicy Boost",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.juicyBoost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Bumpkin Detox"].image,
      },
    },
    disabled: false,
  },
  "Turbo Fry": {
    name: "Turbo Fry",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.turboFry"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Drive-Through Deli": {
    name: "Drive-Through Deli",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.driveThroughDeli"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Cheese.image,
      },
    },
    disabled: false,
  },
  // Cooking - Tier 3
  "Instant Gratification": {
    name: "Instant Gratification",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.instantGratification"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
  },
  "Double Nom": {
    name: "Double Nom",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.doubleNom.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.doubleNom.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
  },
  "Fiery Jackpot": {
    name: "Fiery Jackpot",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fieryJackpot"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Chef Hat"].image,
      },
    },
    disabled: false,
  },
  "Fry Frenzy": {
    name: "Fry Frenzy",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fryFrenzy"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },

  // Bees & Flowers - Tier 1
  "Sweet Bonus": {
    name: "Sweet Bonus",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.sweetBonus"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
    disabled: false,
  },
  "Hyper Bees": {
    name: "Hyper Bees",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.hyperBees"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
    disabled: false,
  },
  "Blooming Boost": {
    name: "Blooming Boost",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bloomingBoost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
    disabled: false,
  },
  "Flower Sale": {
    name: "Flower Sale",
    tree: "Bees & Flowers",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.flowerSale"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS["Sunpetal Seed"].image,
      },
    },
  },
  // Bees & Flowers - Tier 2
  "Buzzworthy Treats": {
    name: "Buzzworthy Treats",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.buzzworthyTreats"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
    disabled: false,
  },
  "Blossom Bonding": {
    name: "Blossom Bonding",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.blossomBonding"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Pollen Power Up": {
    name: "Pollen Power Up",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.pollenPowerUp"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Petalled Perk": {
    name: "Petalled Perk",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.petalledPerk"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
  },
  // Bees & Flowers - Tier 3
  "Bee Collective": {
    name: "Bee Collective",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.beeCollective"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: bee,
      },
    },
    disabled: false,
  },
  "Flower Power": {
    name: "Flower Power",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.flowerPower"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
    disabled: false,
  },
  "Flowery Abode": {
    name: "Flowery Abode",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.floweryAbode.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
      debuff: {
        shortDescription: translate("skill.floweryAbode.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
    disabled: false,
  },
  "Petal Blessed": {
    name: "Petal Blessed",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: translate("skill.petalBlessed"),
        labelType: "transparent",
      },
    },
  },

  // Machinery - Tier 1
  "Crop Processor Unit": {
    name: "Crop Processor Unit",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropProcessorUnit.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.cropProcessorUnit.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Oil Gadget": {
    name: "Oil Gadget",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oilGadget"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Oil Extraction": {
    name: "Oil Extraction",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oilExtraction"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Leak-Proof Tank": {
    name: "Leak-Proof Tank",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.leakProofTank"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  // Machinery - Tier 2
  "Crop Extension Module": {
    name: "Crop Extension Module",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropExtensionModule"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Cabbage"].image,
      },
    },
    disabled: false,
  },
  "Rapid Rig": {
    name: "Rapid Rig",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.rapidRig.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.rapidRig.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Oil Be Back": {
    name: "Oil Be Back",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oilBeBack"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  // Machinery - Tier 3
  "Field Expansion Module": {
    name: "Field Expansion Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fieldExpansionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Field Extension Module": {
    name: "Field Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fieldExtensionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Efficiency Extension Module": {
    name: "Efficiency Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.efficiencyExtensionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
  },
  "Grease Lightning": {
    name: "Grease Lightning",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greaseLightning"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
    image: ITEM_DETAILS["Oil Reserve"].image,
  },

  // Compost - Tier 1
  "Efficient Bin": {
    name: "Efficient Bin",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.efficientBin"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
      },
    },
    disabled: false,
  },
  "Turbo Charged": {
    name: "Turbo Charged",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.turboCharged"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Fruitful Blend"].image,
      },
    },
    disabled: false,
  },
  "Wormy Treat": {
    name: "Wormy Treat",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.wormyTreat"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Earthworm"].image,
      },
    },
    disabled: false,
  },
  "Feathery Business": {
    name: "Feathery Business",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.featheryBusiness.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Feather"].image,
      },
      debuff: {
        shortDescription: translate("skill.featheryBusiness.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Feather"].image,
      },
    },
    disabled: false,
  },
  "Sprout Surge": {
    name: "Sprout Surge",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Sprout Mix on all plots",
        labelType: "transparent",
      },
    },
    image: ITEM_DETAILS["Sprout Mix"].image,
  },
  "Blend-tastic": {
    name: "Blend-tastic",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Fruitful Blend on all plots",
        labelType: "transparent",
      },
    },
    image: ITEM_DETAILS["Fruitful Blend"].image,
  },
  // Compost - Tier 2
  "Premium Worms": {
    name: "Premium Worms",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.premiumWorms"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rapid Root"].image,
      },
    },
    disabled: false,
  },
  "Fruitful Bounty": {
    name: "Fruitful Bounty",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    disabled: false,
    boosts: {
      buff: {
        shortDescription: translate("skill.fruitfulBounty"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Fruitful Blend"].image,
      },
    },
  },
  "Swift Decomposer": {
    name: "Swift Decomposer",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.swiftDecomposer"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    disabled: false,
  },
  "Composting Bonanza": {
    name: "Composting Bonanza",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingBonanza.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.compostingBonanza.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
  },
  "Root Rocket": {
    name: "Root Rocket",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Rapid Root on all plots",
        labelType: "transparent",
      },
    },
    image: ITEM_DETAILS["Rapid Root"].image,
  },
  // Compost - Tier 3
  "Composting Overhaul": {
    name: "Composting Overhaul",
    tree: "Compost",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingOverhaul.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Earthworm.image,
      },
      debuff: {
        shortDescription: translate("skill.compostingOverhaul.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
      },
    },
    disabled: false,
  },
  "Composting Revamp": {
    name: "Composting Revamp",
    tree: "Compost",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingRevamp.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
      },
      debuff: {
        shortDescription: translate("skill.compostingRevamp.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Earthworm.image,
      },
    },
    disabled: false,
  },
} satisfies Record<string, BumpkinSkillRevamp>;

export type BumpkinRevampSkillName = keyof typeof BUMPKIN_REVAMP_SKILL_TREE;

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree),
  ),
);

export const getRevampSkillTreeCategoriesByIsland = (
  islandType: IslandType,
) => {
  const skillTreeCategoriesByIsland = Array.from(
    new Set(
      getKeys(BUMPKIN_REVAMP_SKILL_TREE)
        .filter(
          (skill) =>
            BUMPKIN_REVAMP_SKILL_TREE[skill].requirements.island === islandType,
        )
        .map((skill) => BUMPKIN_REVAMP_SKILL_TREE[skill].tree),
    ),
  );
  return skillTreeCategoriesByIsland;
};

export const getSkills = (treeName: BumpkinSkillTree) => {
  return Object.values(BUMPKIN_SKILL_TREE).filter(
    (skill) => skill.tree === treeName,
  );
};

export const getRevampSkills = (treeName: BumpkinRevampSkillTree) => {
  return Object.values(BUMPKIN_REVAMP_SKILL_TREE).filter(
    (skill) => skill.tree === treeName,
  );
};

export const createSkillPath = (skills: BumpkinSkill[]) => {
  const startingSkill = skills.find((item) => !item.requirements.skill);
  const path = [[startingSkill?.name as BumpkinSkillName]];

  const remainingLevels = new Set(
    skills.map((item) => item.requirements.skill),
  );

  for (let index = 0; index < remainingLevels.size - 1; index++) {
    const lastSkillLevelName = path[path.length - 1][0];

    const skillsInCurrentLevel: BumpkinSkillName[] = skills
      .filter((item) => item.requirements.skill === lastSkillLevelName)
      .map((item) => item.name);

    path.push(skillsInCurrentLevel);
  }

  return path;
};

export const createRevampSkillPath = (skills: BumpkinSkillRevamp[]) => {
  const skillsByTier: { [key: number]: BumpkinSkillRevamp[] } = {};

  skills.forEach((skill) => {
    const { requirements } = skill;
    if (!skillsByTier[requirements.tier]) {
      skillsByTier[requirements.tier] = [];
    }

    skillsByTier[requirements.tier].push(skill);
  });

  return skillsByTier;
};

export const getPowerSkills = () =>
  Object.values(BUMPKIN_REVAMP_SKILL_TREE).filter(
    (skill: BumpkinSkillRevamp) => skill.power,
  );
