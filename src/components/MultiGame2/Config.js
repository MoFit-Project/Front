import "phaser";
import { isPhaserGameStart, isLeftPlayerThrow, isRightPlayerThrow, mySquart, heSquart } from "../openvidu/OpenviduComponent";


//통신


export default class Main2 extends Phaser.Scene {

    // isPhaserGameStart = true;
    gameHasNotStarted = true;

    loadingText;
    player1;
    player2;
    player1Run;
    player2Run;


    player1InputTime;
    player2InputTime;
    player1Press = false;
    player2Press = false;

    player1CountTempSave = 0;
    player2CountTempSave = 0;
    player1CountDetector = false;
    player2CountDetector = false;

    touch = false;

    inputTimeDelay = 0.5;
    name;
    backGround_Gameboy;

    ground;


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


        // 달리기 트랙
        this.load.spritesheet('runTrack', '../assets/multigame2/runTrack.png', {frameWidth: 1837, frameHeight: 407})

        this.load.image('backGround_Gameboy', '../assets/gameboy.png')

    }


    create() {

        this.backGround_Gameboy = this.add.image(960, 405, 'backGround_Gameboy')
            .setOrigin(0.5, 0.5)
            .setScale(1.35);

        this.ground = this.add.sprite(960, 570, 'runTrack').setScale(0.33);

        this.player2 = this.add.sprite(935, 470, 'player2').setScale(5);
        this.player2Run = this.add.sprite(935, 470, 'player2').setScale(5);

        this.player1 = this.add.sprite(935, 535, 'player1').setScale(5);
        this.player1Run = this.add.sprite(935, 535, 'player1').setScale(5);

        this.name = this.add
            .text(this.player1.x - 80, this.player1.y - 80,
                "PLAYER",
                {color: "#000000", fontSize: "20px"}
            )


        //player1

        this.anims.create({
            key: 'player1_run',
            frames: this.anims.generateFrameNumbers('player1', {start: 0, end: 5}),
            frameRate: 20,
            repeat: 0,
        });


        this.anims.create({
            key: 'player1_dust',
            frames: this.anims.generateFrameNumbers('player1', {start: 6, end: 11}),
            frameRate: 20,
            repeat: 0,
        });

        //player2
        this.anims.create({
            key: 'player2_run',
            frames: this.anims.generateFrameNumbers('player2', {start: 0, end: 5}),
            frameRate: 20,
            repeat: 0,
        });

        this.anims.create({
            key: 'player2_dust',
            frames: this.anims.generateFrameNumbers('player2', {start: 6, end: 11}),
            frameRate: 20,
            repeat: 0,
        });

        this.anims.create({
            key: 'trackMove',
            frames: this.anims.generateFrameNumbers('runTrack', {start: 0, end: 27}),
            frameRate: 20,
            repeat: 0,
        });

    }


    update(time, delta) {
        if (isPhaserGameStart) {
            this.player1.anims.play('player1_run', true);
            this.player1Run.anims.play('player1_dust', true);
            this.player2.anims.play('player2_run', true);
            this.player2Run.anims.play('player2_dust', true);
            this.ground.anims.play('trackMove', true);
        }

        // 테스트용
        this.player1.anims.play('player1_run', true);
        this.player1Run.anims.play('player1_dust', true);
        this.player2.anims.play('player2_run', true);
        this.player2Run.anims.play('player2_dust', true);
        this.ground.anims.play('trackMove', true);


        this.name.setPosition(this.player1.x - 30, this.player1.y +80)





    }
}