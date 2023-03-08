import "phaser";
import { singleGameMovenetInput } from "../SingleWebcam";
// let singleGameMovenetInput;
export default class Main3 extends Phaser.Scene {
    player;
    runCount = 0;
    dust;
    inputCount = [];
    bg;
    state = 10;
    human;
    isPhaserHasStarted = false;
    inputState = false;
    gameState = 5;
    bubble_human;
    bubble_dog;
    heart;
    number;
    countdown = 5;
    stageCount = 6;
    playerNumber10000;
    playerNumber1000;
    playerNumber100;
    playerNumberDot;
    playerNumber10;
    playerNumber1;
    bee;
    start;
    recordTime = 0;
    text_human;
    dogHouse;
    singleGameMovenetInputTempSave = 0;
    startTime = 0;
    exerciseText;
    stage2Exercise = 10;
    stage3Exercise = 20;
    saveStartTime = false;
    jumpingJack;
    run;
    squat;
    singleBGM;
    ding;
    diriring;
    goodText;

    constructor() {
        super();
    }

    preload() {
        const randomNumber = Math.random();
        let character;
        if (randomNumber < 0.25) {
            character = 'cat1.png'
        } else if (randomNumber < 0.5) {
            character = 'cat2.png'
        } else if (randomNumber < 0.75) {
            character = 'dog1.png'
        } else {
            character = 'dog2.png'

        }
        this.load.spritesheet(
            "player",
            `../assets/singlegame/${character}`,
            {frameWidth: 48, frameHeight: 48}
        )
        this.load.spritesheet(
            "dust",
            '../assets/singlegame/dust.png',
            {frameWidth: 48, frameHeight: 48}
        )
        this.load.spritesheet(
            "jumpingJack",
            '../assets/singlegame/jumpingJack.png',
            {frameWidth: 354, frameHeight: 354}
        )
        this.load.spritesheet(
            "run",
            '../assets/singlegame/run.png',
            {frameWidth: 370, frameHeight: 370}
        )
        this.load.spritesheet(
            "squat",
            '../assets/singlegame/squat.png',
            {frameWidth: 350, frameHeight: 350}
        )
        this.load.image('bg', '../assets/singlegame/singleBg.png')
        this.load.image('human', '../assets/singlegame/human.png')
        this.load.image('bubble', '../assets/singlegame/bubble.png')
        this.load.image('dogHouse', '../assets/singlegame/dogHouse.png')
        this.load.image('heart', '../assets/singlegame/heart.png')

        //배경
        this.load.image('1', '../assets/singlegame/bg/1.png')
        this.load.image('2', '../assets/singlegame/bg/2.png')
        this.load.image('3', '../assets/singlegame/bg/3.png')
        this.load.image('4', '../assets/singlegame/bg/4.png')


        this.load.spritesheet(
            "numbers",
            '../assets/numbers.png',
            {frameWidth: 130, frameHeight: 150}
        )


        this.load.audio('bee', ['../assets/sound/bee.mp3'])
        this.load.audio('start', ['../assets/sound/start.mp3'])
        this.load.audio('singleBGM', ['../assets/sound/singleBGM.mp3'])
        this.load.audio('ding', ['../assets/sound/ding.mp3'])
        this.load.audio('diriring', ['../assets/sound/diriring.mp3'])


    }

