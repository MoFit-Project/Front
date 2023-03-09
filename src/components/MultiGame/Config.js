import "phaser";
import {
    isPhaserGameStart,
    gameTimePassed,
    gameTimeTotal,
    mySquart,
    heSquart
} from "../openvidu/OpenviduComponent";

//통신


export default class Main extends Phaser.Scene {
    gameHasNotStarted = true;
    loadingText;
    player1;
    player2;
    player1Hurt;
    player2Hurt;
    player1InputTime = 0;
    player2InputTime = 0;

    player1CountTempSave = 0;
    player2CountTempSave = 0;

    touch = false;

    name;
    backGround_Gameboy;
    backgroundCity;
    ground;
    punchSound;
    fightBgm;
    waitBgm;
    bee;
    ding;
    start;
    noDisplay;
    number;
    countdown = 5;
    player1Number100;
    player1Number10;
    player1Number1;
    player2Number100;
    player2Number10;
    player2Number1;
    timeBar;
    timeText;

    playerBackground;
    phaserStart = 0;
    guideText;
    circle;
    winSound;
    loseSound;

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


        // 플레이어
        let char = ["biker.png", 'cyber.png', 'punk.png']
        const num1 = Math.random()
        let random1;
        if (num1 < 0.33) {
            random1 = char[0]
            char.splice(0, 1)
        } else if (num1 < 0.66) {
            random1 = char[1]
            char.splice(1, 1)

        } else {
            random1 = char[2]
            char.splice(2, 1)

        }
        const num2 = Math.random()
        let random2;
        if (num2 < 0.5) {
            random2 = char[0]
        } else {
            random2 = char[1]
        }
        this.load.spritesheet(
            "player1",
            `../assets/characters/${random1}`,
            {frameWidth: 48, frameHeight: 48}
        )
        this.load.spritesheet(
            "player2",
            `../assets/characters/${random2}`,
            {frameWidth: 48, frameHeight: 48}
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

        this.load.image('backGround_Gameboy', '../assets/gameboy.png')
        this.load.image('backgroundCityImage', '../assets/backgroundCity.png')
        this.load.image('ground', '../assets/ground.webp')
        this.load.image('circle', '../assets/circle.png')
        this.load.audio('punch', ['../assets/sound/punch.mp3'])
        this.load.audio('fight', ['../assets/sound/fightBGM.mp3'])
        this.load.audio('wait', ['../assets/sound/waitBGM.mp3'])
        this.load.audio('bee', ['../assets/sound/bee.mp3'])
        this.load.audio('ding', ['../assets/sound/ding.mp3'])
        this.load.audio('start', ['../assets/sound/start.mp3'])
        this.load.audio('winSound', ['../assets/sound/win.mp3'])
        this.load.audio('loseSound', ['../assets/sound/lose.mp3'])

    }


