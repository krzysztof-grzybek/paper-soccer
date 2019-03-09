import { Board } from '../board/board';
import { PointData } from '../model';
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
    this.prepareForNextMove(startingPoint.index);

    this.touchIndicators.onChoose(this.onMove.bind(this));
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

  private onMove(point: PointData) {
    let lastMove = false;
    if (
      !this.board.isOnBand(point.index) &&
      !this.trail.wasPointVisited(point.index)
    ) {
      lastMove = true;
    }

    this.touchIndicators.clear();
    this.trail.next(point);

    if (lastMove) {
      // display some info about waiting for other player and send message to server
      this.prepareForNextMove(point.index); // this will be removed after BE setup
    } else {
      this.prepareForNextMove(point.index);
    }
  }

  private prepareForNextMove(pointIndex: number) {
    const adjacentPoints = this.board.getAdjacentPoints(pointIndex);
    const availableMoves = adjacentPoints.filter(p => this.trail.canGoTo(p));
    this.touchIndicators.render(availableMoves);
  }
}
