import "phaser";
import { useEffect } from "react";
export default class Main extends Phaser.Scene {

  // HEIGHT - 100 => 256
  // WIDTH => 1234

  player;
  boss;

  constructor() {
    super();
  }

  preload() {
    // 스프라이트 삽입
    // 시트이름, 시트경로, {frameWidth: 각 프레임의 가로길이, frameHeight : 세로길이}, 프레임개수
    this.load.spritesheet(
      "knight",
      "assets/knight.png",
      { frameWidth: 128, frameHeight: 128 },
      25
    );

    // 투사체 추가
    this.load.spritesheet(
      "throwAttack",
      "assets/sword_attack.png",
      { frameWidth: 128, frameHeight: 128 },
      18
    );

    this.load.image("bg", "assets/bg/1.png");
    this.load.image("cactus", "assets/bg/2.png");
  }



  create() {
    this.bg = this.add.tileSprite(0, 256, 1234, 15, "bg").setOrigin(0, 0);

    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("knight", { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player = this.physics.add.sprite(50, 256);
    this.player.body.setSize(20, 50);
    this.player.play("walk");

    this.delay = 3000;
    this.timer = this.time.addEvent({
      delay: this.delay,
      callback: this.onTimerEvent,
      callbackScope: this,
      loop: true,
    });

    this.input.on(
      "pointerdown",
      function (pointer) {
        if (this.player.y < 256) return;
        this.tweens.add({
          targets: this.player,
          y: this.player.y - 50,
          duration: 500,
          yoyo: true,
        });
      }.bind(this)
    );
  }

  onTimerEvent() {
    this.addCactus();
  }

  addCactus() {
    this.cactusGroup = this.physics.add.group();
    var randomX = Phaser.Math.Between(100, 200);
    var cactus = this.physics.add
      .sprite(1234 + randomX, 256, "cactus")
      .setScale(0.5);
    cactus.body.setSize(20, 50);
    this.cactusGroup.add(cactus);

    this.tweens.add({
      targets: cactus,
      x: 0,
      duration: 2000,
      onComplete: function (tween, targets) {
        cactus.destroy();
      }.bind(this),
    });
    this.physics.add.overlap(
      this.cactusGroup,
      this.player,
      this.hitCactusPlayer,
      null,
      this
    );
  }

  update() {
    this.bg.tilePositionX += 5;
  }

  hitCactusPlayer() {
    alert("Game Over!!!");
    this.scene.restart();
  }
}
