const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    _animation:cc.Animation = null;
    _posX:number = -92;
    _posY:number = -57;

    onLoad() {
        this._animation = this.node.getComponent(cc.Animation);        
    }

    start () {
        this.run();
    }

    public run():void {
        this.node.y = this._posY;
        this._animation.play('run');
    }

    public jump():void {        
        let self = this;
        this._animation.play('jump');
        this.node.runAction(cc.sequence(
            cc.moveTo(0.3 ,cc.v2(this._posX, this._posY+60)),
            cc.moveTo(0.2 ,cc.v2(this._posX, this._posY)),
            cc.callFunc(function() {
                self.run();
            })
        ));        
        
    }

    public roll():void {
        this._animation.play('roll');
        this.node.y = this._posY-8;
    }

    // update (dt) {}
}
