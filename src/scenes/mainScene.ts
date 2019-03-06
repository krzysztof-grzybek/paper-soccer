import { Board } from '../board/board';
import { BoardView } from '../board/boardView';

export class MainScene extends Phaser.Scene {
  private board!: Board;
  private boardView!: BoardView;

  constructor() {
    super({
      key: 'MainScene',
    });
  }

  public create(): void {
    const MARGIN = 50;
    const graphics = this.add.graphics({ x: MARGIN, y: MARGIN });

    this.board = new Board();
    const boardSize = this.board.getSize();
    const dimensions = { width: this.game.canvas.width - 2 * MARGIN, height: this.game.canvas.height - 2 * MARGIN };
    this.boardView = new BoardView(graphics, boardSize.ROWS, boardSize.COLUMNS, dimensions);
    this.boardView.render();
  }
}