    create() {

        this.playerBackground = this.add.graphics();

        this.timeBar = this.add.graphics().setDepth(1).setVisible(false);

        this.timeText = this.add
            .text(550, 75,
                "TIME LEFT:",
                {color: "#ffffff", fontSize: "60px", fontFamily: 'dalmoori'}
            )
            .setDepth(1).setVisible(false)
        // this.timeBar.visible = false;
        // this.timeText.visible = false;


        this.punchSound = this.sound.add('punch').setVolume(5);
        this.fightBgm = this.sound.add('fight');
        this.waitBgm = this.sound.add('wait');
        this.bee = this.sound.add('bee').setVolume(5);
        this.ding = this.sound.add('ding').setVolume(5);
        this.start = this.sound.add('start').setVolume(10);
        this.winSound = this.sound.add('winSound').setVolume(10);
        this.loseSound = this.sound.add('loseSound').setVolume(10);

        this.waitBgm.play();


        this.backgroundCity = this.add.image(950, 450, 'backgroundCityImage').setScale(1.3, 2)
        this.ground = this.add.image(950, 730, 'ground').setScale(1.1, 0.6);


        this.player2 = this.physics.add.sprite(950, 710, 'player2')
            .setOrigin(0.5,1)
            .setScale(8)
            .toggleFlipX();
        this.player1 = this.physics.add.sprite(950, 710, 'player1').setScale(8).setOrigin(0.5,1);
        this.player2Hurt = this.physics.add.sprite(950, 710, 'player2')
            .setOrigin(0.5,1)
            .setScale(8)
            .toggleFlipX()
            .setVisible(false);
        this.player1Hurt = this.physics.add.sprite(950, 710, 'player1').setScale(8).setOrigin(0.5,1).setVisible(false);
        this.name = this.add
            .text(this.player1.x-120, this.player1.y+10,
                "PLAYER",
                {color: "#ffd400", fontSize: "30px", fontFamily: 'dalmoori'}
            )
        //player1
        this.anims.create({
            key: 'player1_idle',
            frames: this.anims.generateFrameNumbers('player1', {start: 56, end: 59}),
            frameRate: 10,
            repeat: 0,
        });


        this.anims.create({
            key: 'player1_attack1',
            frames: this.anims.generateFrameNumbers('player1', {start: 8, end: 15}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack2',
            frames: this.anims.generateFrameNumbers('player1', {start: 16, end: 23}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack3',
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 5}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_attack4',
            frames: this.anims.generateFrameNumbers('player1', {start: 72, end: 77}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player1_hurt',
            frames: this.anims.generateFrameNumbers('player1', {start: 48, end: 49}),
            frameRate: 20,
            repeat: 0,
            hideOnComplete:true
        });
        //player2
        this.anims.create({
            key: 'player2_idle',
            frames: this.anims.generateFrameNumbers('player2', {start: 56, end: 59}),
            frameRate: 10,
            repeat: 0,
        });



        this.anims.create({
            key: 'player2_attack1',
            frames: this.anims.generateFrameNumbers('player2', {start: 8, end: 15}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack2',
            frames: this.anims.generateFrameNumbers('player2', {start: 16, end: 23}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack3',
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 5}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_attack4',
            frames: this.anims.generateFrameNumbers('player2', {start: 72, end: 77}),
            frameRate: 25,
            repeat: 0,
        });
        this.anims.create({
            key: 'player2_hurt',
            frames: this.anims.generateFrameNumbers('player2', {start: 48, end: 49}),
            frameRate: 20,
            repeat: 0,
            hideOnComplete:true
        });




        this.anims.create({
            key: 'beforeStart',
            frames: this.anims.generateFrameNumbers('displayDisable', {start: 0, end: 1}),
            frameRate: 20,
            repeat: -1,
        });
        this.noDisplay = this.add.sprite(950, 500, 'displayDisable')
            .setOrigin(0.5, 0.5)
            .setScale(1.6, 2.1)
            .setVisible(true)
            .setDepth(1);
        this.noDisplay.anims.play('beforeStart')
        this.circle = this.add.image(1250, 420, 'circle').setScale(1).setDepth(1)
        this.guideText = this.add
            .text(600, 230,
                "버튼을 클릭하거나,\n\n머리 위로 동그라미를\n\n만드세요.",
                {color: "#000000", fontSize: "60px", fontFamily: 'dalmoori'}
            )
            .setDepth(1)


        this.number = this.add.sprite(950, 500, 'numbers').setVisible(false).setDepth(1);


        this.backGround_Gameboy = this.add.image(950, 500, 'backGround_Gameboy')
            .setOrigin(0.5, 0.5)
            .setScale(1.58);

        this.player1Number10 = this.add.sprite(740, 300, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.player1Number100 = this.add.sprite(this.player1Number10.x - 90, this.player1Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.player1Number1 = this.add.sprite(this.player1Number10.x + 90, this.player1Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.player2Number10 = this.add.sprite(1160, 300, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.player2Number100 = this.add.sprite(this.player2Number10.x - 90, this.player2Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        this.player2Number1 = this.add.sprite(this.player2Number10.x + 90, this.player2Number10.y, 'numbers').setScale(1).setOrigin(0.5, 0.5);
        localStorage.setItem("phaserStart", JSON.stringify(this.phaserStart));


    }


    update(time, delta) {
        let currentGameTime = (gameTimeTotal - (gameTimePassed - 5)) / (gameTimeTotal)
        if (currentGameTime < 0) {
            currentGameTime = 0
        } else if (currentGameTime > 1) {
            currentGameTime = 1
        }
        if(currentGameTime === 0){
            if(mySquart > heSquart){
                this.winSound.play()
            }else if(mySquart < heSquart){
                this.loseSound.play()
            } else{
                this.winSound.play()
            }
        }
        this.timeBar.clear();
        this.timeBar.fillStyle(0xff0000, 1);
        this.timeBar.fillRect(860, 77, 480 * currentGameTime, 60);


        const r = Math.floor(Math.sin(Date.now() / 1000) * 127 + 128);
        const g = Math.floor(Math.sin(Date.now() / 2000) * 127 + 128);
        const b = Math.floor(Math.sin(Date.now() / 3000) * 127 + 128);


        // const cursors = this.input.keyboard.createCursorKeys();
        // if (cursors.down.isDown && (time - this.player1InputTime) > 500){
        //     mySquart += 1
        //     this.player1InputTime = time;
        // }
        // if (cursors.right.isDown && (time - this.player2InputTime) > 500){
        //     heSquart += 1
        //     this.player2InputTime = time;
        // }



        if (mySquart > heSquart) {
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(0, 0, 570, 1000);
        } else if (mySquart < heSquart) {
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(1330, 0, 570, 1000);
        }


        if (mySquart != this.player1CountTempSave) {
            this.ding.play();
            this.player1CountTempSave = mySquart;
            this.effect(this.player1Number1)
            this.effect(this.player1Number10)
            this.effect(this.player1Number100)

            this.player1Number100.setFrame(Math.floor(mySquart / 100))
            this.player1Number10.setFrame(Math.floor((mySquart % 100) / 10))
            this.player1Number1.setFrame(Math.floor(mySquart % 10))

            // 내가 공격
            this.punchSound.play();
            const number = Math.random()
            if (number < 0.25) {
                this.player1.anims.play('player1_attack1', true);
            } else if (number < 0.5) {
                this.player1.anims.play('player1_attack2', true);
            } else if (number < 0.75) {
                this.player1.anims.play('player1_attack3', true);
            } else {
                this.player1.anims.play('player1_attack4', true);
            }
            this.player2Hurt.visible = true

            this.player2Hurt.anims.play('player2_hurt', true)
        }
        if (heSquart != this.player2CountTempSave) {
            this.player2CountTempSave = heSquart;
            this.effect(this.player2Number1)
            this.effect(this.player2Number10)
            this.effect(this.player2Number100)

            this.player2Number100.setFrame(Math.floor(heSquart / 100))
            this.player2Number10.setFrame(Math.floor((heSquart % 100) / 10))
            this.player2Number1.setFrame(Math.floor(heSquart % 10))

            // 상대편 공격
            this.punchSound.play();
            const number = Math.random();
            if (number < 0.25) {
                this.player2.anims.play('player2_attack1', true);
            } else if (number < 0.5) {
                this.player2.anims.play('player2_attack2', true);
            } else if (number < 0.75) {
                this.player2.anims.play('player2_attack3', true);
            } else {
                this.player2.anims.play('player2_attack4', true);

            }
            this.player1Hurt.visible = true
            this.player1Hurt.anims.play('player1_hurt', true)

        }

        // 게임 시작 신호를 받았을 때
        if (isPhaserGameStart && this.gameHasNotStarted) {
            this.circle.destroy();
            this.guideText.destroy();
            this.gameHasNotStarted = false;
            this.timeBar.visible = true;
            this.timeText.visible = true;
            this.noDisplay.destroy();
            this.waitBgm.destroy();
            this.countDown.call(this);
        }



        this.player1.on("animationcomplete", () => {
            this.player1.anims.play('player1_idle', true);
        });
        this.player2.on("animationcomplete", () => {
            this.player2.anims.play('player2_idle', true);
        });
        let difference = mySquart - heSquart
        if (difference > 10){
            difference = 10
        } else if (difference < -10) {
            difference = -10
        }
        this.player1.scale = 8 + (difference * 0.5)
        this.player1Hurt.scale = this.player1.scale
        this.player2.scale = 8 - (difference * 0.5)
        this.player2Hurt.scale = this.player2.scale







    }
    effect(i) {
        this.tweens.add({
            targets: i,
            duration: 300, // 애니메이션 지속 시간
            scale: 2,
            alpha:0,
            repeat: 0,
            onComplete: function (tween, targets) {
                targets[0].setScale(1).setAlpha(1);
            },
        });
    }

    countDown() {
        if (this.countdown === 0) {
            this.phaserStart = 1;
            localStorage.setItem("phaserStart", JSON.stringify(this.phaserStart));

            this.start.play();
            this.number.visible = false;
            this.player1InputTime = 0;
            this.player2InputTime = 0;
            this.fightBgm.play()
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