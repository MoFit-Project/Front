import 'phaser';
export default class Main extends Phaser.Scene {

    player;
    ball;
    ballSpeed = 500;
    ballAngle = -45;
    ballLaunched = false;
    constructor() {
        super();

    }

    preload() {

        // 스프라이트 삽입
        // 시트이름, 시트경로, {frameWidth: 각 프레임의 가로길이, frameHeight : 세로길이}, 프레임개수
        this.load.spritesheet('knight', "assets/knight.png", {frameWidth: 128, frameHeight: 128}, 25);

        // 투사체 추가
        this.load.image("ball", 'assets/ball.png');
    }

    create() {
        // 캐릭터 설정
        this.player = this.add.sprite(500, 500, 'knight');


        this.anims.create({
            key: 'attack',//액션이름
            frames: this.anims.generateFrameNumbers('knight', {start: 0, end: 3}),//프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
            frameRate: 10,// 초당 프레임 개수
            repeat: 0 // 0 : 한번만 반복
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('knight', {start: 12, end: 17}),
            frameRate: 10,
            repeat: -1
        });
        // attack 애니메이션이 끝나고 실행 할 애니메이션  play 인자가 true라면 무한반복됨
        this.player.on('animationcomplete-attack', () => {
            this.player.anims.play('walk', true);
        });


        // 투사체 설정
        // 투사체를 생성하고 초기화합니다.
        this.ball = this.physics.add.image(500, 500, 'ball').setOrigin(0,0);
        // 안보이게 하기
        this.ball.visible = false;


        // 콘솔키 설정
        this.cursors = this.input.keyboard.createCursorKeys();


    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.ballAngle -= 5;
            if (this.ballAngle < -90) {
                this.ballAngle = -90;
            }
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.ballAngle += 5;
            if (this.ballAngle > 0) {
                this.ballAngle = 0;
            }
        }
        // 스페이스바가 눌린 경우 투사체를 발사합니다.
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && !this.ballLaunched) {
            this.player.anims.play('attack', true);

            this.ballLaunched = true;

            // 투사체를 보이게 하고 초기 속도와 각도를 설정합니다.
            this.ball.visible = true;
            this.physics.velocityFromAngle(this.ballAngle,this.ballSpeed,this.ball.body.velocity);
            console.log(this.ballAngle, this.ballSpeed)

        }

        // 투사체가 화면 밖으로 나가면 다시 초기화합니다.
        if (this.ball.y > 600 || this.ball.y < 0 || this.ball.x > 800 || this.ball.x < 0) {
            this.ballLaunched = false;
            this.ball.body.stop();
            this.ball.x = this.player.x;
            this.ball.y = this.player.y;
            this.ball.visible = false;
        }
    }

}