import "phaser";
import { isLeftPlayerThrow, isLeftPlayerMoveGuildLine, isRightPlayerThrow, isRightPlayerMoveGuildLine } from "../openvidu/OpenviduComponent";


export default class Main extends Phaser.Scene {
  leftPlayer;
  leftThrow;
  leftThrowAngle = -45;
  leftThrowLaunched = false;
  leftGuildLine;
  leftAngleLine;

  leftDead;
  leftPlayerHealthBar;
  leftPlayerLife = 3;
  leftPlayerAngleChange = 5;

  rightPlayer;
  rightThrow;
  rightThrowAngle = -135;
  rightThrowLaunched = false;
  rightGuildLine;
  rightAngleLine;

  rightDead;
  rightPlayerHealthBar;
  rightPlayerLife = 3;
  rightPlayerAngleChange = -5;



  attackSpeed = 1000;

  // 배경화면 설정
  bg;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  windBlowLeftToRight;
  windBlowRightToLeft;


  windSpeed = 0;
  windTimeAgain = -1;
  windGuide;
  windText;
  damageEffectOnLeft;
  damageEffectOnRight;

  //items
  itemCreate = -1;
  leftPlayerShield;
  rightPlayerShield;
  leftPlayerWindDisable;
  rightPlayerWindDisable;
  shieldItem;
  windDisableItem;

  constructor() {
    super();
  }





