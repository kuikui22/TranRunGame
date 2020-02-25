import { ComponentPos, GameConst } from "./Common/GameConst";
import CommonFunc from "./Common/CommonFunc";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ObstacleMgr extends cc.Component {

    private _width = 0;
    private _height = 0;
    private _contactY = 0;
    private _contactX = 0;



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
        let curPos = hero.parent.convertToWorldSpaceAR(cc.v2(hero.getPosition()));
        let heroPos = this.node.parent.convertToNodeSpaceAR(curPos);
        // cc.log(heroPos);
        let heroPosX = heroPos.x;
        let heroPosY = heroPos.y;

        if((heroPosX <= maxX && heroPosX >= minX) && (heroPosY <= maxY && heroPosY >= minY)) {
            return true;
        }

        return false;
    }

    //TODO: 在每一幀的時候確認自己的包圍盒是否與人物的包圍盒相交
    //TODO: 如果與人物包圍盒相交則改變人物的座標



    update (dt) {
        if(CommonFunc.getGameStatus() !== GameConst.GAME_STATUS_PLAY) {
            return;
        }

        if(this.isContact()) {
            cc.log("contact.........");
            this.node.color = cc.Color.RED;
            CommonFunc.changeHeroPos(this.node.x - (this._width / 2));
        } else {
            this.node.color = cc.Color.WHITE;
        }
    }
}
