/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type SessionChanged = ContractEventLog<{
  owner: string;
  sessionId: string;
  farmId: string;
  0: string;
  1: string;
  2: string;
}>;

export interface SunflowerLandSession extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): SunflowerLandSession;
  clone(): SunflowerLandSession;
  methods: {
    addGameRole(_game: string): NonPayableTransactionObject<void>;

    addRecipeBatch(
      _recipes: {
        mintId: number | string | BN;
        ingredientIds: (number | string | BN)[];
        ingredientAmounts: (number | string | BN)[];
        maxSupply: number | string | BN;
        cooldownSeconds: number | string | BN;
        tokenAmount: number | string | BN;
        enabled: boolean;
      }[]
    ): NonPayableTransactionObject<boolean[]>;

    cancelTrade(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      listingId: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    communityTax(): NonPayableTransactionObject<string>;

    deposit(): PayableTransactionObject<void>;

    destroy(): PayableTransactionObject<void>;

    executed(arg0: string | number[]): NonPayableTransactionObject<boolean>;

    expandLand(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      nonce: string,
      metadata: string,
      sfl: number | string | BN,
      resourceIds: (number | string | BN)[],
      resourceAmounts: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    getMaxItemAmounts(
      _ids: (number | string | BN)[]
    ): NonPayableTransactionObject<string[]>;

    getMintedAtBatch(
      farmId: number | string | BN,
      mintIds: (number | string | BN)[]
    ): NonPayableTransactionObject<string[]>;

    getRecipe(id: number | string | BN): NonPayableTransactionObject<{
      mintId: string;
      ingredientIds: string[];
      ingredientAmounts: string[];
      maxSupply: string;
      cooldownSeconds: string;
      tokenAmount: string;
      enabled: boolean;
    }>;

    getRecipeBatch(ids: (number | string | BN)[]): NonPayableTransactionObject<
      {
        mintId: string;
        ingredientIds: string[];
        ingredientAmounts: string[];
        maxSupply: string;
        cooldownSeconds: string;
        tokenAmount: string;
        enabled: boolean;
      }[]
    >;

    getResourceTaxes(
      _ids: (number | string | BN)[]
    ): NonPayableTransactionObject<string[]>;

    getSession(
      tokenId: number | string | BN,
      ids: (number | string | BN)[]
    ): NonPayableTransactionObject<{
      id: string;
      syncedAt: string;
      mintedAts: string[];
    }>;

    getSessionId(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    getSyncedAt(
      tokenId: number | string | BN
    ): NonPayableTransactionObject<string>;

    listTrade(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      slotId: number | string | BN,
      farmId: number | string | BN,
      resourceId: number | string | BN,
      resourceAmount: number | string | BN,
      sfl: number | string | BN,
      tax: number | string | BN,
      listFee: number | string | BN
    ): PayableTransactionObject<boolean>;

    mint(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      mintId: number | string | BN,
      mintFee: number | string | BN
    ): PayableTransactionObject<boolean>;

    mintAllowance(): NonPayableTransactionObject<string>;

    mintedAmount(): NonPayableTransactionObject<string>;

    owner(): NonPayableTransactionObject<string>;

    purchaseTrade(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      listingId: number | string | BN,
      sfl: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    removeGameRole(_game: string): NonPayableTransactionObject<void>;

    removeRecipeBatch(
      ids: (number | string | BN)[]
    ): NonPayableTransactionObject<boolean[]>;

    renounceOwnership(): NonPayableTransactionObject<void>;

    resourceTax(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    sessions(arg0: number | string | BN): NonPayableTransactionObject<string>;

    setCommunityTax(
      _tax: number | string | BN
    ): NonPayableTransactionObject<void>;

    setCommunityTreasuy(
      _communityTreasury: string
    ): NonPayableTransactionObject<void>;

    setLandExpansionMinter(
      _landExpansionMinter: string
    ): NonPayableTransactionObject<void>;

    setLiquify(_liquify: boolean): NonPayableTransactionObject<void>;

    setMaxItemAmounts(
      _ids: (number | string | BN)[],
      _amounts: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    setMaxSessionSFL(
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    setMintAllowance(
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    setMintedAtBulk(
      _farmIds: (number | string | BN)[],
      _mintId: number | string | BN,
      _mintedAt: number | string | BN
    ): NonPayableTransactionObject<boolean[]>;

    setResourceTaxes(
      _ids: (number | string | BN)[],
      _amounts: (number | string | BN)[]
    ): NonPayableTransactionObject<void>;

    setTeamWithrawalMinimum(
      _minimum: number | string | BN
    ): NonPayableTransactionObject<void>;

    setTrader(_trader: string): NonPayableTransactionObject<void>;

    setWishingWell(_wishingWell: string): NonPayableTransactionObject<void>;

    setWishingWellTax(
      _tax: number | string | BN
    ): NonPayableTransactionObject<void>;

    sync(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      mintIds: (number | string | BN)[],
      mintAmounts: (number | string | BN)[],
      burnIds: (number | string | BN)[],
      burnAmounts: (number | string | BN)[],
      tokens: number | string | BN,
      syncFee: number | string | BN
    ): PayableTransactionObject<boolean>;

    syncedAt(arg0: number | string | BN): NonPayableTransactionObject<string>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    transferSigner(_signer: string): NonPayableTransactionObject<void>;

    transferSyncFeeWallet(_team: string): NonPayableTransactionObject<void>;

    transferTradeFeeWallet(_wallet: string): NonPayableTransactionObject<void>;

    transferWithdrawFeeWallet(_team: string): NonPayableTransactionObject<void>;

    wishingWellTax(): NonPayableTransactionObject<string>;

    withdraw(
      signature: string | number[],
      sessionId: string | number[],
      nextSessionId: string | number[],
      deadline: number | string | BN,
      farmId: number | string | BN,
      ids: (number | string | BN)[],
      amounts: (number | string | BN)[],
      sfl: number | string | BN,
      tax: number | string | BN
    ): NonPayableTransactionObject<boolean>;
  };
  events: {
    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    SessionChanged(cb?: Callback<SessionChanged>): EventEmitter;
    SessionChanged(
      options?: EventOptions,
      cb?: Callback<SessionChanged>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "SessionChanged", cb: Callback<SessionChanged>): void;
  once(
    event: "SessionChanged",
    options: EventOptions,
    cb: Callback<SessionChanged>
  ): void;
}
