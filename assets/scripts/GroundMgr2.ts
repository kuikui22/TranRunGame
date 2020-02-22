const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    groundPrefab: cc.Prefab = null;

    private _poolCount:number = 15;
    private _showGrounds:number = 15;
    private _posY = -102;
    private _startPosX  = 276;
    private _endPosX = -285;
    private _speed = 200;
    private _dis = 0;
    private _groundPools:cc.NodePool = new cc.NodePool();


    onLoad () {
        this._dis = this.calcDistance(this._startPosX, this._posY, this._endPosX, this._posY);
        this.initGroundPools();
    }

    start () {
        this.initGrounds();
        this.moveGrounds();
    }

    private initGrounds():void {
        for(let i = 0; i < this._showGrounds; i++) {
            let ground = this.popGround();
            ground.y = this._posY;
            ground.x = this._endPosX + ((ground.width) * (i + 1));
            ground.parent = this.node;
        }
    }

    private moveGrounds():void {
        let count = this.node.childrenCount;
        let self = this;

        for(let i = 0; i < count; i++) {
            let child = this.node.children[i];
            let posDis = this.calcDistance(child.x, child.y, this._endPosX, this._posY);
            let time = posDis / this._speed;

            child.runAction(cc.sequence(
                cc.moveTo(time, cc.v2(this._endPosX, this._posY)),
                cc.callFunc(function() {
                    self.putGround(child[i]);
                    self.creatGround();
                }.bind(self))
            ));
        }        
    }

    private creatGround(delay:number = 0):void {
        let self = this;
        let ground = this.popGround();
        let time = this._dis / this._speed;   //D = S * T;   T = D / S

        //TODO: 隨機算一個間隔的delay time
        // 0 -> 不間隔, n -> 間隔一格
        // 有一個ground延遲n秒, 下一個也需延遲n秒播放
        // let delayTime = Math.floor(Math.random());

        self.node.addChild(ground);
        ground.setPosition(cc.v2(this._startPosX, this._posY));
        ground.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.moveTo(time, cc.v2(this._endPosX, this._posY)),
            cc.callFunc(function() {
                self.putGround(ground);
                self.creatGround();
            })
        ));
    }

    private initGroundPools():void {
        for(let i = 0; i < this._poolCount; i++) {
            let ground = cc.instantiate(this.groundPrefab);
            this._groundPools.put(ground);
        }
    }

    private popGround():cc.Node {
        let ground = null;

        if(this._groundPools.size() == 0) {
            ground = cc.instantiate(this.groundPrefab);
        } else {
            ground = this._groundPools.get();
        }

        return ground;
    }

    private putGround(ground:cc.Node):void {
        if(ground) {
            ground.stopAllActions();
            this._groundPools.put(ground);
        }
    }

    public calcDistance(x:number, y:number, x1:number, y1:number):number {
        let disX = Math.pow((x1 - x), 2);
        let disY = Math.pow((y1 - y), 2);
        let result = Math.sqrt(disX + disY);
        return result;
    }

    // update (dt) {}
}
