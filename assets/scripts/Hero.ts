import { HeroAct } from "./Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    _animation:cc.Animation = null;
    _animState:any = null;
    _posX:number = -92;
    _posY:number = -57;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);        
    }

    start () {
        this.run();
    }

    public run():void {
        this._animState = this._animation.play(HeroAct.RUN);
        this.node.y = this._posY;
    }

    public jump():void {      
        if(this._animState.name == HeroAct.JUMP && this._animState.isPlaying) {
            return;
        }

        let self = this;
        this._animState = this._animation.play(HeroAct.JUMP);
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3 ,cc.v2(this._posX, this._posY+60)),
            cc.moveTo(0.2 ,cc.v2(this._posX, this._posY)),
            cc.callFunc(function() {
                self.run();
            })
        ));        
        
    }

    public roll():void {
        this._animState = this._animation.play(HeroAct.ROLL);
        this.node.y = this._posY-8;
    }

    // update (dt) {}
}
