import "phaser";
import { useEffect } from "react";
export default class Main extends Phaser.Scene {
  player;
  player2;
  swordAttack;
  swordAttackSpeed = 500;
  swordAttackAngle = -45;
  swordAttackLaunched = false;
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
    this.load.spritesheet("swordAttack", "assets/sword_attack.png", { frameWidth: 128, frameHeight: 128 }, 18);
  }

  create() {
    // 캐릭터 설정
    this.player = this.add.sprite(300, 500, "knight").setScale(3);
    this.player2 = this.add
      .sprite(1500, 500, "knight")
      .setScale(3)
      .toggleFlipX();

    this.anims.create({
      key: "attack", //액션이름
      frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 3 }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 10, // 초당 프레임 개수
      repeat: 0, // 0 : 한번만 반복
    });
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("knight", { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });
    // attack 애니메이션이 끝나고 실행 할 애니메이션  play 인자가 true라면 무한반복됨
    this.player.on("animationcomplete-attack", () => {
      this.player.anims.play("walk", true);
    });

    // 투사체 설정
    // 투사체를 생성하고 초기화합니다.
    this.swordAttack = this.physics.add.sprite(500, 500, "swordAttack").setOrigin(0, 0);
    this.anims.create({
      key: "swordAttack", //액션이름
      frames: this.anims.generateFrameNumbers("swordAttack", { start: 0, end: 9 }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 20, // 초당 프레임 개수
      repeat: -1, // 0 : 한번만 반복
    });
    this.swordAttack.x = this.player.x;
    this.swordAttack.y = this.player.y;
    // 안보이게 하기
    this.swordAttack.visible = false;

    // 콘솔키 설정
    this.cursors = this.input.keyboard.createCursorKeys();

    
    
    // this.swordAttack = this.physics.add.group();
    this.physics.add.collider(this.swordAttack, this.player2);
    this.physics.add.overlap(this.swordAttack, this.player2, this.player2Hit, null, this);
  }

  update() {

    // this.swordAttack.body.velocity.x = 500;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.swordAttackAngle -= 5;
      if (this.swordAttackAngle < -90) {
        this.swordAttackAngle = -90;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.swordAttackAngle += 5;
      if (this.swordAttackAngle > 0) {
        this.swordAttackAngle = 0;
      }
    }
    // 스페이스바가 눌린 경우 투사체를 발사합니다.
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
      !this.swordAttackLaunched
    ) {
      this.player.anims.play("attack", true);

      this.swordAttackLaunched = true;

      // 투사체를 보이게 하고 초기 속도와 각도를 설정합니다.
      this.swordAttack.visible = true;
      this.swordAttack.anims.play('swordAttack', true);
      this.physics.velocityFromAngle(
        this.swordAttackAngle,
        this.swordAttackSpeed,
        this.swordAttack.body.velocity
      );
      // this.swordAttack.body.velocity.x += -200;
      console.log(this.swordAttackAngle, this.swordAttackSpeed);
    }

    // 투사체가 화면 밖으로 나가면 다시 초기화합니다.
    if (
      this.swordAttack.y > 501 ||
      this.swordAttack.y < 0 ||
      this.swordAttack.x > 1700 ||
      this.swordAttack.x < 0
    ) {
      this.swordAttackLaunched = false;
      this.swordAttack.body.stop();
      this.swordAttack.x = this.player.x;
      this.swordAttack.y = this.player.y;
      this.swordAttack.visible = false;
    }
  }

  player2Hit(swordAttack, player2) {
    console.log("Player2 Hit");
  }
}
