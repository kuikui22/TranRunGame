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

        public static getHeroCollisionNodeSize():Object {
            let heroNode = this.getHero();
            let scale = heroNode.scale;
            let collisionNode = heroNode.getChildByName("CollisionNode");
            
            return {
                height: collisionNode.height * scale,
                width: collisionNode.width * scale
            }
        }

        public static changeHeroPos(x:number):void {
            this.gameMgr._hero.x = x;
        }

        public static convertWorldToNodePos(curNode:cc.Node, targetNode:cc.Node):cc.Vec2 {
            let curPos = curNode.parent.convertToWorldSpaceAR(cc.v2(curNode.getPosition()));
            let resultPos = targetNode.parent.convertToNodeSpaceAR(curPos);

            return cc.v2(resultPos);
        }
}
