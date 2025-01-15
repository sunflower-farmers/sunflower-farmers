import {
  collectEggs as landExpansionCollectEggs,
  LandExpansionCollectEggAction as LandExpansionCollectEggsAction,
} from "./landExpansion/collectEgg";
import {
  LandExpansionPlantAction,
  plant as landExpansionPlant,
} from "./landExpansion/plant";
import {
  harvest as landExpansionHarvest,
  LandExpansionHarvestAction,
} from "./landExpansion/harvest";
import {
  chop as landExpansionChop,
  LandExpansionChopAction,
} from "./landExpansion/chop";
import {
  mineStone as landExpansionMineStone,
  LandExpansionStoneMineAction,
} from "./landExpansion/stoneMine";
import {
  mineGold as landExpansionMineGold,
  LandExpansionMineGoldAction,
} from "./landExpansion/mineGold";

import {
  mineIron as landExpansionIronMine,
  LandExpansionIronMineAction,
} from "./landExpansion/ironMine";

import {
  feedChicken as LandExpansionFeedChicken,
  LandExpansionFeedChickenAction,
} from "./landExpansion/feedChicken";

import { GameState } from "../types/game";
import { claimAirdrop, ClaimAirdropAction } from "./claimAirdrop";
import {
  placeBuilding,
  PlaceBuildingAction,
} from "./landExpansion/placeBuilding";
import {
  constructBuilding,
  ConstructBuildingAction,
} from "./landExpansion/constructBuilding";
import {
  placeCollectible,
  PlaceCollectibleAction,
} from "./landExpansion/placeCollectible";
import { cook, RecipeCookedAction } from "./landExpansion/cook";
import {
  collectRecipe,
  CollectRecipeAction,
} from "./landExpansion/collectRecipe";
import { feedBumpkin, FeedBumpkinAction } from "./landExpansion/feedBumpkin";
import { detectBot, DetectBotAction } from "./detectBot";
import { pickSkill, PickSkillAction } from "./landExpansion/pickSkill";
import { choseSkill, ChoseSkillAction } from "./landExpansion/choseSkill";
import { resetSkills, ResetSkillsAction } from "./landExpansion/resetSkills";
import { seedBought, SeedBoughtAction } from "./landExpansion/seedBought";
import {
  claimAchievement,
  ClaimAchievementAction,
} from "./landExpansion/claimAchievement";
import { buyChicken, BuyChickenAction } from "./landExpansion/buyChicken";
import { placeChicken, PlaceChickenAction } from "./landExpansion/placeChicken";
import { craftTool, CraftToolAction } from "./landExpansion/craftTool";
import {
  buyDecoration,
  buyDecorationAction,
} from "./landExpansion/buyDecoration";
import { sellCrop, SellCropAction } from "./landExpansion/sellCrop";
import {
  fertilisePlot as landExpansionFertilise,
  LandExpansionFertiliseCropAction,
} from "./landExpansion/fertilisePlot";
import {
  removeCrop as landExpansionRemoveCrop,
  LandExpansionRemoveCropAction,
} from "./landExpansion/removeCrop";
import {
  removeBuilding,
  RemoveBuildingAction,
} from "./landExpansion/removeBuilding";
import {
  removeCollectible,
  RemoveCollectibleAction,
} from "./landExpansion/removeCollectible";
import {
  collectCropReward,
  CollectCropRewardAction,
} from "./landExpansion/collectCropReward";
import {
  collectTreeReward,
  CollectTreeRewardAction,
} from "features/game/events/landExpansion/collectTreeReward";
import {
  removeChicken,
  RemoveChickenAction,
} from "./landExpansion/removeChicken";
import { plantFruit, PlantFruitAction } from "./landExpansion/fruitPlanted";
import {
  harvestFruit,
  HarvestFruitAction,
} from "./landExpansion/fruitHarvested";
import {
  RemoveFruitTreeAction,
  removeFruitTree,
} from "./landExpansion/fruitTreeRemoved";
import {
  craftCollectible,
  CraftCollectibleAction,
} from "./landExpansion/craftCollectible";
import { sellTreasure, SellTreasureAction } from "./landExpansion/treasureSold";
import { restock, RestockAction } from "./landExpansion/restock";
import { sellGarbage, SellGarbageAction } from "./landExpansion/garbageSold";
import {
  completeChore,
  CompleteChoreAction,
} from "./landExpansion/completeChore";
import { placeTree, PlaceTreeAction } from "./landExpansion/placeTree";
import { expandLand, ExpandLandAction } from "./landExpansion/expandLand";
import { placePlot, PlacePlotAction } from "./landExpansion/placePlot";
import { placeStone, PlaceStoneAction } from "./landExpansion/placeStone";
import { placeGold, PlaceGoldAction } from "./landExpansion/placeGold";
import { placeIron, PlaceIronAction } from "./landExpansion/placeIron";
import {
  placeFruitPatch,
  PlaceFruitPatchAction,
} from "./landExpansion/placeFruitPatch";
import { MessageRead, readMessage } from "./landExpansion/readMessage";
import {
  moveCollectible,
  MoveCollectibleAction,
} from "./landExpansion/moveCollectible";
import { moveBuilding, MoveBuildingAction } from "./landExpansion/moveBuilding";
import { moveTree, MoveTreeAction } from "./landExpansion/moveTree";
import { moveCrop, MoveCropAction } from "./landExpansion/moveCrop";
import {
  moveFruitPatch,
  MoveFruitPatchAction,
} from "./landExpansion/moveFruitPatch";
import { moveIron, MoveIronAction } from "./landExpansion/moveIron";
import { moveStone, MoveStoneAction } from "./landExpansion/moveStone";
import { moveGold, MoveGoldAction } from "./landExpansion/moveGold";
import { pickMushroom, PickMushroomAction } from "./landExpansion/pickMushroom";
import { moveChicken, MoveChickenAction } from "./landExpansion/moveChicken";
import { Announcements } from "../types/announcements";
import { skipChore, SkipChoreAction } from "./landExpansion/skipChore";
import { deliverOrder, DeliverOrderAction } from "./landExpansion/deliver";
import { equip, EquipBumpkinAction } from "./landExpansion/equip";
import { refundBid, RefundBidAction } from "./landExpansion/refundBid";
import { mixPotion, MixPotionAction } from "./landExpansion/mixPotion";
import { buyWearable, BuyWearableAction } from "./landExpansion/buyWearable";
import { skipOrder, SkipOrderAction } from "./landExpansion/skipOrder";
import {
  completeBertObsession,
  CompleteBertObsessionAction,
} from "./landExpansion/completeBertObsession";
import { StartPotionAction, startPotion } from "./landExpansion/startPotion";
import { receiveTrade, ReceiveTradeAction } from "./landExpansion/receiveTrade";
import { cancelTrade, CancelTradeAction } from "./landExpansion/cancelTrade";
import { placeBud, PlaceBudAction } from "./landExpansion/placeBud";
import { moveBud, MoveBudAction } from "./landExpansion/moveBud";
import { removeBud, RemoveBudAction } from "./landExpansion/removeBud";
import {
  startComposter,
  StartComposterAction,
} from "./landExpansion/startComposter";
import {
  collectCompost,
  collectCompostAction,
} from "./landExpansion/collectCompost";
import {
  fertiliseFruitPatch,
  FertiliseFruitAction,
} from "./landExpansion/fertiliseFruitPatch";
import { castRod, CastRodAction } from "./landExpansion/castRod";
import { reelRod, ReelRodAction } from "./landExpansion/reelRod";
import {
  claimMilestone,
  ClaimMilestoneAction,
} from "./landExpansion/claimMilestone";
import { missFish, MissFishAction } from "./landExpansion/missFish";
import { revealLand, RevealLandAction } from "./landExpansion/revealLand";
import {
  burnCollectible,
  BurnCollectibleAction,
} from "./landExpansion/burnCollectible";
import { claimBonus, ClaimBonusAction } from "./landExpansion/claimBonus";
import {
  accelerateComposter,
  AccelerateComposterAction,
} from "./landExpansion/accelerateComposter";
import {
  moveCrimstone,
  MoveCrimstoneAction,
} from "./landExpansion/moveCrimstone";
import {
  mineCrimstone,
  MineCrimstoneAction,
} from "./landExpansion/mineCrimstone";
import {
  placeCrimstone,
  PlaceCrimstoneAction,
} from "./landExpansion/placeCrimstone";
import { buyFarmhand, BuyFarmHandAction } from "./landExpansion/buyFarmHand";
import {
  equipFarmhand,
  EquipFarmHandAction,
} from "./landExpansion/equipFarmHand";
import { moveBeehive, MoveBeehiveAction } from "./landExpansion/moveBeehive";
import { placeBeehive, PlaceBeehiveAction } from "./landExpansion/placeBeehive";
import {
  harvestBeehive,
  HarvestBeehiveAction,
} from "./landExpansion/harvestBeehive";
import { plantFlower, PlantFlowerAction } from "./landExpansion/plantFlower";
import {
  harvestFlower,
  HarvestFlowerAction,
} from "./landExpansion/harvestFlower";
import {
  moveFlowerBed,
  MoveFlowerBedAction,
} from "./landExpansion/moveFlowerBed";
import {
  placeFlowerBed,
  PlaceFlowerBedAction,
} from "./landExpansion/placeFlowerBed";
import {
  upgrade as upgrade,
  UpgradeFarmAction,
} from "./landExpansion/upgradeFarm";
import {
  purchaseBanner,
  PurchaseBannerAction,
} from "./landExpansion/bannerPurchased";
import {
  placeSunstone,
  PlaceSunstoneAction,
} from "./landExpansion/placeSunstone";
import { moveSunstone, MoveSunstoneAction } from "./landExpansion/moveSunstone";
import { mineSunstone, MineSunstoneAction } from "./landExpansion/mineSunstone";
import {
  FlowerShopTradedAction,
  tradeFlowerShop,
} from "./landExpansion/tradeFlowerShop";
import {
  buyMegaStoreItem,
  BuyMegaStoreItemAction,
} from "./landExpansion/buyMegaStoreItem";
import {
  completeSpecialEventTask,
  CompleteSpecialEventTaskAction,
} from "./landExpansion/completeSpecialEventTask";
import { claimGift, ClaimGiftAction } from "./landExpansion/claimBumpkinGift";
import { giftFlowers, GiftFlowersAction } from "./landExpansion/giftFlowers";
import { enterRaffle, EnterRaffleAction } from "./landExpansion/enterRaffle";
import {
  exchangeSFLtoCoins,
  ExchangeSFLtoCoinsAction,
} from "./landExpansion/exchangeSFLtoCoins";
import {
  moveOilReserve,
  MoveOilReserveAction,
} from "./landExpansion/moveOilReserve";
import {
  placeOilReserve,
  PlaceOilReserveAction,
} from "./landExpansion/placeOilReserve";
import {
  drillOilReserve,
  DrillOilReserveAction,
} from "./landExpansion/drillOilReserve";
import {
  harvestGreenHouse,
  HarvestGreenhouseAction,
} from "./landExpansion/harvestGreenHouse";
import {
  plantGreenhouse,
  PlantGreenhouseAction,
} from "./landExpansion/plantGreenhouse";
import {
  oilGreenhouse,
  OilGreenhouseAction,
} from "./landExpansion/oilGreenHouse";
import {
  supplyCookingOil,
  SupplyCookingOilAction,
} from "./landExpansion/supplyCookingOil";

