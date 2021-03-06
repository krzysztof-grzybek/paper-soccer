import { Board } from '../board/board';
import { moveType, PlayerContext, SceneExtended } from '../model';
import { TouchIndicators } from '../touchIndicators';
import { Trail } from '../trail';
import { GAME_END_SCENE_ID } from './gameEndScene';

const GAMEPLAY_SCENE_ID = 'GameplayScene';

class GameplayScene extends SceneExtended {
  private board!: Board;
  private touchIndicators!: TouchIndicators;
  private trail!: Trail;

  private aimGate!: 1 | 2;
  private ownGate!: 1 | 2;

  constructor() {
    super({
      key: GAMEPLAY_SCENE_ID,
      active: false,
    });
  }

  public create(context: PlayerContext): void {
    const { position, size } = this.getSceneRenderConfig();
    this.cameras.main.setPosition(position.x, position.y);

    this.board = new Board(this, size, !context.isFirstPlayer);
    this.touchIndicators = new TouchIndicators(this);
    this.trail = new Trail(this, this.board);

    this.aimGate = context.isFirstPlayer ? 2 : 1;
    this.ownGate = context.isFirstPlayer ? 1 : 2;

    this.trail.addMissing(context.trailState);
    const lastTrailPoint = this.trail.getLastPoint();
    const currentPoint = lastTrailPoint !== null ? lastTrailPoint : this.board.getStartingPoint();
    if (context.isPlayerTurn) {
      this.prepareForNextMove(currentPoint);
    } else {
      this.events.emit('player-change');
    }

    this.touchIndicators.onChoose(this.onMove.bind(this));
    this.server.onOpponentMove(this.onOpponentMove.bind(this));
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

  private onMove(pointIndex: number) {
    this.touchIndicators.clear();
    this.trail.next(pointIndex);

    const isWin = this.board.isInGate(pointIndex, this.aimGate);
    const isLastMoveInTurn = !this.canMakeNextMove(pointIndex);
    const isLoss = this.board.isInGate(pointIndex, this.ownGate) || this.getAvailableMoves(pointIndex).length === 0;

    if (isWin) {
      this.scene.start(GAME_END_SCENE_ID, { won: true, state: 'initial' });
      this.server.sendMove({ type: 'win', trailState: this.trail.getState() });
      this.notifyOpponentOnMsngrIfNotConnected();
      return;
    }

    if (isLoss) {
      this.scene.start(GAME_END_SCENE_ID, { won: false, state: 'initial' });
      this.server.sendMove({ type: 'loss', trailState: this.trail.getState() });
      this.notifyOpponentOnMsngrIfNotConnected();
      return;
    }

    if (isLastMoveInTurn) {
      this.events.emit('player-change');
      this.server.sendMove({ type: 'progress', trailState: this.trail.getState() });
      this.notifyOpponentOnMsngrIfNotConnected();
      return;
    }

    this.prepareForNextMove(pointIndex);
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
    return this.board.isOnBand(pointIndex) || this.trail.wasPointVisitedAtLeastTwice(pointIndex);
  }

  private notifyOpponentOnMsngrIfNotConnected() {
    this.server.isOpponentConnected().then(isConnected => {
      if (isConnected) {
        return;
      }

      // TODO: provide proper text
      this.facebook.update('Play', {
        default: 'Opponent made a move!',
        localizations: {
          es_PL: 'Przeciwnik zrobił ruch!',
        },
      }, 'msngr-icon', 0, 'next_turn', {});
    });
  }

  private onOpponentMove({ type, trailState }: { type: moveType, trailState: number[] }) {
    this.trail.addMissing(trailState);
    if (type === 'progress') {
      this.prepareForNextMove(trailState[trailState.length - 1]);
    } else if (type === 'win') {
      this.scene.start(GAME_END_SCENE_ID, { state: 'initial', won: false });
    } else if (type === 'loss') {
      this.scene.start(GAME_END_SCENE_ID, { state: 'initial', won: true });
    }
  }
}

export { GameplayScene, GAMEPLAY_SCENE_ID };
