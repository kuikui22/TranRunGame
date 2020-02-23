import { HeroAct, HeroStatus } from "./Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    _animation:cc.Animation = null;
    _animState:any = null;
    _posX:number = -92;
    _posY:number = -50;
    _status:number = HeroStatus.PLAY;
    _collidionNumber:number = 0;
    
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
        this.node.y = this._posY;
        this._animState = this._animation.play(HeroAct.JUMP);
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3 ,cc.v2(this._posX, this._posY+60)),
            cc.moveTo(0.2 ,cc.v2(this._posX, this._posY-100)),
            cc.callFunc(function() {
                // self.run();
            })
        ));        
        
    }

    public roll():void {
        this._animState = this._animation.play(HeroAct.ROLL);
        this.node.y = this._posY-10;
    }

    onCollisionEnter(other:any, self:any) {
        this._collidionNumber += 1;
        
        if(this._animState && this._animState.name == HeroAct.JUMP) {
            this.node.stopAllActions();
            this.node.y = this._posY;
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
            if(this.node.y <= this._posY) {
                this.node.stopAllActions();
                this.node.runAction(
                    cc.moveTo(0.1 ,cc.v2(this._posX, this._posY-100))
                );                
                this.changeStatus(HeroStatus.DEAD);
                cc.log("GameOver....");
            }

        }

    }

    private changeStatus(status:number):void {
        this._status = status;
    }

    public getStatus():number {
        return this._status;
    }

    //TODO: 角色狀態機
    

    // update (dt) {}
}
