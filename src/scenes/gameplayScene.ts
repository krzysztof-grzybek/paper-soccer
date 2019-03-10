import { Board } from '../board/board';
import { PointData } from '../model';
import { TouchIndicators } from '../touchIndicators';
import { Trail } from '../trail';
import { GameEndScene } from './gameEndScene';

const GAMEPLAY_SCENE_ID = 'GameplayScene';

interface Game {
  id: string;
}

class GameplayScene extends Phaser.Scene {
  private board!: Board;
  private touchIndicators!: TouchIndicators;
  private trail!: Trail;

  constructor() {
    super({
      key: GAMEPLAY_SCENE_ID,
    });
  }

  public create(game: Game): void {
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
    const isWin = this.board.isInGate(point.index); // TODO: check if it's proper gate after players introduce
    const isLastMoveInTurn = !this.canMakeNextMove(point.index);

    this.touchIndicators.clear();
    this.trail.next(point);

    const isLoss = this.getAvailableMoves(point.index).length === 0;

    if (isWin) {
      this.scene.switch('GameEndScene');
      const scene = this.scene.get('GameEndScene') as GameEndScene;
      scene.setWin();
      // send move to server
      return;
    }

    if (isLoss) {
      this.scene.switch('GameEndScene');
      const scene = this.scene.get('GameEndScene') as GameEndScene;
      scene.setLoss();
      // send move to server
      return;
    }

    if (isLastMoveInTurn) {
      // display some info about waiting for other player and send message to server
      this.prepareForNextMove(point.index); // this will be removed after BE setup
      this.events.emit('player-change');
      return;
    }

    this.prepareForNextMove(point.index);
  }

  private prepareForNextMove(pointIndex: number) {
    const availableMoves = this.getAvailableMoves(pointIndex);
    this.touchIndicators.render(availableMoves);
  }

  private getAvailableMoves(pointIndex: number) {
    const adjacentPoints = this.board.getAdjacentPoints(pointIndex);
    return adjacentPoints.filter(p => this.trail.canGoTo(p));
  }

  private canMakeNextMove(pointIndex: number) {
    return this.board.isOnBand(pointIndex) || this.trail.wasPointVisited(pointIndex);
  }
}

export { GameplayScene, GAMEPLAY_SCENE_ID };
