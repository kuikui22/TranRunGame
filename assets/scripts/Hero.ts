import { HeroAct, HeroStatus, GameConst, ComponentPos } from "./Common/GameConst";
import CommonFunc from "./Common/CommonFunc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    _animation:cc.Animation = null;
    _animState:any = null;
    _posY:number = -57;
    _status:HeroStatus = HeroStatus.FREE;
    _collidionNumber:number = 0;
    
    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        this.addEvent(); 
    }

    start () {        
        this.run();
    }

    addEvent() {
        CommonFunc.getEventNode().on(GameConst.CHANGE_HERO_STATUS, this.changeStatus, this);
    }

    public run():void {
        if(this._status !== HeroStatus.PLAY) {
           return; 
        }

        this._animState = this._animation.play(HeroAct.RUN);
        this.node.y = ComponentPos.HERO_Y;
    }

    public jump():void {  
        if(this._status !== HeroStatus.PLAY) {
            return; 
        }
        
        if(this._animState.name == HeroAct.JUMP && this._animState.isPlaying) {
            return;
        }

        let self = this;
        this.node.y = ComponentPos.HERO_Y;
        this._animState = this._animation.play(HeroAct.JUMP);
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y+60)),
            cc.moveTo(0.2 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y-100)),
            cc.callFunc(function() {
                if(self.node.y <= self._posY) {
                    self.dead();
                }
            })
        ));        
        
    }

    public roll():void {
        if(this._status !== HeroStatus.PLAY) {
            return; 
        }

        this._animState = this._animation.play(HeroAct.ROLL);
        this.node.y = ComponentPos.HERO_Y-8;
    }

    onCollisionEnter(other:any, self:any) {
        this._collidionNumber += 1;
        
        if(this._animState && this._animState.name == HeroAct.JUMP) {
            this.node.stopAllActions();
            this.node.y = ComponentPos.HERO_Y;
            this.run();
        }
        
        // this.node.color = cc.Color.RED;
    }
    
    onCollisionStay(other:any, self:any) {
        // console.log('on collision stay');
    }

    onCollisionExit(other:any, self:any) {
        this._collidionNumber -= 1;
        
        if(this._collidionNumber <= 0) {
            // this.node.color = cc.Color.WHITE;
            this._collidionNumber = 0;
            
            //離開碰撞時下墜低於地板
            if(this.node.y <= ComponentPos.HERO_Y) {
                this.dead();
            }

        }

    }

    private changeStatus(status:HeroStatus):void {
        this._status = status;

        switch (this._status) {
            case HeroStatus.DEAD:
                this.dead();
                break;
            case HeroStatus.FREE:
                this.free();
                break;  
            case HeroStatus.PLAY:
                // cc.log("play....");
                this.run();
                break;      
            default:
                break;
        }
    }

    public getStatus():number {
        return this._status;
    }

    private dead():void {
        if(this._status === HeroStatus.DEAD) {
            return;
        }

        let self = this;

        this.node.stopAllActions();
        this._animation.stop();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.1 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y-100)),
            cc.callFunc(function() {
                self.changeStatus(HeroStatus.DEAD);
                CommonFunc.getEventNode().emit(GameConst.CHANGE_STATUS, GameConst.GAME_STATUS_END);
            })
        ));       
    }

    private free():void {
        this.node.stopAllActions();
        this.node.y = ComponentPos.HERO_Y;
    }

    private play():void {

    }
    

    //TODO: 判斷自己的座標

    // update (dt) {}
}
