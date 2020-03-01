import CommonFunc from "./Common/CommonFunc";
import { GameConst } from "./Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinMgr extends cc.Component {

    private _width = 0;
    private _height = 0;

    
    start () {
        this.init();
    }

    private init() {
        this._width = this.node.width * this.node.scale;
        this._height = this.node.height * this.node.scale;


        // cc.loader.load

    }
    private isContact():boolean {
        let maxX = this.node.x + (this._width / 2);
        let minX = this.node.x - (this._width / 2);
        let maxY = this.node.y + (this._height / 2);
        let minY = this.node.y - (this._height / 2);
        let hero = CommonFunc.getHero();
        let heroPos = CommonFunc.convertWorldToNodePos(hero, this.node);
        let heroCollisionSize = CommonFunc.getHeroCollisionNodeSize();
        let heroPosX = heroPos.x + (heroCollisionSize["width"] / 2);
        let heroPosY = heroPos.y + (heroCollisionSize["height"] / 2);

        if((heroPosX <= maxX && heroPosX >= minX) && (heroPosY <= maxY && heroPosY >= minY)) {
            return true;
        }

        return false;
    }

    update (dt) {
        if(CommonFunc.getGameStatus() !== GameConst.GAME_STATUS_PLAY) {
            return;
        }

        if(this.isContact()) {
            this.node.active = false;
            CommonFunc.getEventNode().emit(GameConst.CHANGE_SCORE, 1);
        }
    }
}
