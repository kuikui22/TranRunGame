
const {ccclass, property} = cc._decorator;

@ccclass
export default class ColliderMgr extends cc.Component {

    _collidionNumber = null;

    onLoad () {
        this.init();
    }

    start () {

    }

    private init() {
        
    }

    onCollisionEnter(other:any, self:any) {
        this._collidionNumber += 1;        
        this.node.color = cc.Color.RED;
    }
    
    onCollisionStay(other:any, self:any) {
        // console.log('on collision stay');
    }

    onCollisionExit(other:any, self:any) {
        this._collidionNumber -= 1;
        // console.log('on collision exit');
        
        if(this._collidionNumber <= 0) {
            this.node.color = cc.Color.WHITE;
            this._collidionNumber = 0;
        }
    }

    // update (dt) {}
}
