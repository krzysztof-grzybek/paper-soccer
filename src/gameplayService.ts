class GameplayService {
  public getGame(id: string) {
    // TODO: make http call
    return Promise.resolve({
      id,
    });
  }
}

const gameplayService = new GameplayService();
export { gameplayService };
