import "phaser";
import {
    isPhaserGameStart2,
    gameTimePassed2,
    gameTimeTotal2,
    mySquart,
    heSquart, isPhaserGameStart
} from "../openvidu/OpenviduComponent";
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
    player1Num = 0;
    player2Num = 0;
    playerFire;
    timeBar;
    timeText;
    player1TempCount = 0;
    player2TempCount = 0;
    ding;
    inGameBgm;
    waitBgm2;


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
        let char = ["pink.png", 'owlet.png', 'dude.png']
        const num3 = Math.random()
        let random1;
        if (num3 < 0.33) {
            random1 = char[0]
            char.splice(0, 1)
        } else if (num3 < 0.66) {
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
            `../assets/characters2/${random1}`,
            {frameWidth: 32, frameHeight: 32}
        )
        this.load.spritesheet(
            "player2",
            `../assets/characters2/${random2}`,
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



    }


    create() {
        this.playerBackground = this.add.graphics();

        this.timeBar = this.add.graphics();

        this.timeText = this.add
            .text(580, 930,
                "TIME LEFT:",
                {color: "#000000", fontSize: "61px", fontFamily: 'dalmoori'}
            )
        this.timeBar.visible = false;
        this.timeText.visible = false;


        this.bee = this.sound.add('bee');
        this.ding = this.sound.add('ding');
        this.inGameBgm = this.sound.add('inGameBgm')
        this.waitBgm2 = this.sound.add('waitBgm2')



        this.backGround_Gameboy = this.add.image(950, 405, 'backGround_Gameboy')
            .setOrigin(0.5, 0.5)
            .setScale(1.35);
        this.sky = this.add.tileSprite(950, 359, 328, 190, '1_game_background')
            .setOrigin(0.5, 0.5)
            .setScale(1.86)


        this.ground = this.add.sprite(950, 570, 'runTrack').setScale(0.333);

        this.player2 = this.add.sprite(925, 465, 'player2').setScale(5);
        this.player2Run = this.add.sprite(925, 465, 'player2').setScale(5);

        this.player1 = this.add.sprite(925, 535, 'player1').setScale(5);
        this.player1Run = this.add.sprite(925, 535, 'player1').setScale(5);

        this.name = this.add
            .text(this.player1.x - 80, this.player1.y - 80,
                "PLAYER",
                {color: "#000000", fontSize: "20px"}
            )


        // this.sky.fixedToCamera = true;


        // 달리기 애니매이션 추가!
        //player1

        this.anims.create({
            key: 'player1_run',
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 5}),
            frameRate: 30,
            repeat: 0,
        });


        this.anims.create({
            key: 'player1_dust',
            frames: this.anims.generateFrameNumbers('player1', {start: 6, end: 11}),
            frameRate: 30,
            repeat: 0,
        });

        //player2
        this.anims.create({
            key: 'player2_run',
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 5}),
            frameRate: 30,
            repeat: 0,
        });

        this.anims.create({
            key: 'player2_dust',
            frames: this.anims.generateFrameNumbers('player2', {start: 6, end: 11}),
            frameRate: 30,
            repeat: 0,
        });

        this.anims.create({
            key: 'trackMove',
            frames: this.anims.generateFrameNumbers('runTrack', {start: 0, end: 27}),
            frameRate: 40,
            repeat: 0,
        });


        this.noDisplay = this.add.sprite(950, 410, 'displayDisable')
            .setOrigin(0.5, 0.5)
            .setScale(1.31, 1.75);
        this.anims.create({
            key: 'beforeStart',
            frames: this.anims.generateFrameNumbers('displayDisable', {start: 0, end: 1}),
            frameRate: 20,
            repeat: -1,
        });
        this.noDisplay.anims.play('beforeStart')

        this.playerFire = this.add.sprite(280, 930, 'fire')
            .setOrigin(0.5, 0.5)
            .setScale(1.8, 3)
            .setDepth(1)
            .setVisible(false);
        this.number = this.add.sprite(950, 410, 'numbers').setVisible(false);
        this.player1Number100 = this.add.sprite(170, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player1Number10 = this.add.sprite(280, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player1Number1 = this.add.sprite(390, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number100 = this.add.sprite(1530, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number10 = this.add.sprite(1640, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
        this.player2Number1 = this.add.sprite(1750, 910, 'numbers').setScale(1.2).setOrigin(0.5, 0.5);
    }


    update(time, delta) {
        if (!this.waitBgm2.isPlaying && this.gameHasNotStarted) {
            this.waitBgm2.play()
        }
        if (!this.inGameBgm.isPlaying && isPhaserGameStart) {
            this.inGameBgm.play()
        }
        let currentGameTime = gameTimePassed2 - 5
        if (currentGameTime < 0){
            currentGameTime = 0
        }
        this.timeBar.clear();
        this.timeBar.fillStyle(0xff0000, 1);
        this.timeBar.fillRect(890, 929, 430 * ((gameTimeTotal2 - currentGameTime) / (gameTimeTotal2)), 59);

        const r = Math.floor(Math.sin(Date.now() / 1000) * 127 + 128);
        const g = Math.floor(Math.sin(Date.now() / 2000) * 127 + 128);
        const b = Math.floor(Math.sin(Date.now() / 3000) * 127 + 128);

        this.player1Number100.setFrame(Math.floor(mySquart / 100))
        this.player1Number10.setFrame(Math.floor((mySquart % 100) / 10))
        this.player1Number1.setFrame(Math.floor(mySquart % 10))

        this.player2Number100.setFrame(Math.floor(heSquart / 100))
        this.player2Number10.setFrame(Math.floor((heSquart % 100) / 10))
        this.player2Number1.setFrame(Math.floor(heSquart % 10))
        if(mySquart != this.player1TempCount){
            this.player1TempCount = mySquart;
            this.ding.play();
        }
        if(heSquart != this.player2TempCount){
            this.player2TempCount = heSquart;
            this.ding.play();
        }
        if (mySquart > heSquart) {
            this.playerFire.x = 280;
            this.playerFire.visible = true;
            this.playerFire.anims.play('player_fire', true)
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(0, 0, 570, 1000);
        } else if (mySquart < heSquart) {
            this.playerFire.x = 1640;
            this.playerFire.visible = true;
            this.playerFire.anims.play('player_fire', true)
            this.playerBackground.clear();
            this.playerBackground.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
            this.playerBackground.fillRect(1330, 0, 570, 1000);
        }

        if (isPhaserGameStart2 && this.gameHasNotStarted) {
            this.gameHasNotStarted = false;
            this.timeBar.visible = true;
            this.timeText.visible = true;
            this.countDown.call(this);

        }
        this.player1.anims.play('player1_run', true);
        this.player1Run.anims.play('player1_dust', true);
        this.player2.anims.play('player2_run', true);
        this.player2Run.anims.play('player2_dust', true);
        this.ground.anims.play('trackMove', true);

        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.up.isDown) {
            this.player1Num += 1
            console.log(this.player1Num - this.player2Num)
        }
        if (cursors.down.isDown) {
            this.player2Num += 1
            console.log(this.player1Num - this.player2Num)
        }
        let difference = (this.player1Num - this.player2Num) * 10
        // 여기까지 테스트


        this.name.setPosition(this.player1.x - 30, this.player1.y + 80)


        // let difference = 925 + (mySquart - heSquart)*10
        if (difference > 240) {
            difference = 240
        } else if (difference < -240) {
            difference = -240
        }
        this.player1.x = 925 + difference
        this.player1Run.x = 925 + difference
        this.player2.x = 925 - difference
        this.player2Run.x = 925 - difference


        if ((time - this.backgroundChangeTime) > this.inputTimeDelay * 1000) {
            this.backgroundChangeTime = time;
            this.backgroundCount += 1
            this.sky.setTexture(`${Math.floor(this.backgroundCount % 4) + 1}_game_background`)


        }
        this.sky.tilePositionX += 5
    }

    countDown() {
        if (this.countdown === 0) {
            this.start.play();
            this.number.visible = false;
            this.noDisplay.destroy();
            this.waitBgm2.destroy();
            this.inGameBgm.play()
            return;
        }
        this.bee.play();
        this.number.destroy();
        this.number = this.add.sprite(950, 410, 'numbers').setFrame(this.countdown);
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