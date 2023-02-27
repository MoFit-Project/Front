import "phaser";
import { useEffect } from "react";
export default class Main extends Phaser.Scene {
  playerLeft;
  playerRight;
  swordAttack;
  swordAttackSpeed = 1000;
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
    this.load.spritesheet(
      "swordAttack",
      "assets/sword_attack.png",
      { frameWidth: 128, frameHeight: 128 },
      18
    );
  }

  create() {
    // 캐릭터 설정
    this.playerLeft = this.add.sprite(300, 500, "knight").setScale(3);
    this.playerRight = this.physics.add
      .sprite(1500, 500, "knight")
      .setScale(3)
      .toggleFlipX();
    this.playerRight.setSize(10, 10);
    // this.playerRight.setGravity(0, -200);

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
    this.playerLeft.on("animationcomplete-attack", () => {
      this.playerLeft.anims.play("walk", true);
    });

    // 투사체 설정
    // 투사체를 생성하고 초기화합니다.
    this.swordAttack = this.physics.add
      .sprite(500, 500, "swordAttack")
      .setOrigin(0, 0);
    this.anims.create({
      key: "swordAttack", //액션이름
      frames: this.anims.generateFrameNumbers("swordAttack", {
        start: 0,
        end: 9,
      }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 20, // 초당 프레임 개수
      repeat: -1, // 0 : 한번만 반복
    });
    this.swordAttack.x = this.playerLeft.x;
    this.swordAttack.y = this.playerLeft.y;
    // 안보이게 하기
    this.swordAttack.visible = false;
    this.swordAttack.setSize(10, 10);

    // 콘솔키 설정
    this.cursors = this.input.keyboard.createCursorKeys();

    // this.group1 = this.physics.add.group();
    this.physics.add.overlap(
      this.playerRight,
      this.swordAttack,
      this.playerRightHit,
      null,
      this
    );
  }

  update() {
    // this.physics.add.collider(this.playerRight, this.swordAttack, this.playerRightHit, null, this);
    // this.playerRight.velocity = 0;

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
      this.playerLeft.anims.play("attack", true);

      this.swordAttackLaunched = true;

      // 투사체를 보이게 하고 초기 속도와 각도를 설정합니다.
      this.swordAttack.visible = true;
      this.swordAttack.anims.play("swordAttack", true);
      this.physics.velocityFromAngle(
        this.swordAttackAngle,
        this.swordAttackSpeed,
        this.swordAttack.body.velocity
      );
      this.swordAttack.setGravity(0, 830);
      // this.swordAttack.body.velocity.x += -200;
      console.log(this.swordAttackAngle, this.swordAttackSpeed);
    }

    // 투사체가 화면 밖으로 나가면 다시 초기화합니다.
    if (
      this.swordAttack.y > 600 ||
      // this.swordAttack.y < 0 ||
      this.swordAttack.x > 1700 ||
      this.swordAttack.x < 0
    ) {
      this.swordAttack.setGravity(0);
      this.swordAttackLaunched = false;
      this.swordAttack.body.stop();
      this.swordAttack.x = this.playerLeft.x;
      this.swordAttack.y = this.playerLeft.y;
      this.swordAttack.visible = false;
    }
  }

  playerRightHit() {
    this.swordAttack.setGravity(0);
    this.swordAttackLaunched = false;
    this.swordAttack.body.stop();
    this.swordAttack.x = this.playerLeft.x;
    this.swordAttack.y = this.playerLeft.y;
    this.swordAttack.visible = false;

    // swordAttack.x = this.playerLeft.x;
    // swordAttack.y = this.playerLeft.y;
    // swordAttack.setActive(true).setVisible(false);

    // playerRight.x = 1500;
    // playerRight.y = 500;
    // this.playerRight.body.velocity = 0;

    // console.log("playerRight Hit");
    // alert("Player 2 Hit !");
  }

  // render() {
  //   this.debug.body(this.playerRight);
  // }
}
