import { platformService, PlatformServiceAbstract } from './platformService';

class PlayerService {
  constructor(private platform: PlatformServiceAbstract) {

  }

  public getCurrentPlayerInfo() {
    return this.platform.getCurrentPlayerInfo();
  }

  public getOponentinfo() {
    return this.platform.getOponentinfo();
  }
}

const playerService = new PlayerService(platformService); // TODO: figure out how to do this to game object
export { playerService };
