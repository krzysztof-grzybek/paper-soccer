class Graph<T> {
  private verticies: T[] = [];
  private adjacencyList: number[][] = [];

  public addVertex(data: T) {
    this.verticies.push(data);
    this.adjacencyList.push([]);
  }

  public addEdge(vertexAIndex: number, vertexBIndex: number) {
    this.adjacencyList[vertexAIndex].push(vertexBIndex);
    this.adjacencyList[vertexBIndex].push(vertexAIndex);
  }

  public getVertexData(vertexIndex: number) {
    return this.verticies[vertexIndex];
  }

  public hasEdge(vertexAIndex: number, vertexBIndex: number): boolean {
    return this.adjacencyList[vertexAIndex].some(i => i === vertexBIndex);
  }

  public getAdjacentVerticies(vertexIndex: number) {
    return this.adjacencyList[vertexIndex];
  }

  public forEachVertex(callback: (vertex: T) => void) {
    this.verticies.forEach(callback);
  }

  public getVerticiesAmount() {
    return this.verticies.length;
  }
}

export { Graph };
