const RADIUS = 2;
const POINT_COLOR = 0x0b0694;

class BoardView {
  private coordsList: Array<{ x: number; y: number }> = [];

  constructor(
    private graphics: Phaser.GameObjects.Graphics,
    private rows: number,
    private columns: number,
    private dimensions: { width: number, height: number },
  ) {

  }

  public render() {
    this.renderPoints();
  }

  public getCoordsAt(index: number) {
    return this.coordsList[index];
  }

  private renderPoints() {
    const horizontalSpacing = this.dimensions.width / (this.rows - 1);
    const verticalSpacing = this.dimensions.height / (this.columns - 1);
    const verticalCenter = Math.floor(this.rows / 2) * horizontalSpacing;

    this.graphics.fillStyle(POINT_COLOR);
    let index = 0;
    this.addPoint(index, verticalCenter, 0);
    index++;

    for (let i = 0; i < this.columns - 2; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.addPoint(index,j *  horizontalSpacing, verticalSpacing + i * verticalSpacing);
        index++;
      }
    }

    this.addPoint(index, verticalCenter, this.dimensions.height);
  }

  private addPoint(index: number, x: number, y: number) {
    this.graphics.fillCircle(x, y, RADIUS);
    this.coordsList[index] = { x, y };

  }
}

export { BoardView };