  preload() {
    // 스프라이트 삽입
    // 시트이름, 시트경로, {frameWidth: 각 프레임의 가로길이, frameHeight : 세로길이}, 프레임개수
    this.load.spritesheet(
      "knight",
      "../assets/knight.png",
      { frameWidth: 128, frameHeight: 128 },
      33
    );
    //캐릭터 죽음
    this.load.spritesheet(
        "knightDead",
        "../assets/knight_dead.png",
        { frameWidth: 256, frameHeight: 256 },
        10
    );

    // 투사체 추가
    this.load.spritesheet(
      "throwAttack",
      "../assets/sword_attack.png",
      { frameWidth: 128, frameHeight: 128 },
      18
    );
    //가이드라인 삽입
    this.load.image('guildLine', '../assets/dot_line.png')
    this.load.image('angleLine', '../assets/angleLine.png')

    //배경화면
    this.load.image('backGround','../assets/backgroundDungeon.png')

    // 체력 바
    this.load.spritesheet(
      "redHealthBar",
      "../assets/healthbar/Redbar/redHealthBar.png",
      { frameWidth: 1406, frameHeight: 294 },
      18
    );

    // 바람 추가
    this.load.spritesheet(
        "wind",
        "../assets/wind.png",
        { frameWidth: 512, frameHeight: 32 },
        4
    );

    // 바람 화살표 추가
    this.load.image('windGuide','../assets/arrow.png')

    //데미지 이펙트 추가
    this.load.spritesheet(
        "damageEffect",
        "../assets/damage.png",
        { frameWidth: 458, frameHeight: 423 },
        25
    );

    // 아이템 아이콘
    this.load.image('shieldItem','../assets/items/shieldIcon.png')
    this.load.image('windDisableItem','../assets/items/windDisable.png')

    // 아이템 사용
    this.load.image('shield','../assets/items/shield.png')
    this.load.image('windDisable','../assets/items/windDisableUse.png')



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
    this.leftAngleLine = this.add.image(this.leftPlayer.x, this.leftPlayer.y, 'angleLine').setOrigin(0, 1).setScale(0.3)
    this.leftGuildLine = this.add.image(this.leftPlayer.x, this.leftPlayer.y, 'guildLine').setOrigin(0, 0.5).setScale(0.3)
    // 가이드 선 right
    this.rightAngleLine = this.add.image(this.rightPlayer.x, this.rightPlayer.y, 'angleLine').setOrigin(1, 1).setScale(0.3).toggleFlipX();
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
    if (this.leftPlayer && this.leftPlayer.duration) {
      this.leftPlayer.play("walk", true);
    }
    // 애니메이션 Right
    this.rightPlayer.on("animationcomplete", () => {
      this.rightPlayer.anims.play("walk", true);
    });
    if (this.rightPlayer && this.rightPlayer.duration) {
      this.rightPlayer.play("walk", true);
    }
    // 콘솔키 설정
    this.cursors = this.input.keyboard.createCursorKeys();


    // 캐릭터 health bar 설정 Left
    this.leftPlayerHealthBar = this.add
      .sprite(this.leftPlayer.x + 100, this.leftPlayer.y - 300, "redHealthBar")
      .setScale(0.5)
      .setOrigin(0.5, 0.5);
    // this.leftPlayerHealthBar.setSize(10, 10);
    // 캐릭터 health bar 설정 Right
    this.rightPlayerHealthBar = this.add
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
  //바람 만들기
    this.windBlowLeftToRight = this.add
        .sprite((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y, "wind" )
        .setScale(5)
        .setOrigin(0.5, 0.5)
    this.windBlowLeftToRight.visible = false;

    this.windBlowRightToLeft = this.add
        .sprite((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y, "wind" )
        .setScale(5)
        .setOrigin(0.5, 0.5)
        .toggleFlipX()
    this.windBlowRightToLeft.visible = false;
    this.anims.create({
      key: "windBlow", //액션이름
      frames: this.anims.generateFrameNumbers("wind", { start: 0, end: 3 }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 10, // 초당 프레임 개수
      repeat: 3, // 0 : 한번만 반복
    });

    //바람 화살표
    this.windGuide = this.add.image((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y-300,'windGuide')
        .setScale(0.5)
        .setOrigin(0.5, 0.5);

    this.windText = this.add
        .text((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y-200,
            '',
            { color: '#00acdc',fontSize : '48px'})
        .setOrigin(0.5,0.5);

    //데미지 이펙트
    this.damageEffectOnRight = this.add
        .sprite((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y, "damageEffect" )
        .setScale(0.5)
        .setOrigin(0.5, 0.5);
    this.damageEffectOnRight.visible = false;
    this.damageEffectOnLeft = this.add
        .sprite((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y, "damageEffect" )
        .setScale(0.5)
        .setOrigin(0.5, 0.5);
    this.damageEffectOnLeft.visible = false;
    this.anims.create({
      key: "damageEffectAct", //액션이름
      frames: this.anims.generateFrameNumbers("damageEffect", { start: 0, end: 24 }), //프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 30, // 초당 프레임 개수
      repeat: 0, // 0 : 한번만 반복
    });


    // 아이템 아이콘
    this.shieldItem = this.physics.add.image((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y-300,'shieldItem')
        .setScale(1)
        .setOrigin(0.5, 0.5);
    this.shieldItem.visible = false;

    this.windDisableItem = this.physics.add.image((this.leftPlayer.x +this.rightPlayer.x)/2, this.rightPlayer.y-300,'windDisableItem')
        .setScale(1)
        .setOrigin(0.5, 0.5);
    this.windDisableItem.visible = false;

    //아이템 습득 시
    this.leftPlayerShield = this.add.image(this.leftPlayer.x, this.rightPlayer.y,'shield')
        .setScale(5)
        .setOrigin(0.5, 0.5);
    this.leftPlayerShield.alpha = 0.3;
    this.leftPlayerShield.visible = false;

    this.rightPlayerShield = this.add.image(this.rightPlayer.x, this.rightPlayer.y,'shield')
        .setScale(5)
        .setOrigin(0.5, 0.5);
    this.rightPlayerShield.alpha = 0.3;
    this.rightPlayerShield.visible = false;

    this.leftPlayerWindDisable = this.add.image(this.leftPlayer.x, this.leftPlayer.y-100,'windDisable')
        .setScale(0.3)
        .setOrigin(0.5, 0.5);
    this.leftPlayerWindDisable.visible = false;

    this.rightPlayerWindDisable = this.add.image(this.rightPlayer.x, this.leftPlayer.y-100,'windDisable')
        .setScale(0.3)
        .setOrigin(0.5, 0.5);
    this.rightPlayerWindDisable.visible = false;

    // 아이템 습득
    this.physics.add.overlap(
        this.rightThrow,
        this.shieldItem,
        this.rightPlayerGetShieldItem,
        null,
        this
    );
    this.physics.add.overlap(
        this.leftThrow,
        this.shieldItem,
        this.leftPlayerGetShieldItem,
        null,
        this
    );
    this.physics.add.overlap(
        this.rightThrow,
        this.windDisableItem,
        this.rightPlayerGetWindDisableItem,
        null,
        this
    );
    this.physics.add.overlap(
        this.leftThrow,
        this.windDisableItem,
        this.leftPlayerGetWindDisableItem,
        null,
        this
    );

  }





  update() {
    // this.physics.add.collider(this.rightPlayer, this.leftThrow, this.rightPlayerHit, null, this);
    // this.rightPlayer.velocity = 0;
    // 가이드 라인 리프레시
    this.leftGuildLine.angle = this.leftThrowAngle;
    this.rightGuildLine.angle = this.rightThrowAngle;
    this.windTimeAgain -= 1
    this.itemCreate -= 1

    //아이템 생성
    if (this.itemCreate < 0) {

      this.itemCreate = (Math.floor(Math.random()*(4-1))+1)*60
      if (!this.shieldItem.visible && !this.windDisableItem.visible) {
        const randomItem = Math.floor(Math.floor(Math.random() * (3 - 1)) + 1)
        if (randomItem === 1) {
          this.shieldItem.x = (this.leftPlayer.x + this.rightPlayer.x) / 2;
          this.shieldItem.y = this.rightPlayer.y - 300;
          this.shieldItem.visible = true;

        } else {
          this.windDisableItem.x = (this.leftPlayer.x + this.rightPlayer.x) / 2;
          this.windDisableItem.y = this.rightPlayer.y - 300;
          this.windDisableItem.visible = true;

        }
      }
    }
    //아이템 삭제
    if (this.windDisableItem.y > 1000){
      this.windDisableItem.visible = false;
    }else{
      this.windDisableItem.y += 1
    }
    if (this.shieldItem.y > 1000){
      this.shieldItem.visible = false;
    }else {
      this.shieldItem.y += 1
    }
    //바람 생성
    if (this.windTimeAgain > 0) {

      this.windTimeAgain = (Math.floor(Math.random()*(4-1))+1)*600
      this.windSpeed = Math.floor((Math.floor(Math.random() * (6 - 1)) + 1) * (Math.random() - 0.5) * 200)
      while (this.windSpeed === 0) {
        this.windSpeed = Math.floor((Math.floor(Math.random() * (6 - 1)) + 1) * (Math.random() - 0.5) * 200)
      }
      console.log(this.windSpeed)
      if(this.windSpeed > 0) {
        this.windBlowLeftToRight.visible = true;
        this.windBlowLeftToRight.anims.play('windBlow', true);
        // if(this.windBlowLeftToRight && this.windBlowLeftToRight.duration) {
        this.windBlowLeftToRight.on("animationcomplete", () => {
          this.windBlowLeftToRight.visible = false;
        });

      } else{
        this.windBlowRightToLeft.visible = true;
        this.windBlowRightToLeft.anims.play('windBlow', true);
        // if(this.windBlowRightToLeft && this.windBlowLeftToRight.duration) {
        this.windBlowRightToLeft.on("animationcomplete", () => {
        this.windBlowRightToLeft.visible = false;
        });
      }
    }
    if (this.windSpeed > 0) {
      this.windGuide.angle = 0;
    } else this.windGuide.angle = -180;
    let windNotice = this.windSpeed
    this.windText.text = `${Math.abs(windNotice)}m`

    // 각도 조절 Left
    if (this.cursors.up.isDown || isLeftPlayerMoveGuildLine === true) {
      this.leftPlayer.anims.play("run", true);
      this.leftThrowAngle -= this.leftPlayerAngleChange;
      if (this.leftThrowAngle <= -90 || this.leftThrowAngle >= 0) {
        this.leftPlayerAngleChange *= -1
      }
    }

    // 각도 조절 Right
    if (this.cursors.left.isDown || isRightPlayerMoveGuildLine === true) {
      this.rightPlayer.anims.play("run", true);
      this.rightThrowAngle -= this.rightPlayerAngleChange;
      if (this.rightThrowAngle <= -180 || this.rightThrowAngle >= -90) {
        this.rightPlayerAngleChange *= -1
      }
    }




    // 스페이스바가 눌린 경우 투사체를 발사합니다.
    // 투사체 발사, 공격모션 Left
    if (
      (Phaser.Input.Keyboard.JustDown(this.cursors.space) || isLeftPlayerThrow === true) &&
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
      if (this.leftPlayerWindDisable.visible === false) {
        this.leftThrow.body.velocity.x += this.windSpeed
      }
      this.leftThrow.setGravity(0, 830);
      // this.leftThrow.body.velocity.x += -200;
      // console.log(this.leftThrowAngle, this.attackSpeed);
    }

    // 투사체 발사, 공격모션 right
    if (
      (Phaser.Input.Keyboard.JustDown(this.cursors.shift) || isRightPlayerThrow === true) &&
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
      if (this.rightPlayerWindDisable.visible === false){
      this.rightThrow.body.velocity.x += this.windSpeed}
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

    this.damageEffectOnRight.x = this.leftThrow.x;
    this.damageEffectOnRight.y = this.leftThrow.y;
    this.damageEffectOnRight.visible = true;
    this.damageEffectOnRight.play('damageEffectAct')
    // if(this.windBlowRightToLeft && this.windBlowLeftToRight.duration) {
    this.damageEffectOnRight.on("animationcomplete", () => {
      this.damageEffectOnRight.visible = false;
    });

    this.leftThrow.setGravity(0);
    this.leftThrowLaunched = false;
    this.leftThrow.body.stop();
    this.leftThrow.x = this.leftPlayer.x;
    this.leftThrow.y = this.leftPlayer.y;
    this.leftThrow.visible = false;
    if (this.rightPlayerShield.visible === true){
      this.rightPlayerShield.visible = false;
    } else{
      this.rightPlayerLife -= 1;
      this.rightPlayer.anims.play('hurt', true)
    }


    if (this.rightPlayerLife === 2) {
      this.rightPlayerHealthBar.anims.play('redHealthBar2', true);
      console.log("Right Player : " + this.rightPlayerLife);
    }
    else if (this.rightPlayerLife === 1) {
      this.rightPlayerHealthBar.anims.play('redHealthBar1', true);
      console.log(this.rightPlayerLife);
    }
    else if (this.rightPlayerLife <= 0) {
      this.rightPlayerHealthBar.anims.play('redHealthBar0', true);
      console.log(this.rightPlayerLife);
      this.leftPlayerWin();
    }
  }
  // left Hitted
  leftPlayerHitted() {
    this.damageEffectOnLeft.x = this.rightThrow.x;
    this.damageEffectOnLeft.y = this.rightThrow.y;
    this.damageEffectOnLeft.visible = true;
    this.damageEffectOnLeft.play('damageEffectAct')
    // if(this.windBlowRightToLeft && this.windBlowLeftToRight.duration) {
    this.damageEffectOnLeft.on("animationcomplete", () => {
      this.damageEffectOnLeft.visible = false;
    });
    this.rightThrow.setGravity(0);
    this.rightThrowLaunched = false;
    this.rightThrow.body.stop();
    this.rightThrow.x = this.rightPlayer.x;
    this.rightThrow.y = this.rightPlayer.y;
    this.rightThrow.visible = false;

    // Left Player Life Count
    if(this.leftPlayerShield.visible === true){
      this.leftPlayerShield.visible = false;
    } else {
      this.leftPlayerLife -= 1;
      this.leftPlayer.anims.play('hurt', true)
    }

    if (this.leftPlayerLife === 2) {
      this.leftPlayerHealthBar.anims.play('redHealthBar2', true);
      console.log(this.leftPlayerLife);
    }
    else if (this.leftPlayerLife === 1) {
      this.leftPlayerHealthBar.anims.play('redHealthBar1', true);
      console.log(this.leftPlayerLife);
    }
    else if (this.leftPlayerLife <= 0) {
      this.leftPlayerHealthBar.anims.play('redHealthBar0', true);
      console.log(this.leftPlayerLife);
      this.rightPlayerWin();
    }
  }
  // 아이템 함수들
  rightPlayerGetShieldItem (){
    // 오른 플레이어 쉴드 아이템 습득
    if (this.shieldItem.visible === true) {
      this.shieldItem.visible = false;
      this.rightPlayerShield.visible = true;
    }


  }
  leftPlayerGetShieldItem (){
    // 오른 플레이어 쉴드 아이템 습득
    if (this.shieldItem.visible === true) {
      this.shieldItem.visible = false;
      this.leftPlayerShield.visible = true;
    }


  }
  leftPlayerGetWindDisableItem(){
    if (this.windDisableItem.visible === true) {
      this.windDisableItem.visible = false;
      this.leftPlayerWindDisable.visible = true;
    }

  }
  rightPlayerGetWindDisableItem(){
    if (this.windDisableItem.visible === true) {
      this.windDisableItem.visible = false;
      this.rightPlayerWindDisable.visible = true;
    }
  }

  // Left Player 승리 시 호출
  leftPlayerWin() {
    setTimeout(function() {
      alert("Left Player Win !!!");
    }, 1000);
  }

  // Right Player 승리 시 호출
  rightPlayerWin() {
    setTimeout(function() {
      alert("Right Player Win !!!");
    }, 1000);
  }
}

