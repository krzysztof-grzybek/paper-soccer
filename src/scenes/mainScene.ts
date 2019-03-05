import { createBoard } from '../board';

export class MainScene extends Phaser.Scene {

  constructor() {
    super({
      key: 'MainScene',
    });
  }

  public preload(): void {
  }

  public create(): void {
    // temp board render
    const board = createBoard();
    const RADIUS = 1;
    const WIDTH = 300;
    const HEIGHT = 450;
    const boardWidth = 9; // will be get from board
    const boardHeight = 11; // will be get from board

    const graphics = this.add.graphics({ x: 50, y: 50 });
    graphics.fillStyle(12);
    graphics.fillCircle(Math.floor(boardWidth/2) * (WIDTH / 9), 0, RADIUS);

    for(let i = 1; i <= boardHeight; i++) {
      for(let j = 0; j < boardWidth; j++) {
        graphics.fillCircle(j *  (WIDTH / 9), i * (HEIGHT /boardHeight), RADIUS);
      }
    }

    graphics.fillCircle(Math.floor(boardWidth/2)* (WIDTH / 9), HEIGHT + HEIGHT/boardHeight, RADIUS);

    // end temp board render
  }
}
