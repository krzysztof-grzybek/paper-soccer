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

  public getOponentinfo() {
    return FBInstant.context.getPlayersAsync().then((players) => {

      const oponent = players.find(p => p.getID() !== FBInstant.player.getID());
      // TODO: handle this case
      if (!oponent) {
        throw new Error('Currently only messenger game is allowed.');
      }

      // TODO: figure out when these values could be zero
      return {
        id: oponent.getID()!,
        name: oponent.getName()!,
        image: oponent.getPhoto()!,
      };
    });
  }
}

export { FacebookService };
