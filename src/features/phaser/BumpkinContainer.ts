import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { Bumpkin } from "features/game/types/game";
import { buildNPCSheet } from "features/bumpkins/actions/buildNPCSheet";

export class BumpkinContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;

  public speech: SpeechBubble | undefined;

  private bumpkin: Bumpkin;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    bumpkin: Bumpkin,
    onClick?: () => void
  ) {
    super(scene, x, y);
    this.scene = scene;
    this.bumpkin = bumpkin;

    scene.physics.add.existing(this);

    this.loadSprites(scene);

    const shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(shadow);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        console.log("Bumpkin clicked");
        onClick();
      });
    }
  }

  private async loadSprites(scene: Phaser.Scene) {
    const sheet = await buildNPCSheet({
      parts: this.bumpkin.equipped,
    });

    const spriteSheetKey = `${this.bumpkin.id}-bumpkin-idle-sheet`;

    const loader = this.scene.load.spritesheet(spriteSheetKey, sheet, {
      frameWidth: 20,
      frameHeight: 19,
    });

    loader.on(Phaser.Loader.Events.COMPLETE, () => {
      this.sprite = scene.add
        .sprite(0, 0, spriteSheetKey)
        .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

      this.add(this.sprite);

      scene.anims.create({
        key: `${this.bumpkin.id}-bumpkin-idle`,
        frames: scene.anims.generateFrameNumbers(spriteSheetKey, {
          start: 0,
          end: 8,
        }),
        repeat: -1,
        frameRate: 10,
      });
      this.sprite.play(`${this.bumpkin.id}-bumpkin-idle`, true);
    });

    scene.load.start();
  }

  public speak(text: string) {
    if (this.speech) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(this.scene, text);
    this.add(this.speech);
  }
}
