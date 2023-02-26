import 'phaser';
import {platform} from "os";
export default class Main extends Phaser.Scene {
  player;
  platforms;
  constructor() {
    super();
    this.move = 0;
    this.x = 0;
    this.y = 0;
  }
  preload() {
    this.load.image('ball', 'assets/ball.png');
  }

  create() {
    this.group = this.add.group({ key: 'ball', frameQuantity: 128 });


    this.input.on('pointermove', function (pointer) {
      this.x = pointer.x;
      this.y = pointer.y;
    }, this);

  }

  update(time, delta) {
    this.move += delta;
    if (this.move > 6)
    {
      Phaser.Actions.ShiftPosition(this.group.getChildren(), this.x, this.y);
      this.move = 0;
    }
  }
}
