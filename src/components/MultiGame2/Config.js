import "phaser";
import {
    isPhaserGameStart2,
    gameTimePassed2,
    gameTimeTotal2,
    mySquart2,
    heSquart2
} from "../openvidu/OpenviduComponent2";
import {gameTimePassed, gameTimeTotal} from "@/components/openvidu/OpenviduComponent";


//통신


export default class Main2 extends Phaser.Scene {

    gameHasNotStarted = true;

    loadingText;
    player1;
    player2;
    player1Run;
    player2Run;
    name;
    backGround_Gameboy;

    ground;
    inputTimeDelay = 10;
    backgroundChangeTime = 0;
    sky;
    backgroundCount = 0;
    noDisplay;
    bee;
    number;
    playerBackground;

    player1Number100;
    player1Number10;
    player1Number1;
    player2Number100;
    player2Number10;
    player2Number1;
    timeBar;
    timeText;
    player1TempCount = 0;
    player2TempCount = 0;
    ding;
    inGameBgm;
    waitBgm2;
    countdown = 5;


    constructor() {
        super();

    }

    preload() {
        // 로딩 하기
        this.loadingText = this.make.text({
            x: 1900 / 2,
            y: (1000 / 2) + 175,
            text: '0%',
            style: {
                font: '100px monospace',
                fill: '#000000'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => { // arrow function으로 변경
            this.loadingText.text = `${Math.round(value * 100)}%`; // Math.round 수정
        });

        this.load.on('complete', () => { // arrow function으로 변경
            this.loadingText.destroy();
        });


        // 플레이어 캐릭터 생성

        this.load.spritesheet(
            "player1",
            '../assets/characters2/pink.png',
            {frameWidth: 32, frameHeight: 32}
        )
        this.load.spritesheet(
            "player2",
            '../assets/characters2/dude.png',
            {frameWidth: 32, frameHeight: 32}
        )
        this.load.spritesheet(
            "displayDisable",
            '../assets/notStart.png',
            {frameWidth: 467, frameHeight: 262}
        )
        this.load.spritesheet(
            "numbers",
            '../assets/numbers.png',
            {frameWidth: 130, frameHeight: 150}
        )


        // 달리기 트랙
        this.load.spritesheet('runTrack', '../assets/multigame2/runTrack.png', {frameWidth: 1837, frameHeight: 407})

        this.load.image('backGround_Gameboy', '../assets/gameboy.png')
        this.load.image('1_game_background', '../assets/multigame2/1_game_background.png')
        this.load.image('2_game_background', '../assets/multigame2/2_game_background.png')
        this.load.image('3_game_background', '../assets/multigame2/3_game_background.png')
        this.load.image('4_game_background', '../assets/multigame2/4_game_background.png')
        this.load.audio('bee', ['../assets/sound/bee.mp3'])
        this.load.audio('ding', ['../assets/sound/ding.mp3'])
        this.load.audio('inGameBgm', ['../assets/sound/inGameBgm.mp3'])
        this.load.audio('waitBgm2', ['../assets/sound/waitBgm2.mp3'])
        this.load.audio('start', ['../assets/sound/start.mp3'])



    }


    create() {
        this.playerBackground = this.add.graphics();

        this.timeBar = this.add.graphics().setDepth(1);

        this.timeText = this.add
            .text(550, 75,
                "TIME LEFT:",
                {color: "#ffffff", fontSize: "60px", fontFamily: 'dalmoori'}
            )
            .setDepth(1)
        this.timeBar.visible = false;
        this.timeText.visible = false;


        this.bee = this.sound.add('bee');
        this.ding = this.sound.add('ding');
        this.inGameBgm = this.sound.add('inGameBgm')
        this.waitBgm2 = this.sound.add('waitBgm2')
        this.start = this.sound.add('start');
        this.waitBgm2.play();

        this.sky = this.add.tileSprite(950, 230, 250, 140, '1_game_background')
            .setOrigin(0.5, 0)
            .setScale(3)


        this.ground = this.add.sprite(950, 710, 'runTrack').setScale(0.4, 0.4);

        this.player2 = this.add.sprite(925, 545, 'player2').setScale(8);
        this.player2Run = this.add.sprite(925, 545, 'player2').setScale(8);

        this.player1 = this.add.sprite(925, 630, 'player1').setScale(8).setVisible(true);
        this.player1Run = this.add.sprite(925, 630, 'player1').setScale(8);

        this.name = this.add
            .text(this.player1.x - 80, this.player1.y - 120,
                "PLAYER",
                {color: "#ffd400", fontSize: "30px", fontFamily: 'dalmoori'}
            )


        // this.sky.fixedToCamera = true;


        // 달리기 애니매이션 추가!
        //player1

        this.anims.create({
            key: 'player1_run',
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 5}),
            frameRate: 29,
            repeat: 0,
        });


        this.anims.create({
            key: 'player1_dust',
            frames: this.anims.generateFrameNumbers('player1', {start: 6, end: 11}),
            frameRate: 28,
            repeat: 0,
        });

        //player2
        this.anims.create({
            key: 'player2_run',
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 5}),
            frameRate: 29,
            repeat: 0,
        });

        this.anims.create({
            key: 'player2_dust',
            frames: this.anims.generateFrameNumbers('player2', {start: 6, end: 11}),
            frameRate: 28,
            repeat: 0,
        });

        this.anims.create({
            key: 'trackMove',
            frames: this.anims.generateFrameNumbers('runTrack', {start: 0, end: 27}),
            frameRate: 30,
            repeat: 0,
        });


        this.anims.create({
            key: 'beforeStart',
            frames: this.anims.generateFrameNumbers('displayDisable', {start: 0, end: 1}),
            frameRate: 30,
            repeat: -1,
        });
        this.noDisplay = this.add.sprite(950, 500, 'displayDisable')
            .setOrigin(0.5, 0.5)
            .setScale(1.6, 2.1)
            .setVisible(true)
            .setDepth(1);
        this.noDisplay.anims.play('beforeStart')


        this.number = this.add.sprite(950, 500, 'numbers').setVisible(false).setDepth(1);


        this.backGround_Gameboy = this.add.image(950, 500, 'backGround_Gameboy')
            .setOrigin(0.5, 0.5)
            .setScale(1.58);

        this.player1Number10 = this.add.sprite(740, 300, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0xecc9fb);
        this.player1Number100 = this.add.sprite(this.player1Number10.x - 90, this.player1Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0xecc9fb);
        this.player1Number1 = this.add.sprite(this.player1Number10.x + 90, this.player1Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0xecc9fb);
        this.player2Number10 = this.add.sprite(1160, 300, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0x0bc7ed);
        this.player2Number100 = this.add.sprite(this.player2Number10.x - 90, this.player2Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0x0bc7ed);
        this.player2Number1 = this.add.sprite(this.player2Number10.x + 90, this.player2Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5).setTint(0x0bc7ed);


    }


    update(time, delta) {
        const cursors = this.input.keyboard.createCursorKeys();

        let currentGameTime = (gameTimeTotal2 - (gameTimePassed2 - 5)) / (gameTimeTotal2)
        if (currentGameTime < 0) {
            currentGameTime = 0
        } else if (currentGameTime > 1) {
            currentGameTime = 1
        }
        this.timeBar.clear();
        this.timeBar.fillStyle(0xff0000, 1);
        this.timeBar.fillRect(860, 77, 480 * currentGameTime, 60);


        if (mySquart2 != this.player1TempCount) {
            this.player1TempCount = mySquart2;
            this.ding.play();
            this.effect(this.player1Number1)
            this.effect(this.player1Number10)
            this.effect(this.player1Number100)

            this.player1Number100.setFrame(Math.floor(mySquart2 / 100))
            this.player1Number10.setFrame(Math.floor((mySquart2 % 100) / 10))
            this.player1Number1.setFrame(Math.floor(mySquart2 % 10))
        }
        if (heSquart2 != this.player2TempCount) {
            this.player2TempCount = heSquart2;
            this.effect(this.player2Number1)
            this.effect(this.player2Number10)
            this.effect(this.player2Number100)

            this.player2Number100.setFrame(Math.floor(heSquart2 / 100))
            this.player2Number10.setFrame(Math.floor((heSquart2 % 100) / 10))
            this.player2Number1.setFrame(Math.floor(heSquart2 % 10))
        }


        if (isPhaserGameStart2 && this.gameHasNotStarted) {
            this.gameHasNotStarted = false;
            this.timeBar.visible = true;
            this.timeText.visible = true;
            this.noDisplay.destroy();
            this.waitBgm2.destroy();
            this.countDown.call(this);

        }
        this.player1.anims.play('player1_run', true);
        this.player1Run.anims.play('player1_dust', true);
        this.player2.anims.play('player2_run', true);
        this.player2Run.anims.play('player2_dust', true);
        this.ground.anims.play('trackMove', true);



        this.name.setPosition(this.player1.x - 30, this.player1.y + 125)


        let difference = (mySquart2 - heSquart2)
        if (difference > 10) {
            difference = 10
        } else if (difference < -10) {
            difference = -10
        }
        this.player1.x = 925 + difference*25
        this.player1Run.x = 925 + difference*25
        this.player2.x = 925 - difference*25
        this.player2Run.x = 925 - difference*25
        this.anims.get('player1_run').frameRate = 29 + difference*2
        this.anims.get('player1_dust').frameRate = 28 + difference*2
        this.anims.get('player2_run').frameRate = 29 - difference*2
        this.anims.get('player2_dust').frameRate = 28 - difference*2

        if ((time - this.backgroundChangeTime) > this.inputTimeDelay * 1000) {
            this.backgroundChangeTime = time;
            this.backgroundCount += 1
            this.sky.setTexture(`${Math.floor(this.backgroundCount % 4) + 1}_game_background`)


        }
        this.sky.tilePositionX += 5
    }

    effect(i) {
        this.tweens.add({
            targets: i,
            duration: 300, // 애니메이션 지속 시간
            scale: 2,
            alpha: 0,
            repeat: 0,
            onComplete: function (tween, targets) {
                targets[0].setScale(1).setAlpha(1);
            },
        });
    }

        countDown()
        {
            if (this.countdown === 0) {
                this.start.play();
                this.number.visible = false;
                this.number.destroy();
                this.inGameBgm.play();
                return;
            }
            this.bee.play();
            this.number.destroy();
            this.number = this.add.sprite(950, 500, 'numbers').setFrame(this.countdown);
            this.tweens.add({
                targets: this.number,
                duration: 1000, // 애니메이션 지속 시간
                scale: 2, // X축으로 2배 키우기
                repeat: 0
            });
            this.countdown--;

            this.time.delayedCall(1000, this.countDown, [], this);
        }

}