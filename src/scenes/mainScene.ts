import { Board } from '../board/board';
import { TouchIndicators } from '../touchIndicators';
import { Trail } from '../trail';

export class MainScene extends Phaser.Scene {
  private board!: Board;
  private touchIndicators!: TouchIndicators;
  private trail!: Trail;

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
    this.trail = new Trail(this, this.board.getStartingPoint());

    const startingPoint = this.board.getStartingPoint();
    const adjacentPoints = this.board.getAdjacentPoints(startingPoint.index);
    const availableMoves = adjacentPoints.filter(point => this.trail.canGoTo(point));

    this.touchIndicators.render(availableMoves);
    this.touchIndicators.onChoose(point => {
      this.touchIndicators.clear();
      this.trail.next(point);

      const ap = this.board.getAdjacentPoints(point.index);
      const av = ap.filter(p => this.trail.canGoTo(p));
      this.touchIndicators.render(av);
    });
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
