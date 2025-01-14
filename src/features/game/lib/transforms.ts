import Decimal from "decimal.js-light";

import { GameState, InventoryItemName } from "../types/game";

/**
 * Converts API response into a game state
 */
export function makeGame(farm: any): GameState {
  return {
    inventory: Object.keys(farm.inventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.inventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>,
    ),
    previousInventory: Object.keys(farm.previousInventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.previousInventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>,
    ),
    wardrobe: farm.wardrobe,
    calendar: farm.calendar,
    previousWardrobe: farm.previousWardrobe,
    competitions: farm.competitions,
    verified: farm.verified,
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>,
    ),
    bounties: farm.bounties,
    island: farm.island,
    bank: farm.bank,
    home: farm.home,
    createdAt: farm.createdAt,
    chickens: farm.chickens || {},
    stockExpiry: farm.stockExpiry || {},
    coins: farm.coins,
    balance: new Decimal(farm.balance),
    previousBalance: new Decimal(farm.previousBalance),
    username: farm.username,
    trades: farm.trades,
    farmHands: farm.farmHands,

    bertObsession: farm.bertObsession,

    expansionConstruction: farm.expansionConstruction,
    expandedAt: farm.expandedAt,
    greenhouse: farm.greenhouse,
    choreBoard: farm.choreBoard,

    shipments: farm.shipments,
    gems: farm.gems,

    bumpkin: farm.bumpkin,
    buildings: farm.buildings,
    fishing: farm.fishing ?? { wharf: {}, beach: {} },
    farmActivity: farm.farmActivity ?? {},
    milestones: farm.milestones ?? {},
    airdrops: farm.airdrops,
    collectibles: farm.collectibles,
    warCollectionOffer: farm.warCollectionOffer,
    mysteryPrizes: farm.mysteryPrizes,
    treasureIsland: farm.treasureIsland,
    pumpkinPlaza: farm.pumpkinPlaza,
    dailyRewards: farm.dailyRewards,
    auctioneer: farm.auctioneer ?? {},
    minigames: farm.minigames,
    kingdomChores: farm.kingdomChores,
    chores: farm.chores,
    tradedAt: farm.tradedAt,
    trees: farm.trees ?? {},
    stones: farm.stones ?? {},
    iron: farm.iron ?? {},
    gold: farm.gold ?? {},
    crimstones: farm.crimstones ?? {},
    oilReserves: farm.oilReserves ?? {},
    sunstones: farm.sunstones ?? {},
    crops: farm.crops ?? {},
    fruitPatches: farm.fruitPatches ?? {},
    flowers: farm.flowers ?? {},
    beehives: farm.beehives ?? {},
    conversations: farm.conversations ?? [],
    mailbox: farm.mailbox ?? {
      read: [],
      unread: [],
    },
    mushrooms: farm.mushrooms,
    delivery: farm.delivery,
    potionHouse: farm.potionHouse,
    npcs: farm.npcs,
    buds: farm.buds,
    christmas2024: farm.christmas2024,
    flowerShop: farm.flowerShop,
    specialEvents: farm.specialEvents,
    experiments: farm.experiments,
    rewards: farm.rewards,
    megastore: {
      ...farm.megastore,
      wearables: farm.megastore.wearables.map((wearable: any) => ({
        ...wearable,
        price: new Decimal(wearable.price),
      })),
      collectibles: farm.megastore.collectibles.map((collectible: any) => ({
        ...collectible,
        price: new Decimal(collectible.price),
      })),
    },
    goblinMarket: farm.goblinMarket,
    faction: farm.faction,
    dailyFactionDonationRequest: farm.dailyFactionDonationRequest
      ? {
          resource: farm.dailyFactionDonationRequest.resource,
          amount: new Decimal(farm.dailyFactionDonationRequest.amount),
        }
      : undefined,
    desert: farm.desert,
    transaction: farm.transaction,
    henHouse: farm.henHouse,
    barn: farm.barn,
    craftingBox: farm.craftingBox,
    season: farm.season,
  };
}
