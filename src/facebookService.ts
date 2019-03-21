import { PlatformServiceAbstract } from './platformService';

class FacebookService implements PlatformServiceAbstract {
  public getCurrentPlayerInfo() {
    // TODO: figure out when these values could be zero
    return {
      id: FBInstant.player.getID()!,
      name: FBInstant.player.getName()!,
      image: FBInstant.player.getPhoto()!,
    };
  }

  public getOpponentInfo() {
    return FBInstant.context.getPlayersAsync().then((players) => {

      const opponent = players.find(p => p.getID() !== FBInstant.player.getID());

      if (!opponent) {
        throw new Error('Currently only messenger game is allowed.');
      }
      console.log(opponent.getName());

      // TODO: figure out when these values could be zero
      return {
        id: opponent.getID()!,
        name: opponent.getName()!,
        image: opponent.getPhoto()!,
      };
    });
  }
}

export { FacebookService };