import {
  PurchaseMinigameAction,
  purchaseMinigameItem,
} from "./minigames/purchaseMinigameItem";
import {
  claimMinigamePrize,
  ClaimMinigamePrizeAction,
} from "./minigames/claimMinigamePrize";
import {
  supplyCropMachine,
  SupplyCropMachineAction,
} from "./landExpansion/supplyCropMachine";
import {
  harvestCropMachine,
  HarvestCropMachineAction,
} from "./landExpansion/harvestCropMachine";
import { joinFaction, JoinFactionAction } from "./landExpansion/joinFaction";
import {
  completeKingdomChore,
  CompleteKingdomChoreAction,
} from "./landExpansion/completeKingdomChore";
import {
  DeliverFactionKitchenAction,
  deliverFactionKitchen,
} from "./landExpansion/deliverFactionKitchen";
import {
  BuyFactionShopItemAction,
  buyFactionShopItem,
} from "./landExpansion/buyFactionShopItem";
import {
  claimFactionPrize,
  ClaimFactionPrizeAction,
} from "./landExpansion/claimFactionPrize";
import {
  FeedFactionPetAction,
  feedFactionPet,
} from "./landExpansion/feedFactionPet";
import {
  refreshKingdomChores,
  RefreshKingdomChoresAction,
} from "./landExpansion/refreshKingdomChores";
import {
  skipKingdomChore,
  SkipKingdomChoreAction,
} from "./landExpansion/skipKingdomChore";
import { leaveFaction, LeaveFactionAction } from "./landExpansion/leaveFaction";
import {
  unlockMinigameAchievements,
  UnlockMinigameAchievementsAction,
} from "./minigames/unlockMinigameAchievements";
import { BuyMoreDigsAction, buyMoreDigs } from "./landExpansion/buyMoreDigs";
import {
  completeDailyChallenge,
  CompleteDailyChallengeAction,
} from "./landExpansion/completeDailyChallenge";
import {
  startMinigameAttempt,
  StartMinigameAttemptAction,
} from "./minigames/startMinigameAttempt";
import {
  submitMinigameScore,
  SubmitMinigameScoreAction,
} from "./minigames/submitMinigameScore";
import { claimOffer, ClaimOfferAction } from "./landExpansion/offerClaimed";
import {
  startCompetition,
  StartCompetitionAction,
} from "./landExpansion/startCompetition";
import {
  shipmentRestock,
  ShipmentRestockAction,
} from "./landExpansion/shipmentRestocked";
import {
  speedUpRecipe,
  InstantCookRecipe,
} from "./landExpansion/speedUpRecipe";
import {
  speedUpExpansion,
  InstantExpand,
} from "./landExpansion/speedUpExpansion";
import {
  speedUpCollectible,
  SpeedUpCollectible,
} from "./landExpansion/speedUpCollectible";
import {
  speedUpBuilding,
  SpeedUpBuilding,
} from "./landExpansion/speedUpBuilding";
import { buyAnimal, BuyAnimalAction } from "./landExpansion/buyAnimal";
import { feedAnimal, FeedAnimalAction } from "./landExpansion/feedAnimal";
import { loveAnimal, LoveAnimalAction } from "./landExpansion/loveAnimal";
import { feedMixed, FeedMixedAction } from "features/feederMachine/feedMixed";
import {
  upgradeBuilding,
  UpgradeBuildingAction,
} from "./landExpansion/upgradeBuilding";
import { sellAnimal, SellAnimalAction } from "./landExpansion/sellAnimal";
import {
  startCrafting,
  StartCraftingAction,
} from "./landExpansion/startCrafting";
import {
  collectCrafting,
  CollectCraftingAction,
} from "./landExpansion/collectCrafting";
import {
  completeNPCChore,
  CompleteNPCChoreAction,
} from "./landExpansion/completeNPCChore";
import { claimProduce, ClaimProduceAction } from "./landExpansion/claimProduce";
import { sellBounty, SellBountyAction } from "./landExpansion/sellBounty";
import {
  buySeasonalItem,
  BuySeasonalItemAction,
} from "./landExpansion/buySeasonalItem";
import {
  discoverRecipe,
  DiscoverRecipeAction,
} from "./landExpansion/discoverRecipe";
import {
  unlockFarmhand,
  UnlockFarmhandAction,
} from "./landExpansion/unlockFarmhand";
import {
  sacrificeBear,
  SacrificeBearAction,
} from "./landExpansion/sacrificeBear";
import { buyMoreReels, BuyMoreReelsAction } from "./landExpansion/buyMoreReels";
import { ClaimPurchaseAction, claimPurchase } from "./claimPurchase";
import { npcRestock, NPCRestockAction } from "./landExpansion/npcRestock";
import {
  redeemTradeReward,
  RedeemTradeRewardsAction,
} from "./landExpansion/redeemTradeReward";
import { collectCandy, CollectCandyAction } from "./landExpansion/collectCandy";
import { skillUse, SkillUseAction } from "./landExpansion/skillUsed";
import { dailyReset, DailyResetAction } from "./landExpansion/dailyReset";
import {
  acknowledgeCalendarEvent,
  AcknowledgeCalendarEventAction,
} from "./landExpansion/acknowledgeCalendarEvent";

