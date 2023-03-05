import "phaser";
import {
    isPhaserGameStart,
    isLeftPlayerThrow,
    isRightPlayerThrow,
    mySquart,
    heSquart
} from "../openvidu/OpenviduComponent";


//통신


export default class Main2 extends Phaser.Scene {

    // isPhaserGameStart = true;
    gameHasNotStarted = true;

    loadingText;
    player1;
    player2;
    player1Run;
    player2Run;
    player1RunSpeed = 25;
    player2RunSpeed = 25;
    name;
    backGround_Gameboy;

    ground;
    inputTimeDelay = 10;
    backgroundChangeTime = 0;
    sky;
    backgroundCount = 0;


    player1Num = 0;
    player2Num = 0;


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
        this.load.image('1_game_background', '../assets/multigame2/1_game_background.png')
        this.load.image('2_game_background', '../assets/multigame2/2_game_background.png')
        this.load.image('3_game_background', '../assets/multigame2/3_game_background.png')
        this.load.image('4_game_background', '../assets/multigame2/4_game_background.png')


    }


    create() {


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
}