import { FacebookService } from './facebookService';

interface PlayerInfo {
  id: number | string;
  name: string;
  image: string;
}

abstract class PlatformServiceAbstract {
  public abstract getCurrentPlayerInfo(): PlayerInfo;
  public abstract getOpponentInfo(): Promise<PlayerInfo>;
}

// @ts-ignore
let platformService: FacebookService = new FacebookService(); // TODO: figure out how to add it to game instance
function bootstrap() {
  platformService = new FacebookService();
}
export { bootstrap, PlatformServiceAbstract, platformService };
