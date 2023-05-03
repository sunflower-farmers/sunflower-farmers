import React from "react";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { NPCParts } from "features/island/bumpkin/components/NPC";

import obieImg from "assets/npcs/obie.png";
import maxiumusImg from "assets/npcs/maximus.png";
import hootImg from "assets/npcs/hoot.png";
import snailImg from "assets/npcs/snail.png";

export type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SpeakingBumpkin = "marcus" | "bella" | "sofia";
export type SpeakingNonBumpkin = "hoot" | "maximus" | "obie" | "snail";
export type SpeakingCharacter = SpeakingBumpkin | SpeakingNonBumpkin;

export function isSpeakingBumpkin(
  value: SpeakingCharacter
): value is SpeakingBumpkin {
  return ["marcus", "bella", "sofia"].includes(value);
}

export function isSpeakingNonBumpkin(
  value: SpeakingCharacter
): value is SpeakingNonBumpkin {
  return ["hoot", "maximus", "obie", "wendy", "snail"].includes(value);
}

const marcusParts: Partial<NPCParts> = {
  hair: "Blacksmith Hair",
  shirt: "Striped Blue Shirt",
  pants: "Lumberjack Overalls",
  body: "Light Brown Worried Farmer Potion",
};

const bellaParts: Partial<NPCParts> = {
  hair: "Parlour Hair",
  shirt: "Maiden Top",
  pants: "Peasant Skirt",
  tool: "Farmer Pitchfork",
  body: "Light Brown Worried Farmer Potion",
};

const sofiaParts: Partial<NPCParts> = {
  hair: "Red Long Hair",
  shirt: "Fire Shirt",
  necklace: "Artist Scarf",
  pants: "Farmer Pants",
  body: "Light Brown Worried Farmer Potion",
};

type CharacterDetails = Coordinates & {
  flip?: boolean;
  dialogue?: JSX.Element;
};

type DawnBreakerPositions = {
  lanterns: Coordinates[];
  bumpkin: CharacterDetails;
  marcus?: CharacterDetails;
  bella?: CharacterDetails;
  sofia?: CharacterDetails;
  hoot?: CharacterDetails;
  maximus?: CharacterDetails;
  obie?: CharacterDetails;
  wendy?: CharacterDetails;
  snail?: CharacterDetails;
};

export const bumpkinParts: Record<SpeakingBumpkin, Partial<NPCParts>> = {
  marcus: marcusParts,
  bella: bellaParts,
  sofia: sofiaParts,
};

export const characterImages: Record<SpeakingNonBumpkin, string> = {
  hoot: hootImg,
  maximus: maxiumusImg,
  obie: obieImg,
  snail: snailImg,
};

export const characters: Record<Week, DawnBreakerPositions> = {
  1: {
    lanterns: [
      {
        x: -11,
        y: 7,
      },
      {
        x: -9,
        y: 5,
      },
      {
        x: -13,
        y: 5,
      },
      {
        x: -12,
        y: 3,
      },
      {
        x: -10,
        y: 3,
      },
    ],
    bumpkin: {
      x: -11,
      y: 5,
    },
    marcus: {
      x: 4,
      y: -14,
      flip: true,
      dialogue: (
        <>
          <p>{`Marcus: What's happening? Why has the darkness come?`}</p>
          <p>{`I need to protect my family, but how can I when we can't even see what's out there?`}</p>
        </>
      ),
    },
    bella: {
      x: 3,
      y: -15,
      flip: true,
      dialogue: (
        <>
          <p>{`Bella: Oh no, my crops! They won't survive without sunlight. How will we feed ourselves?`}</p>
          <p>{`Marcus, I'm so scared.`}</p>
        </>
      ),
    },
    sofia: {
      x: 1,
      y: -14,
      dialogue: (
        <>
          <p>
            Sofia: This is so scary, but also kind of exciting. What do you
            think is causing this darkness?
          </p>
          <p>I want to help however I can.</p>
        </>
      ),
    },
    hoot: {
      x: -7,
      y: -9,
      dialogue: (
        <>
          <p>
            Hoot: Embrace the darkness, my friends. It holds the key to your
            freedom. Dance with darkness until the fire lights.
          </p>
        </>
      ),
    },
    maximus: {
      x: -7,
      y: -12,
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
    snail: {
      x: 3,
      y: 4,
      flip: true,
    },
  },
  2: {
    lanterns: [
      {
        x: 0,
        y: 2,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 0,
      },
      {
        x: 1,
        y: -1,
      },
      {
        x: -1,
        y: 0,
      },
    ],
    bumpkin: {
      x: 1,
      y: 1,
    },
    hoot: {
      x: -7,
      y: -9,
    },
    maximus: {
      x: -7,
      y: -12,
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
    snail: {
      x: 3,
      y: 4,
      flip: true,
    },
  },
  3: {
    lanterns: [
      {
        x: 10,
        y: 5,
      },
      {
        x: 8,
        y: 3,
      },
      {
        x: 9,
        y: 0,
      },
      {
        x: 11,
        y: 0,
      },
      {
        x: 12,
        y: 3,
      },
    ],
    bumpkin: {
      x: 10,
      y: 3,
    },
    hoot: {
      x: -7,
      y: -9,
    },
    maximus: {
      x: -7,
      y: -12,
    },
    wendy: {
      x: -11,
      y: -4,
    },
    obie: {
      x: -9,
      y: -12,
    },
  },
  4: {
    lanterns: [
      {
        x: -11,
        y: -2,
      },
      {
        x: -13,
        y: -4,
      },
      {
        x: -12,
        y: -6,
      },
      {
        x: -10,
        y: -6,
      },
      {
        x: -9,
        y: -4,
      },
    ],
    bumpkin: {
      x: -11,
      y: -4,
    },
  },
  5: {
    lanterns: [
      {
        x: 9,
        y: -3,
      },
      {
        x: 7,
        y: -5,
      },
      {
        x: 8,
        y: -7,
      },
      {
        x: 10,
        y: -7,
      },
      {
        x: 11,
        y: -6,
      },
    ],
    bumpkin: {
      x: 9,
      y: -5,
    },
  },
  6: {
    lanterns: [
      {
        x: 0,
        y: 0,
      },
      {
        x: -2,
        y: -2,
      },
      {
        x: -1,
        y: -4,
      },
      {
        x: 1,
        y: -4,
      },
      {
        x: 2,
        y: -2,
      },
    ],
    bumpkin: {
      x: 0,
      y: -2,
    },
  },
  7: {
    lanterns: [
      {
        x: 4,
        y: -7,
      },
      {
        x: 2,
        y: -9,
      },
      {
        x: 3,
        y: -11,
      },
      {
        x: 5,
        y: -11,
      },
      {
        x: 6,
        y: -9,
      },
    ],
    bumpkin: {
      x: 4,
      y: -9,
    },
  },
  8: {
    lanterns: [
      {
        x: -9,
        y: -12,
      },
      {
        x: -9,
        y: -14,
      },
      {
        x: -7,
        y: -15,
      },
      {
        x: -6,
        y: -13,
      },
      {
        x: -7,
        y: -11,
      },
    ],
    bumpkin: {
      x: -7,
      y: -13,
    },
  },
  9: {
    lanterns: [],
    bumpkin: {
      x: -4,
      y: -14,
    },
  },
};