import { purchaseVIP, PurchaseVIPAction } from "./landExpansion/vipPurchased";

export type PlayingEvent =
  | PurchaseVIPAction
  | SellAnimalAction
  | SpeedUpBuilding
  | SacrificeBearAction
  | SpeedUpCollectible
  | SellBountyAction
  | FeedMixedAction
  | InstantExpand
  | InstantCookRecipe
  | ShipmentRestockAction
  | StartCompetitionAction
  | ClaimOfferAction
  | CompleteDailyChallengeAction
  | OilGreenhouseAction
  | HarvestGreenhouseAction
  | PlantGreenhouseAction
  | LandExpansionPlantAction
  | LandExpansionFertiliseCropAction
  | LandExpansionRemoveCropAction
  | LandExpansionHarvestAction
  | LandExpansionChopAction
  | LandExpansionStoneMineAction
  | LandExpansionIronMineAction
  | LandExpansionMineGoldAction
  | MineCrimstoneAction
  | MineSunstoneAction
  | ClaimAirdropAction
  | RecipeCookedAction
  | CollectRecipeAction
  | FeedBumpkinAction
  | DetectBotAction
  | PickSkillAction
  | ChoseSkillAction
  | ResetSkillsAction
  | SeedBoughtAction
  | ClaimAchievementAction
  | LandExpansionFeedChickenAction
  | CraftToolAction
  | buyDecorationAction
  | SellCropAction
  | CollectCropRewardAction
  | CollectTreeRewardAction
  | LandExpansionCollectEggsAction
  | PlantFruitAction
  | HarvestFruitAction
  | RemoveFruitTreeAction
  | CraftCollectibleAction
  | SellTreasureAction
  | RestockAction
  | NPCRestockAction
  | SellGarbageAction
  // Chores
  | CompleteChoreAction
  | SkipChoreAction
  | ExpandLandAction
  | MessageRead
  | PickMushroomAction
  // TODO - remove once landscaping is released
  | RemoveBuildingAction
  | RemoveCollectibleAction
  | RemoveChickenAction
  | DeliverOrderAction
  | EquipBumpkinAction
  | RefundBidAction
  | MixPotionAction
  | BuyWearableAction
  | SkipOrderAction
  | CompleteBertObsessionAction
  | StartPotionAction
  | ReceiveTradeAction
  | CancelTradeAction
  | StartComposterAction
  | collectCompostAction
  | FertiliseFruitAction
  | CastRodAction
  | ReelRodAction
  | ClaimMilestoneAction
  | MissFishAction
  | RevealLandAction
  | BurnCollectibleAction
  | ClaimBonusAction
  | AccelerateComposterAction
  | BuyFarmHandAction
  | EquipFarmHandAction
  | HarvestBeehiveAction
  | PlantFlowerAction
  | HarvestFlowerAction
  | UpgradeFarmAction
  | PurchaseBannerAction
  | FlowerShopTradedAction
  | BuyMegaStoreItemAction
  | CompleteSpecialEventTaskAction
  | GiftFlowersAction
  | ClaimGiftAction
  | EnterRaffleAction
  | ExchangeSFLtoCoinsAction
  | DrillOilReserveAction
  | ClaimMinigamePrizeAction
  | PurchaseMinigameAction
  | StartMinigameAttemptAction
  | SubmitMinigameScoreAction
  | UnlockMinigameAchievementsAction
  | SkillUseAction
  | SupplyCropMachineAction
  | HarvestCropMachineAction
  | SupplyCookingOilAction
  | JoinFactionAction
  | CompleteKingdomChoreAction
  | SkipKingdomChoreAction
  | RefreshKingdomChoresAction
  | DeliverFactionKitchenAction
  | BuyFactionShopItemAction
  | ClaimFactionPrizeAction
  | FeedFactionPetAction
  | LeaveFactionAction
  | BuyMoreDigsAction
  | BuyMoreReelsAction
  | BuyAnimalAction
  | FeedAnimalAction
  | LoveAnimalAction
  | UpgradeBuildingAction
  | StartCraftingAction
  | CollectCraftingAction
  | CompleteNPCChoreAction
  | ClaimProduceAction
  | BuySeasonalItemAction
  | DiscoverRecipeAction
  | UnlockFarmhandAction
  | ClaimPurchaseAction
  | RedeemTradeRewardsAction
  | DailyResetAction
  | AcknowledgeCalendarEventAction
  // To remove once December is finished
  | CollectCandyAction;

