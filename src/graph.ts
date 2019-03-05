class Graph<T> {
  private verticies: T[] = [];
  private adjacencyList: number[][] = [];

  public addVertex(data: T) {
    this.verticies.push(data);
    this.adjacencyList.push([]);
  }

  public addEdge(vertexAIndex: number, vertexBIndex: number) {
    const lower = Math.min(vertexAIndex, vertexBIndex);
    const higher = Math.max(vertexAIndex, vertexBIndex);

    this.adjacencyList[lower].push(higher); // adjacency list is symmetric, we use only upper-right part
  }

  public hetEdge(vertexAIndex: number, vertexBIndex: number): boolean {
    const lower = Math.min(vertexAIndex, vertexBIndex);
    const higher = Math.max(vertexAIndex, vertexBIndex);

    return this.adjacencyList[lower].some(i => i === higher);
  }

  public forEachVertex(callback: (vertex: T) => void) {
    this.verticies.forEach(callback)
  }
}

export { Graph };
