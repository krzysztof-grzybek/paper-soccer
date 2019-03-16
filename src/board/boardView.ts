const RADIUS = 2;
const POINT_COLOR = 0x0b0694;

class BoardView {
  private coordsList: Array<{ x: number; y: number }> = [];
  private graphics!: Phaser.GameObjects.Graphics;

  constructor(
    private scene: Phaser.Scene,
    private rows: number,
    private columns: number,
    private dimensions: { width: number, height: number },
    private reverse: boolean,
  ) {
    this.graphics = this.scene.add.graphics({ x: 0, y: 0 });
  }

  public render() {
    this.graphics.fillStyle(POINT_COLOR);

    const horizontalSpacing = this.dimensions.width / (this.rows - 1);
    const verticalSpacing = this.dimensions.height / (this.columns - 1);
    const verticalCenter = Math.floor(this.rows / 2) * horizontalSpacing;

    if (!this.reverse) {
      this.renderPoints(horizontalSpacing, verticalSpacing, verticalCenter);
    } else {
      this.renderPointsReverse(horizontalSpacing, verticalSpacing, verticalCenter);
    }
  }

  public getPositionAt(index: number) {
    return this.coordsList[index];
  }

  private renderPoints(horizontalSpacing: number, verticalSpacing: number, verticalCenter: number) {
    let index = 0;
    this.addPoint(index, verticalCenter, 0);
    index++;

    for (let i = 0; i < this.columns - 2; i++) {
      for (let j = 0; j < this.rows; j++) {
        const x = j *  horizontalSpacing;
        const y = verticalSpacing + i * verticalSpacing;

        this.addPoint(index, x, y);
        index++;
      }
    }

    this.addPoint(index, verticalCenter, this.dimensions.height);
  }

  private renderPointsReverse(horizontalSpacing: number, verticalSpacing: number, verticalCenter: number) {
    let index = 0;
    this.addPoint(index, verticalCenter, this.dimensions.height);
    index++;

    for (let i = 0; i < this.columns - 2; i++) {
      for (let j = 0; j < this.rows; j++) {
        const x = this.dimensions.width - (j *  horizontalSpacing);
        const y = this.dimensions.height - (verticalSpacing + i * verticalSpacing);

        this.addPoint(index, x, y);
        index++;
      }
    }

    this.addPoint(index, verticalCenter, 0);
  }

  private addPoint(index: number, x: number, y: number) {
    this.graphics.fillCircle(x, y, RADIUS);
    this.coordsList[index] = { x, y };

  }
}

export { BoardView };