export type PlacementEvent =
  | ConstructBuildingAction
  | PlaceBuildingAction
  | PlaceCollectibleAction
  | BuyChickenAction
  | PlaceChickenAction
  | PlaceTreeAction
  | PlacePlotAction
  | PlaceStoneAction
  | PlaceGoldAction
  | PlaceIronAction
  | PlaceCrimstoneAction
  | PlaceFruitPatchAction
  | PlaceSunstoneAction
  | buyDecorationAction
  | CraftCollectibleAction
  | MoveCollectibleAction
  | MoveBuildingAction
  | MoveCropAction
  | MoveFruitPatchAction
  | MoveTreeAction
  | MoveIronAction
  | MoveStoneAction
  | MoveGoldAction
  | MoveCrimstoneAction
  | MoveSunstoneAction
  | MoveChickenAction
  | RemoveBuildingAction
  | RemoveCollectibleAction
  | RemoveChickenAction
  | PlaceBudAction
  | MoveBudAction
  | RemoveBudAction
  | MoveBeehiveAction
  | PlaceBeehiveAction
  | MoveFlowerBedAction
  | PlaceFlowerBedAction
  | MoveOilReserveAction
  | PlaceOilReserveAction;

export type GameEvent = PlayingEvent | PlacementEvent;
export type GameEventName<T> = Extract<T, { type: string }>["type"];

