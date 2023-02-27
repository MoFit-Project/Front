import "phaser";
import { useEffect } from "react";
export default class Main extends Phaser.Scene {
  leftPlayer;
  leftThrow;
  leftThrowAngle = -45;
  leftThrowLaunched = false;
  leftGuildLine;


  rightPlayer;
  rightThrow;
  rightThrowAngle = -135;
  rightThrowLaunched = false;
  rightGuildLine;


  attackSpeed = 1000;

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
    //가이드라인 삽입
    this.load.image('guildLine', 'assets/dot_line.png')
  }








  create() {

    // 캐릭터 설정
    // 캐릭터 설정 Left
    this.leftPlayer = this.physics.add
      .sprite(300, 500, "knight")
      .setScale(3);
    this.leftPlayer.setOffset(14, 60).setBodySize(45, 50, false);

    // 캐릭터 설정 Right
    this.rightPlayer = this.physics.add
      .sprite(1500, 500, "knight")
      .setScale(3)
      .toggleFlipX();
    this.rightPlayer.setOffset(69, 60).setBodySize(45, 50, false);
    // this.rightPlayer.setGravity(0, -200);



    // 애니메이션 설정 (걷기)
    // attack 애니메이션이 끝나고 실행 할 애니메이션  play 인자가 true라면 무한반복됨 

    // 애니메이션 Left
    this.leftPlayer.on("animationcomplete-attackAct", () => {
      this.leftPlayer.anims.play("walk", true);
    });

    // 애니메이션 Right
    this.rightPlayer.on("animationcomplete-attackAct", () => {
      this.rightPlayer.anims.play("walk", true);
    });


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
    
    // 콘솔키 설정
    this.cursors = this.input.keyboard.createCursorKeys();
  }





  update() {
    // this.physics.add.collider(this.rightPlayer, this.leftThrow, this.rightPlayerHit, null, this);
    // this.rightPlayer.velocity = 0;
    // 가이드 라인 리프레시
    this.leftGuildLine.angle = this.leftThrowAngle;
    this.rightGuildLine.angle = this.rightThrowAngle;



    // 각도 조절 Left
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.leftThrowAngle -= 5;
      if (this.leftThrowAngle < -90) {
        this.leftThrowAngle = -90;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.leftThrowAngle += 5;
      if (this.leftThrowAngle > 0) {
        this.leftThrowAngle = 0;
      }
    }

    // 각도 조절 Right
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.rightThrowAngle -= 5;
      if (this.rightThrowAngle < -180) {
        this.rightThrowAngle = -180;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.rightThrowAngle += 5;
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
    this.rightThrow.setGravity(0);
    this.rightThrowLaunched = false;
    this.rightThrow.body.stop();
    this.rightThrow.x = this.rightPlayer.x;
    this.rightThrow.y = this.rightPlayer.y;
    this.rightThrow.visible = false;
  }

}

