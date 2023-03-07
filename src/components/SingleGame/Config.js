import "phaser";
import {useEffect} from "react";
import {heSquart2} from "@/components/openvidu/OpenviduComponent2";

export default class Main3 extends Phaser.Scene {
    player;
    runCount = 0;
    dust;
    inputTime = 0;
    inputCount = [];
    bg;
    state = 1;
    human;
    mode = 'run';
    gameState = 1000;
    bubble_human;
    number;
    countdown = 5;
    playerNumber10000;
    playerNumber1000;
    playerNumber100;
    playerNumberDot;
    playerNumber10;
    playerNumber1;
    bee;
    start;

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
        this.load.image('bg', '../assets/singlegame/singleBg.png')
        this.load.image('human', '../assets/singlegame/human.png')
        this.load.image('bubble', '../assets/singlegame/bubble.png')

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


    }

    create() {
        this.bee = this.sound.add('bee');
        this.start = this.sound.add('start');

        this.bg = this.add.image(700, 0, 'bg').setOrigin(0, 0).setScale(1.55, 2).setDepth(1)

        // 배경 삽입
        this.sky = this.add.tileSprite(930, 50, 1320, 1080, '1')
            .setOrigin(0, 0)
            .setScale(0.55, 0.55)

        this.human = this.physics.add.image(1500, 590, 'human')
            .setOrigin(0.5, 1)
            .setScale(1)
            .setAlpha(1)
        this.bubble_human = this.add.image(1330, 280, 'bubble')
            .setOrigin(0.5, 0.5)
            .setScale(0.5)
            .toggleFlipX()
            .setVisible(false);
        this.player = this.physics.add.sprite(1150, 580, 'player')
            .setOrigin(0.5, 1)
            .setScale(6);
        this.dust = this.add.sprite(this.player.x, this.player.y, 'dust')
            .setOrigin(0.5, 1)
            .setScale(6)
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


        this.number = this.add.sprite(200, 200, 'numbers').setVisible(false).setDepth(1);
        this.playerNumber10 = this.add.sprite(1510, 120, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumberDot = this.add.sprite(this.playerNumber10.x -57, this.playerNumber10.y+40, 'numbers').setScale(0.2).setOrigin(0.5, 0.5).setTint(0x000000);
        this.playerNumber100 = this.add.sprite(this.playerNumber10.x - 120, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumber1000 = this.add.sprite(this.playerNumber10.x - 210, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumber1 = this.add.sprite(this.playerNumber10.x + 90, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.playerNumber10000 = this.add.sprite(this.playerNumber10.x - 300, this.playerNumber10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);


        // 변수 내보내기
        localStorage.setItem("gameState", JSON.stringify(this.gameState));

    }


    update(time, delta) {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.space.isDown && (time - this.inputTime) > 333) {
            this.inputTime = time
            this.inputCount.push(time);
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


        // 스테이지 변경
        if (this.state === 1 && this.runCount > 600) {
            this.state += 1
            this.runCount = 0
            this.inputCount = []
            this.dust.visible = false;
            this.sky.setTexture(`${this.state}`)
            this.mission()

        } else if (this.state > 1 && this.runCount > 300) {
            this.state += 1
            this.runCount = 0
            this.inputCount = []
            this.dust.visible = false;
            this.sky.setTexture(`${this.state}`)
            this.mission()
        }

        this.playerNumber10000.setFrame(Math.floor((time%1000000)/ 100000))
        this.playerNumber1000.setFrame(Math.floor((time%100000)/ 10000))
        this.playerNumber100.setFrame(Math.floor((time%10000)/ 1000))
        this.playerNumber10.setFrame(Math.floor((time % 1000) / 100))
        this.playerNumber1.setFrame(Math.floor(time % 100)/10)



        // 시작 할 때 카운트 다운
        this.countDown.call(this)


    }

    mission() {
        this.tweens.add({
            targets: this.human,
            duration: 300, // 애니메이션 지속 시간
            alpha: 1,
            repeat: 0,

        });
        this.tweens.add({
            targets: this.bubble_human,
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
            return;
        }
        this.bee.play();
        this.number.destroy();
        this.number = this.add.sprite(100, 100, 'numbers').setFrame(this.countdown);
        this.tweens.add({
            targets: this.number,
            duration: 1000, // 애니메이션 지속 시간
            scale: 2, // X축으로 2배 키우기
            repeat: 0,

        });
        this.countdown--;

        this.time.delayedCall(1000, this.countDown, [], this);
    }
}