    create() {
        this.bee = this.sound.add('bee').setVolume(5);
        this.start = this.sound.add('start').setVolume(10);
        this.ding = this.sound.add('ding').setVolume(5);
        this.diriring = this.sound.add('diriring').setVolume(5);

        this.bg = this.add.image(700, 0, 'bg').setOrigin(0, 0).setScale(1.55, 2).setDepth(1)

        // 배경 삽입
        this.sky = this.add.tileSprite(930, 50, 1320, 1080, '1')
            .setOrigin(0, 0)
            .setScale(0.55, 0.55)

        this.human = this.physics.add.image(1500, 590, 'human')
            .setOrigin(0.5, 1)
            .setScale(1)
            .setAlpha(0)
        this.bubble_human = this.add.image(1330, 280, 'bubble')
            .setOrigin(0.5, 0.5)
            .setScale(0.5)
            .toggleFlipX()
            .setVisible(false)
        this.bubble_dog = this.add.image(1280, 300, 'bubble')
            .setOrigin(0.5, 0.5)
            .setScale(0.5)
            .setVisible(false)
        this.heart = this.add.image(1280, 270, 'heart')
            .setOrigin(0.5, 0.5)
            .setScale(0.15)
            .setVisible(false)
        this.player = this.physics.add.sprite(1150, 580, 'player')
            .setOrigin(0.5, 1)
            .setScale(6);
        this.dust = this.add.sprite(this.player.x, this.player.y, 'dust')
            .setOrigin(0.5, 1)
            .setScale(6)
            .setVisible(false);
        this.jumpingJack = this.add.sprite(850, 850, 'jumpingJack')
            .setOrigin(0.5, 0.5)
            .setScale(0.9)
            .setVisible(false);
        this.squat = this.add.sprite(850, 850, 'squat')
            .setOrigin(0.5, 0.5)
            .setScale(1)
            .setVisible(false);
        this.run = this.add.sprite(850, 850, 'run')
            .setOrigin(0.5, 0.5)
            .setScale(0.9)
            .setVisible(false);

        this.anims.create({
            key: 'player_run',
            frames: this.anims.generateFrameNumbers('player', {start: 6, end: 11}),
            frameRate: 5,
            repeat: 0,
        });
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 10,
            repeat: 0,
        });
        this.anims.create({
            key: 'player_dust',
            frames: this.anims.generateFrameNumbers('dust', {start: 0, end: 5}),
            frameRate: 5,
            repeat: 0,
        });
        this.anims.create({
            key: 'runGuide',
            frames: this.anims.generateFrameNumbers('run', {start: 0, end: 6}),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({
            key: 'jumpingJackGuide',
            frames: this.anims.generateFrameNumbers('jumpingJack', {start: 0, end: 3}),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'squatGuide',
            frames: this.anims.generateFrameNumbers('squat', {start: 0, end: 1}),
            frameRate: 2,
            repeat: -1,
        });

        this.singleBGM = this.sound.add('singleBGM');

        this.number = this.add.sprite(1300, 350, 'numbers').setVisible(false).setDepth(1);
        this.playerNumber10 = this.add.sprite(1600, 120, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumberDot = this.add.sprite(this.playerNumber10.x - 57, this.playerNumber10.y + 40, 'numbers').setScale(0.2).setOrigin(0.5, 0.5).setTint(0x000000);
        this.playerNumber100 = this.add.sprite(this.playerNumber10.x - 120, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumber1000 = this.add.sprite(this.playerNumber10.x - 210, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumber10000 = this.add.sprite(this.playerNumber10.x - 300, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.text_human = this.add.text(1340, 250, "스쿼트!",
            {color: "#000000", fontSize: "50px", fontFamily: 'dalmoori'})
            .setDepth(1)
            .setOrigin(0.5, 0.5)
            .setVisible(false)
        this.dogHouse = this.add.image(1500, 500, 'dogHouse')
            .setOrigin(0.5, 0.5)
            .setScale(0.6)
            .toggleFlipX()
            .setAlpha(0)
        // 텍스트
        this.exerciseText = this.add.text(1360, 850, "스쿼트 X 10",
            {color: "#000000", fontSize: "130px", fontFamily: 'dalmoori'})
            .setDepth(1)
            .setOrigin(0.5, 0.5)
            .setVisible(false);

        this.goodText = this.add.text(1300, 350, "GOOD!",
            {color: "#0000FF", fontSize: "120px", fontFamily: 'dalmoori'})
            .setDepth(1)
            .setOrigin(0.5, 0.5)
            .setVisible(false);


        this.jumpingJack.anims.play('jumpingJackGuide')
        this.squat.anims.play('squatGuide')
        this.run.anims.play('runGuide')

        // 변수 내보내기
        localStorage.setItem("recordTime", JSON.stringify(0));

    }


    update(time, delta) {
        const cursors = this.input.keyboard.createCursorKeys();

        if(!this.saveStartTime && this.state === 1){
            this.startTime = time;
            this.saveStartTime = true;
        }
        // this.singleGameMovenetInputTempSave != singleGameMovenetInput
        // cursors.space.isDown
        if (this.singleGameMovenetInputTempSave != singleGameMovenetInput && this.gameState > 0) {
            this.singleGameMovenetInputTempSave = singleGameMovenetInput;
            if (this.gameState === 1) {
                this.inputCount.push(time);
            } else if (this.gameState === 5 && !this.isPhaserHasStarted) {
                this.isPhaserHasStarted = true;
                this.singleBGM.play();
                this.exerciseText.setText('준비하세요.').setVisible(true);
                this.countDown.call(this)


            } else if (this.gameState === 2) {
                this.stageCount = 6;
                this.stage2Exercise -= 1
                this.exerciseText.setText(`스쿼트! X ${this.stage2Exercise}`)
                if(this.stage2Exercise < 1) {
                    this.diriring.play();
                    this.goodText.setVisible(true)
                    this.tweens.add({
                        targets: this.goodText,
                        duration: 1500,
                        scale : 3,// 애니메이션 지속 시간
                        alpha : 0,
                        repeat: 0,
                        // onComplete:,
                    });
                    this.squat.setVisible(false);
                    this.state = 3
                    this.gameState = 1
                    this.run.setVisible(true);
                    this.exerciseText.setText('제자리 달리기!')
                    this.sky.setTexture(`${this.state}`)
                    this.human.setAlpha(0);
                }
            }else if (this.gameState === 3) {
                this.stageCount = 6;
                this.stage3Exercise -= 1
                this.exerciseText.setText(`점핑잭! X ${this.stage3Exercise}`)
                if(this.stage3Exercise < 1) {
                    this.diriring.play();
                    this.goodText.setVisible(true)
                    this.tweens.add({
                        targets: this.goodText,
                        duration: 1500,
                        scale : 3,// 애니메이션 지속 시간
                        alpha : 0,
                        repeat: 0,
                        // onComplete:,
                    });
                    this.jumpingJack.setVisible(false);
                    this.state = 4
                    this.gameState = 1
                    this.run.setVisible(true);
                    this.exerciseText.setText('제자리 달리기!')
                    this.sky.setTexture(`${this.state}`)
                    this.human.setAlpha(0);
                }
            }
        }


        let speed = this.inputCount.length;


        if (speed > 0) {
        } else {
        }
        if (speed > 0) {
            if (this.inputCount[0] + 3000 < time) {
                this.inputCount.shift();
            }
            if (speed > 5) {
                this.dust.visible = true;
            } else {
                this.dust.visible = false;
            }
            this.runCount += speed;
            this.anims.get('player_dust').frameRate = 10 + (speed * 4)
            this.anims.get('player_run').frameRate = 10 + (speed * 4)

            this.player.anims.play('player_run', true)
            this.dust.anims.play('player_dust', true)
            this.sky.tilePositionX += speed * 3


        } else {

            this.player.anims.play('player_idle', true)
        }
        if (this.startTime > 0) {
            this.recordTime = time - this.startTime
        }
        this.playerNumber10000.setFrame(Math.floor((this.recordTime % 1000000) / 100000))
        this.playerNumber1000.setFrame(Math.floor((this.recordTime % 100000) / 10000))
        this.playerNumber100.setFrame(Math.floor((this.recordTime % 10000) / 1000))
        this.playerNumber10.setFrame(Math.floor((this.recordTime % 1000) / 100))

        // 스테이지 변경
        if (this.state === 1 && this.runCount > 3000) {
            this.state += 1
            this.runCount = 0
            this.sky.setTexture(`${this.state}`)

        } else if (this.state === 2 && this.runCount > 2000) {
            this.gameState = 0;
            this.runCount = 0;
            this.inputCount = [];
            this.dust.visible = false;
            this.ding.play()
            this.mission()
            this.stageCountDown.call(this)
            this.run.setVisible(false);
            this.squat.setVisible(true);
            this.exerciseText.setText('스쿼트 준비!').setVisible(true);



        } else if (this.state === 3 && this.runCount > 2000) {
            this.goodText.setVisible(false).setAlpha(1).setScale(1);
            this.gameState = 0;
            this.runCount = 0;
            this.inputCount = [];
            this.dust.visible = false;
            this.ding.play()
            this.mission()
            this.stageCountDown.call(this)
            this.run.setVisible(false);
            this.jumpingJack.setVisible(true);
            this.exerciseText.setText('점핑잭 준비!').setVisible(true);


        }else if (this.state === 4 && this.runCount > 2000) {
            localStorage.setItem("recordTime", JSON.stringify(this.recordTime));
            this.startTime = -1
            this.gameState = 0;
            this.runCount = 0;
            this.inputCount = [];
            this.dust.visible = false;
            this.tweens.add({
                targets: this.dogHouse,
                duration: 500, // 애니메이션 지속 시간
                alpha: 1,
                repeat: 0,
                onComplete: this.gameEnds()
            });
            this.run.setVisible(false);
            this.exerciseText.setVisible(false)


        }


        localStorage.setItem("gameState", JSON.stringify(this.gameState));


    }

    mission() {
        this.tweens.add({
            targets: this.human,
            duration: 300, // 애니메이션 지속 시간
            alpha: 1,
            repeat: 0,
        });

    }


    countDown() {
        if (this.countdown === 0) {
            this.start.play();
            this.number.visible = false;
            this.number.destroy();
            this.state = 1;
            this.gameState = 1;
            this.run.setVisible(true);
            this.exerciseText.setText('제자리 달리기!').setVisible(true);

            return;
        }
        this.bee.play();
        this.number.destroy();
        this.number = this.add.sprite(1300, 350, 'numbers').setFrame(this.countdown);
        this.tweens.add({
            targets: this.number,
            duration: 1000, // 애니메이션 지속 시간
            scale: 2, // X축으로 2배 키우기
            repeat: 0,

        });
        this.countdown--;

        this.time.delayedCall(1000, this.countDown, [], this);
    }

    gameEnds() {
        this.bubble_dog.visible = true;
        this.heart.visible = true;
    }

    stageCountDown() {
        if (this.stageCount === 0) {
            this.exerciseText.visible = true;
            if (this.state === 2) {
                this.exerciseText.setText(`스쿼트 X ${this.stage2Exercise}`)
            } else if (this.state === 3) {
                this.exerciseText.setText(`점핑잭 X ${this.stage3Exercise}`)
            }
            this.bubble_human.setVisible(false);
            this.text_human.visible = false;
            this.gameState = this.state;
            return;
        }
        if (this.stageCount === 6) {
            this.text_human.visible = false;
            this.bubble_human.setVisible(true);
            this.stageCount--;

        }
        if (this.stageCount < 6) {
            this.text_human.visible = true;

            this.text_human.setText(`${this.stageCount}`)
            this.stageCount--;
        }
        this.time.delayedCall(1000, this.stageCountDown, [], this);
    }
}