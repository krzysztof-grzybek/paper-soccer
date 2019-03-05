class Vertex<T> {
  constructor(public id: number, public data: T) {}
}

class Edge<P> {
  constructor(public relatedVertexId: number, public data: P){}
}

class Graph<T, P> {
  private verticies: Vertex<T>[] = [];
  private adjacencyList: Edge<P>[][] = [];

  public addVertex(id: number, data: T) {
    const vertex = new Vertex(id, data);
    this.verticies.push(vertex);
    this.adjacencyList.push([]);
  }

  public addEdge(vertexAId: number, vertexBId: number, data: P) {
    const { lower, higher } = this.getVerticiesIndicies(vertexAId, vertexBId);

    const edge = new Edge(higher, data); // adjacency list is symmetric, we use only upper-right part
    this.adjacencyList[lower].push(edge);
  }

  public getEdge(vertexAId: number, vertexBId: number): Edge<P> | null {
    const { lower, higher } = this.getVerticiesIndicies(vertexAId, vertexBId);
    return this.adjacencyList[lower].find(edge => edge.relatedVertexId === higher) || null;
  }

  public forEachVertex(callback: (vertex: Vertex<T>) => void) {
    this.verticies.forEach(callback)
  }

  private getVerticiesIndicies(vertexAId: number, vertexBId: number) {
    const vertexAIndex = this.verticies.findIndex(v => v.id === vertexAId);
    const vertexBIndex = this.verticies.findIndex(v => v.id === vertexBId);
    const lower = Math.min(vertexAIndex, vertexBIndex);
    const higher = Math.max(vertexAIndex, vertexBIndex);

    return { lower, higher };
  }
}
