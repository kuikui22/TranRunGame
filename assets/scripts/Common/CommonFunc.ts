import { GameConst } from "./GameConst";
import GameMgr from "../GameMgr";

export default class CommonFunc {
        private static gameMgr:GameMgr = null;

        public static getEventNode(): cc.Node {
            return cc.director.getScene().getChildByName('EventNode');
        }

        public static setGameMgr(gameMgr:GameMgr):void {
            this.gameMgr = gameMgr;
        }

        public static getGameStatus():GameConst {
            return this.gameMgr.getStatus();
        }

        public static getHero():cc.Node {
            return this.gameMgr._hero;
        }

        public static changeHeroPos(x:number):void {
            this.gameMgr._hero.x = x;
        }
}