export function isEventType<T extends PlayingEvent>(
  action: PlayingEvent,
  typeName: T["type"],
): action is T {
  return action.type === typeName;
}

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers<T> = {
  [Name in GameEventName<T>]: (options: {
    state: GameState;
    // Extract the correct event payload from the list of events
    action: Extract<GameEventName<T>, { type: Name }>;
    announcements?: Announcements;
    farmId?: number;
  }) => GameState;
};

export const PLAYING_EVENTS: Handlers<PlayingEvent> = {
  "vip.purchased": purchaseVIP,
  "animal.sold": sellAnimal,
  "building.spedUp": speedUpBuilding,
  "bear.sacrificed": sacrificeBear,
  "collectible.spedUp": speedUpCollectible,
  "expansion.spedUp": speedUpExpansion,
  "recipe.spedUp": speedUpRecipe,
  "bounty.sold": sellBounty,
  "competition.started": startCompetition,
  "offer.claimed": claimOffer,
  "dailyChallenge.completed": completeDailyChallenge,
  "faction.left": leaveFaction,
  "faction.prizeClaimed": claimFactionPrize,
  "greenhouse.oiled": oilGreenhouse,
  "greenhouse.harvested": harvestGreenHouse,
  "greenhouse.planted": plantGreenhouse,
  "minigame.itemPurchased": purchaseMinigameItem,
  "minigame.prizeClaimed": claimMinigamePrize,
  "minigame.attemptStarted": startMinigameAttempt,
  "minigame.scoreSubmitted": submitMinigameScore,
  "minigame.achievementsUnlocked": unlockMinigameAchievements,
  "airdrop.claimed": claimAirdrop,
  "bot.detected": detectBot,
  "seed.planted": landExpansionPlant,
  "crop.harvested": landExpansionHarvest,
  "plot.fertilised": landExpansionFertilise,
  "crop.removed": landExpansionRemoveCrop,
  "chicken.collectEgg": landExpansionCollectEggs,
  "stoneRock.mined": landExpansionMineStone,
  "ironRock.mined": landExpansionIronMine,
  "goldRock.mined": landExpansionMineGold,
  "crimstoneRock.mined": mineCrimstone,
  "sunstoneRock.mined": mineSunstone,

  "timber.chopped": landExpansionChop,
  "recipe.cooked": cook,
  "recipe.collected": collectRecipe,
  "bumpkin.feed": feedBumpkin,
  "skill.picked": pickSkill,
  "skill.chosen": choseSkill,
  "skills.reset": resetSkills,
  "seed.bought": seedBought,
  "achievement.claimed": claimAchievement,
  "chicken.fed": LandExpansionFeedChicken,
  "tool.crafted": craftTool,
  "decoration.bought": buyDecoration,
  "crop.sold": sellCrop,

  "cropReward.collected": collectCropReward,
  "treeReward.collected": collectTreeReward,
  "fruit.planted": plantFruit,
  "fruit.harvested": harvestFruit,
  "fruitTree.removed": removeFruitTree,
  "collectible.crafted": craftCollectible,
  "treasure.sold": sellTreasure,
  "shops.restocked": restock,
  "npc.restocked": npcRestock,
  "garbage.sold": sellGarbage,
  "chore.completed": completeChore,
  "chore.skipped": skipChore,
  "land.expanded": expandLand,
  "message.read": readMessage,
  "mushroom.picked": pickMushroom,
  // TODO - remove once landscaping is released
  "building.removed": removeBuilding,
  "collectible.removed": removeCollectible,
  "chicken.removed": removeChicken,
  "order.delivered": deliverOrder,
  "order.skipped": skipOrder,
  "bumpkin.equipped": equip,
  "bid.refunded": refundBid,
  "potion.mixed": mixPotion,
  "wearable.bought": buyWearable,
  "bertObsession.completed": completeBertObsession,
  "potion.started": startPotion,
  "trade.cancelled": cancelTrade,
  "trade.received": receiveTrade,
  "composter.started": startComposter,
  "compost.collected": collectCompost,
  "fruitPatch.fertilised": fertiliseFruitPatch,
  "rod.casted": castRod,
  "rod.reeled": reelRod,
  "milestone.claimed": claimMilestone,
  "fish.missed": missFish,
  "land.revealed": revealLand,
  "collectible.burned": burnCollectible,
  "bonus.claimed": claimBonus,
  "compost.accelerated": accelerateComposter,
  "farmHand.bought": buyFarmhand,
  "farmHand.equipped": equipFarmhand,
  "beehive.harvested": harvestBeehive,
  "flower.planted": plantFlower,
  "flower.harvested": harvestFlower,
  "farm.upgraded": upgrade,
  "banner.purchased": purchaseBanner,
  "flowerShop.traded": tradeFlowerShop,
  "megastoreItem.bought": buyMegaStoreItem,
  "specialEvent.taskCompleted": completeSpecialEventTask,
  "flowers.gifted": giftFlowers,
  "gift.claimed": claimGift,
  "raffle.entered": enterRaffle,
  "sfl.exchanged": exchangeSFLtoCoins,
  "faction.joined": joinFaction,
  "oilReserve.drilled": drillOilReserve,
  "cropMachine.supplied": supplyCropMachine,
  "cropMachine.harvested": harvestCropMachine,
  "cookingOil.supplied": supplyCookingOil,
  "kingdomChore.completed": completeKingdomChore,
  "kingdomChore.skipped": skipKingdomChore,
  "kingdomChores.refreshed": refreshKingdomChores,
  "factionKitchen.delivered": deliverFactionKitchen,
  "factionShopItem.bought": buyFactionShopItem,
  "factionPet.fed": feedFactionPet,
  "desert.digsBought": buyMoreDigs,
  "shipment.restocked": shipmentRestock,
  "animal.bought": buyAnimal,
  "animal.fed": feedAnimal,
  "animal.loved": loveAnimal,
  "feed.mixed": feedMixed,
  "skill.used": skillUse,
  "building.upgraded": upgradeBuilding,
  "crafting.started": startCrafting,
  "crafting.collected": collectCrafting,
  "chore.fulfilled": completeNPCChore,
  "produce.claimed": claimProduce,
  "seasonalItem.bought": buySeasonalItem,
  "recipe.discovered": discoverRecipe,
  "farmHand.unlocked": unlockFarmhand,
  "fishing.reelsBought": buyMoreReels,
  "purchase.claimed": claimPurchase,
  "reward.redeemed": redeemTradeReward,
  "candy.collected": collectCandy,
  "daily.reset": dailyReset,
  "calendarEvent.acknowledged": acknowledgeCalendarEvent,
};

