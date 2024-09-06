import {
  mintAuctionCollectible,
  mintAuctionWearable,
} from "lib/blockchain/Auction";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Bid, GameState, InventoryItemName } from "../types/game";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "../types/seasons";
import { makeGame } from "../lib/transforms";

type Request = {
  farmId: number;
  auctionId: string;
  token: string;
  transactionId: string;
  bid?: Bid;
};

const API_URL = CONFIG.API_URL;

export async function mintAuctionItemRequest(
  request: Request,
): Promise<{ game: GameState }> {
  const response = await window.fetch(
    `${API_URL}/auction/mint/${request.farmId}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        "X-Transaction-ID": request.transactionId,
      },
      body: JSON.stringify({
        auctionId: request.auctionId,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.MINT_COLLECTIBLE_SERVER_ERROR);
  }

  const transaction = await response.json();

  return {
    game: makeGame(transaction.farm),
  };
}
