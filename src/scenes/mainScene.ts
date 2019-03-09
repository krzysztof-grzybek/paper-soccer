import { Board } from '../board/board';
import { TouchIndicators } from '../touchIndicators';

export class MainScene extends Phaser.Scene {
  private board!: Board;
  private touchIndicators!: TouchIndicators;

  constructor() {
    super({
      key: 'MainScene',
    });
  }

  public create(): void {
    const { position, size } = this.getSceneRenderConfig();
    this.cameras.main.setPosition(position.x, position.y);

    this.board = new Board(this, size);
    this.touchIndicators = new TouchIndicators(this);

    const startingPoint = this.board.getStartingPointIndex();
    const availableMoves = this.board.getAdjacentPoints(startingPoint);

    this.touchIndicators.render(availableMoves);
  }

  private getSceneRenderConfig() {
    const MARGIN = 50;

    const width = this.game.canvas.width - 2 * MARGIN;
    const height = this.game.canvas.height - 2 * MARGIN;
    return {
      position: { x: MARGIN, y: MARGIN },
      size: { width, height },
    };
  }
}
