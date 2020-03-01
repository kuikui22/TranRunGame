import { HeroAct, HeroStatus, GameConst, ComponentPos } from "./Common/GameConst";
import CommonFunc from "./Common/CommonFunc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    @property(cc.Node)
    CollisionNode:cc.Node = null;

    _animation:cc.Animation = null;
    _animState:any = null;
    _posY:number = -57;
    _status:HeroStatus = HeroStatus.FREE;
    _collidionNumber:number = 0;
    _width:number = 0;
    _height:number = 0;
    
    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);
        this.addEvent(); 
        this._width = this.node.width * this.node.scale;
        this._height = this.node.height * this.node.scale;

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

        this.CollisionNode.height = this._height;
        this._animState = this._animation.play(HeroAct.RUN);
        this.node.y = ComponentPos.HERO_Y;

        if(this.node.x != ComponentPos.HERO_X) {
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(1, cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y)));
        }

        // this.node.x = ComponentPos.HERO_X;
    }

    public jump():void {  
        if(this._status !== HeroStatus.PLAY) {
            return; 
        }
        
        if(this._animState.name == HeroAct.JUMP && this._animState.isPlaying) {
            return;
        }

        this.CollisionNode.height = this._height;
        let self = this;
        this.node.y = ComponentPos.HERO_Y;
        this._animState = this._animation.play(HeroAct.JUMP);
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y+60)),
            cc.moveTo(0.2 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y-100)),
            cc.callFunc(function() {
                if(self.node.y < self._posY) {
                    self.changeStatus(HeroStatus.DEAD);
                }
            })
        ));        
        
    }

    public roll():void {
        if(this._status !== HeroStatus.PLAY) {
            return; 
        }

        if(this._animState.name == HeroAct.ROLL || (this._animState.name !== HeroAct.RUN && this._animState.isPlaying)) {
            return;
        }

        this.CollisionNode.height -= 40;
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
                this.changeStatus(HeroStatus.DEAD);
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
        // if(this._status === HeroStatus.DEAD) {
        //     return;
        // }

        let self = this;

        this.node.stopAllActions();
        this._animation.stop();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.1 ,cc.v2(ComponentPos.HERO_X, ComponentPos.HERO_Y-100)),
            cc.callFunc(function() {
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
    

    update (dt) {
        if(this._status === HeroStatus.PLAY) {

            //判斷自己的座標如果被路障推超過畫面則狀態為死亡
            if(this.node.x <= ComponentPos.LEFT_DEAD_X) {
                this.changeStatus(HeroStatus.DEAD);
            }
        }
    }
}
