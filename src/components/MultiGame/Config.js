import 'phaser';

export default class Main extends Phaser.Scene {
  player;
  platforms;
  keyDownState;

  constructor() {
    super();

  }
  preload() {

    // 스프라이트 삽입
    // 시트이름, 시트경로, {frameWidth: 각 프레임의 가로길이, frameHeight : 세로길이}, 프레임개수
    this.load.spritesheet('knight', "assets/knight.png",{ frameWidth : 128, frameHeight : 128}, 25);
  }

  create() {
    this.player = this.add.sprite(500,500,'knight') ;
    this.anims.create({
      key: 'attack',//액션이름
      frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),//프레임 불러오기 (불러올 스프라이트, 프레임)[1,2,3,4]
      frameRate: 10,//프레임 레이트
      repeat: -1
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('knight', { start: 12, end: 17 }),
      frameRate: 10,
      repeat: -1
    });
    // this.player.animation.add('normal_attack', [0,1, 2,3],10,-1);
    // this.player.animation.add('walk',[12,13,14,15,16,17],10,-1);

    this.cursors = this.input.keyboard.createCursorKeys();



  }

  update() {

    if(this.cursors.left.isDown) {
      this.player.anims.play('attack', true);
    } else {
      this.player.anims.play('walk', true);

    }
  }
}
