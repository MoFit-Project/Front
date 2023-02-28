import "phaser";
import { useEffect } from "react";
export default class Main extends Phaser.Scene {
  leftPlayer;
  leftThrow;
  leftThrowAngle = -45;
  leftThrowLaunched = false;
  leftGuildLine;
  leftDead;
  leftPlayerHealthBar;
  leftPlayerLife = 3;

  rightPlayer;
  rightThrow;
  rightThrowAngle = -135;
  rightThrowLaunched = false;
  rightGuildLine;
  rightDead;
  rightPlayerHealthBar;
  rightPlayerLife = 3;


  attackSpeed = 1000;

  // 배경화면 설정
  bg;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

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
      33
    );
    //캐릭터 죽음
    this.load.spritesheet(
        "knightDead",
        "assets/knight_dead.png",
        { frameWidth: 256, frameHeight: 256 },
        10
    );

    // 투사체 추가
    this.load.spritesheet(
      "throwAttack",
      "assets/sword_attack.png",
      { frameWidth: 128, frameHeight: 128 },
      18
    );
    //가이드라인 삽입
    this.load.image('guildLine', 'assets/dot_line.png')

    //배경화면
    this.load.image('backGround','assets/backgroundDungeon.png')

    // 체력 바
    this.load.spritesheet(
      "redHealthBar",
      "assets/healthbar/Redbar/redHealthBar.png",
      { frameWidth: 1406, frameHeight: 294 },
      18
    );
  }








  create() {
    //배경 삽입
    this.bg = this.add.image(0,0,'backGround').setOrigin(0,0)
    this.bg.setDisplaySize(this.windowWidth, this.windowHeight);

    // 캐릭터 설정
    // 캐릭터 설정 Left
    this.leftPlayer = this.physics.add
      .sprite(300, 500, "knight",16)
      .setScale(3);
    this.leftPlayer.setOffset(14, 60).setBodySize(45, 50, false);

    // 캐릭터 설정 Right
    this.rightPlayer = this.physics.add
      .sprite(1500, 500, "knight",16)
      .setScale(3)
      .toggleFlipX();
    this.rightPlayer.setOffset(69, 60).setBodySize(45, 50, false);
    // this.rightPlayer.setGravity(0, -200);


    // 투사체 던지기 모션
    this.anims.create({
      key: "throwAct", //액션이름
      frames: this.anims.generateFrameNumbers("throwAttack", {
        start: 0,
        end: 9,
      }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 20, // 초당 프레임 개수
      repeat: -1, // 0 : 한번만 반복
    });


    // 투사체 설정 Left
    // 투사체를 생성하고 초기화합니다.
    this.leftThrow = this.physics.add
      .sprite(this.leftPlayer.x, this.leftPlayer.y, "throwAttack")
      .setOrigin(0.5, 0.5);
    // 안보이게 하기
    this.leftThrow.visible = false;
    this.leftThrow.setSize(10, 10); // 히트박스 조정


    // 투사체 설정 Right
    // 투사체를 생성하고 초기화합니다.
    this.rightThrow = this.physics.add
      .sprite(this.rightPlayer.x, this.rightPlayer.y, "throwAttack")
      .setOrigin(0.5, 0.5)
      .toggleFlipX();
    // 안보이게 하기
    this.rightThrow.visible = false;
    this.rightThrow.setSize(10, 10);


    // Attack Left to Right 
    this.physics.add.overlap(
      this.rightPlayer,
      this.leftThrow,
      this.rightPlayerHitted,
      null,
      this
    );
    // Attack Right to Left 
    this.physics.add.overlap(
      this.leftPlayer,
      this.rightThrow,
      this.leftPlayerHitted,
      null,
      this
    );


    // 가이드 선 Left
    this.leftGuildLine = this.add.image(this.leftPlayer.x, this.leftPlayer.y, 'guildLine').setOrigin(0, 0.5).setScale(0.3)
    // 가이드 선 Left
    this.rightGuildLine = this.add.image(this.rightPlayer.x, this.rightPlayer.y, 'guildLine').setOrigin(0, 0.5).setScale(0.3)


    this.anims.create({
      key: "attackAct", //액션이름
      frames: this.anims.generateFrameNumbers("knight", { start: 5, end: 11 }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 10, // 초당 프레임 개수
      repeat: 0, // 0 : 한번만 반복
    });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("knight", { start: 17, end: 24 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("knight", { start: 25, end: 30 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hurt",
      frames: this.anims.generateFrameNumbers("knight", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: 0,
    });
    this.anims.create({
      key: "dead",
      frames: this.anims.generateFrameNumbers("knightDead", { start: 0, end: 9 }),
      frameRate: 10,
      repeat: 0,
    });
    // 애니메이션 Left
    this.leftPlayer.on("animationcomplete", () => {
      this.leftPlayer.anims.play("walk", true);
    });
    this.leftPlayer.play("walk");
    // 애니메이션 Right
    this.rightPlayer.on("animationcomplete", () => {
      this.rightPlayer.anims.play("walk", true);
    });
    this.rightPlayer.play("walk");
    // 콘솔키 설정
    this.cursors = this.input.keyboard.createCursorKeys();


    // 캐릭터 health bar 설정 Left
    this.leftPlayerHealthBar = this.physics.add
      .sprite(this.leftPlayer.x + 100, this.leftPlayer.y - 300, "redHealthBar")
      .setScale(0.5)
      .setOrigin(0.5, 0.5);
    // this.leftPlayerHealthBar.setSize(10, 10);
    // 캐릭터 health bar 설정 Right
    this.rightPlayerHealthBar = this.physics.add
      .sprite(this.rightPlayer.x-100, this.rightPlayer.y - 300, "redHealthBar")
      .setScale(0.5)
      .setOrigin(0.5, 0.5);
    // this.rightPlayerHealthBar.setSize(10, 10);
    // 체력바 감소 애니메이션
    
    this.anims.create({
      key: "redHealthBar2",
      frames: this.anims.generateFrameNumbers("redHealthBar", { start: 8, end: 7 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "redHealthBar1",
      frames: this.anims.generateFrameNumbers("redHealthBar", { start: 6, end: 4 }),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "redHealthBar0",
      frames: this.anims.generateFrameNumbers("redHealthBar", { start: 3, end: 1 }),
      frameRate: 10,
      repeat: 0,
    });
  }





  update() {
    // this.physics.add.collider(this.rightPlayer, this.leftThrow, this.rightPlayerHit, null, this);
    // this.rightPlayer.velocity = 0;
    // 가이드 라인 리프레시
    this.leftGuildLine.angle = this.leftThrowAngle;
    this.rightGuildLine.angle = this.rightThrowAngle;



    // 각도 조절 Left
    if (this.cursors.up.isDown) {
      this.leftPlayer.anims.play("run", true);
      this.leftThrowAngle -= 1;
      if (this.leftThrowAngle < -90) {
        this.leftThrowAngle = -90;
      }
    } else if (this.cursors.down.isDown) {
      this.leftPlayer.anims.play("run", true);
      this.leftThrowAngle += 1;
      if (this.leftThrowAngle > 0) {
        this.leftThrowAngle = 0;
      }
    }

    // 각도 조절 Right
    if (this.cursors.left.isDown) {
      this.rightPlayer.anims.play("run", true);
      this.rightThrowAngle -= 1;
      if (this.rightThrowAngle < -180) {
        this.rightThrowAngle = -180;
      }
    } else if (this.cursors.right.isDown) {
      this.rightPlayer.anims.play("run", true);
      this.rightThrowAngle += 1;
      if (this.rightThrowAngle > -90) {
        this.rightThrowAngle = -90;
      }
    }




    // 스페이스바가 눌린 경우 투사체를 발사합니다.
    // 투사체 발사, 공격모션 Left
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
      !this.leftThrowLaunched
    ) {
      this.leftPlayer.anims.play("attackAct", true);

      this.leftThrowLaunched = true;

      // 투사체를 보이게 하고 초기 속도와 각도를 설정합니다.
      this.leftThrow.visible = true;
      this.leftThrow.anims.play("throwAct", true);
      this.physics.velocityFromAngle(
        this.leftThrowAngle,
        this.attackSpeed,
        this.leftThrow.body.velocity
      );
      this.leftThrow.setGravity(0, 830);
      // this.leftThrow.body.velocity.x += -200;
      console.log(this.leftThrowAngle, this.attackSpeed);
    }

    // 투사체 발사, 공격모션 right
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.shift) &&
      !this.rightThrowLaunched
    ) {
      this.rightPlayer.anims.play("attackAct", true);

      this.rightThrowLaunched = true;

      // 투사체를 보이게 하고 초기 속도와 각도를 설정합니다.
      this.rightThrow.visible = true;
      this.rightThrow.anims.play("throwAct", true);
      this.physics.velocityFromAngle(
        this.rightThrowAngle,
        this.attackSpeed,
        this.rightThrow.body.velocity
      );
      this.rightThrow.setGravity(0, 830);
      // this.rightThrow.body.velocity.x += -200;
      console.log(this.rightThrowAngle, this.attackSpeed);
    }



    // 화면 밖으로 나가면 투사체 초기화 Left
    if (
      this.leftThrow.y > 600 ||
      // this.leftThrow.y < 0 ||
      this.leftThrow.x > 1700 ||
      this.leftThrow.x < 0
    ) {
      this.leftThrow.setGravity(0);
      this.leftThrowLaunched = false;
      this.leftThrow.body.stop();
      this.leftThrow.x = this.leftPlayer.x;
      this.leftThrow.y = this.leftPlayer.y;
      this.leftThrow.visible = false;
    }

    // 화면 밖으로 나가면 투사체 초기화 Right
    if (
      this.rightThrow.y > 600 ||
      // this.rightThrow.y < 0 ||
      this.rightThrow.x > 1700 ||
      this.rightThrow.x < 0
    ) {
      this.rightThrow.setGravity(0);
      this.rightThrowLaunched = false;
      this.rightThrow.body.stop();
      this.rightThrow.x = this.rightPlayer.x;
      this.rightThrow.y = this.rightPlayer.y;
      this.rightThrow.visible = false;
    }

  }


  // Right Hitted
  rightPlayerHitted() {
    this.rightPlayer.anims.play('hurt', true)
    this.leftThrow.setGravity(0);
    this.leftThrowLaunched = false;
    this.leftThrow.body.stop();
    this.leftThrow.x = this.leftPlayer.x;
    this.leftThrow.y = this.leftPlayer.y;
    this.leftThrow.visible = false;

    // console.log("rightPlayer Hit");
    // alert("Player 2 Hit !");
  }
  // left Hitted
  leftPlayerHitted() {
    this.leftPlayer.anims.play('hurt', true)
    this.rightThrow.setGravity(0);
    this.rightThrowLaunched = false;
    this.rightThrow.body.stop();
    this.rightThrow.x = this.rightPlayer.x;
    this.rightThrow.y = this.rightPlayer.y;
    this.rightThrow.visible = false;

    // Left Player Life Count
    this.leftPlayerLife -= 1;
    // this.leftPlayerHealthBar.anims.play('redHealthBar', true);
    // this.leftPlayerHealthBar.anims.stop('redHealthBar', true);

    if (this.leftPlayerLife == 2) {
      this.leftPlayerHealthBar.anims.play('redHealthBar2', true);
      console.log(this.leftPlayerLife);
    }
    else if (this.leftPlayerLife == 1) {
      this.leftPlayerHealthBar.anims.play('redHealthBar1', true);
      console.log(this.leftPlayerLife);
    }
    else if (this.leftPlayerLife == 0) {
      this.leftPlayerHealthBar.anims.play('redHealthBar0', true);
      this.
      console.log(this.leftPlayerLife);
      this.rightPlayerWin();
    }
  }

  // Left Player 승리 시 호출
  leftPlayerWin() {
    setTimeout(function() {
      alert("Left Player Win !!!");
    }, 2000);
  }

  // Right Player 승리 시 호출
  rightPlayerWin() {
    setTimeout(function() {
      alert("Right Player Win !!!");
    }, 2000);
  }
}

