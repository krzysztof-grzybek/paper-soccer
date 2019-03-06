import { Board } from '../board/board';
import { BoardView } from '../board/boardView';
import { TouchIndicators } from '../touchIndicators';

export class MainScene extends Phaser.Scene {
  private board!: Board;
  private boardView!: BoardView;
  private touchIndicators!: TouchIndicators;

  constructor() {
    super({
      key: 'MainScene',
    });
  }

  public create(): void {
    const MARGIN = 50;
    const graphics = this.add.graphics({ x: MARGIN, y: MARGIN });
    const touchIndicatorsGraphics = this.add.graphics({ x: MARGIN, y: MARGIN });

    this.board = new Board();
    const boardSize = this.board.getSize();
    const dimensions = { width: this.game.canvas.width - 2 * MARGIN, height: this.game.canvas.height - 2 * MARGIN };
    this.boardView = new BoardView(graphics, boardSize.ROWS, boardSize.COLUMNS, dimensions);
    this.boardView.render();

    const startingPoint = this.board.getStartingPointIndex();
    const availableMoves = this.board.getAdjacentPoints(startingPoint);
    const movs = availableMoves.map(pointIndex => {
      const coords = this.boardView.getCoordsAt(pointIndex);
      return {
        x: coords.x,
        y: coords.y,
        pointIndex,
      };
    });
    this.touchIndicators = new TouchIndicators(touchIndicatorsGraphics);
    this.touchIndicators.render(movs);
  }
}
