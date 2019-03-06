const RADIUS = 2;
const POINT_COLOR = 0x0b0694;

class BoardView {
  constructor(
    private graphics: Phaser.GameObjects.Graphics,
    private columns: number,
    private rows: number,
    private dimensions: { width: number, height: number },
  ) {}

  public render() {
    this.renderPoints();
  }

  private renderPoints() {
    const horizontalSpacing = this.dimensions.width / (this.rows - 1);
    const verticalSpacing = this.dimensions.height / (this.columns - 1);
    const verticalCenter = Math.floor(this.rows / 2) * horizontalSpacing;

    this.graphics.fillStyle(POINT_COLOR);
    this.graphics.fillCircle(verticalCenter, 0, RADIUS);

    for (let i = 0; i < this.columns - 2; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.graphics.fillCircle(j *  horizontalSpacing, verticalSpacing + i * verticalSpacing, RADIUS);
      }
    }

    this.graphics.fillCircle(verticalCenter, this.dimensions.height, RADIUS);
  }
}

export { BoardView };
