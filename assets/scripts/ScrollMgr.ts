import { GameConst } from "./Common/GameConst";
import CommonFunc from "./Common/CommonFunc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollMgr extends cc.Component {

    @property
    speed: number = 0;  // speed > 0 向右移動, speed < 0 向左移動

    @property
    resetX: number = 0;

    @property
    limitX: number = 0;

    @property([cc.Node])
    moveChildren: cc.Node[] = [];

    _childrenCount: number = 0;

    onLoad() {
        this._childrenCount = this.moveChildren.length;
    }

    update (dt: number) {
        if(CommonFunc.getGameStatus() !== GameConst.GAME_STATUS_END) {
            for(let i = 0, max = this.moveChildren.length; i < max; i++) {

                let x = this.moveChildren[i].x;
                
                if(x <= this.limitX) {
                    x = this.resetX;
                }

                x += this.speed * dt;                
                this.moveChildren[i].x = x;
            }     
        }   
    }
}