export const PLACEMENT_EVENTS: Handlers<PlacementEvent> = {
  "building.constructed": constructBuilding,
  "building.placed": placeBuilding,
  "collectible.placed": placeCollectible,
  "chicken.bought": buyChicken,
  "chicken.placed": placeChicken,
  "tree.placed": placeTree,
  "plot.placed": placePlot,
  "stone.placed": placeStone,
  "gold.placed": placeGold,
  "iron.placed": placeIron,
  "crimstone.placed": placeCrimstone,
  "fruitPatch.placed": placeFruitPatch,
  "decoration.bought": buyDecoration,
  "collectible.crafted": craftCollectible,
  "collectible.moved": moveCollectible,
  "building.moved": moveBuilding,
  "fruitPatch.moved": moveFruitPatch,
  "tree.moved": moveTree,
  "crop.moved": moveCrop,
  "iron.moved": moveIron,
  "stone.moved": moveStone,
  "gold.moved": moveGold,
  "crimstone.moved": moveCrimstone,
  "chicken.moved": moveChicken,
  "building.removed": removeBuilding,
  "collectible.removed": removeCollectible,
  "chicken.removed": removeChicken,
  "bud.placed": placeBud,
  "bud.moved": moveBud,
  "bud.removed": removeBud,
  "beehive.moved": moveBeehive,
  "beehive.placed": placeBeehive,
  "flowerBed.moved": moveFlowerBed,
  "flowerBed.placed": placeFlowerBed,
  "sunstone.placed": placeSunstone,
  "sunstone.moved": moveSunstone,
  "oilReserve.moved": moveOilReserve,
  "oilReserve.placed": placeOilReserve,
};

export const EVENTS = { ...PLAYING_EVENTS, ...PLACEMENT_EVENTS };
