import { GroundsPos, GameConst, obstaclePos, CoinPos } from "./Common/GameConst";
import GameMgr from "./GameMgr";
import CommonFunc from "./Common/CommonFunc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundMgr extends cc.Component {

    @property(cc.Prefab)
    groundPrefab:cc.Prefab = null;

    @property(cc.Prefab)
    obstaclePrefab:cc.Prefab = null;

    @property(cc.Prefab)
    coinPrefab:cc.Prefab = null;

    @property(cc.Node)
    groundsNode:cc.Node[] = [];

    private _poolCount:number = 27;
    private _showGrounds:number = 9;
    private _posY = -102;
    private _startPosX  = 240;
    private _endPosX = -240;
    private _speed = -200;
    private _gNodeLimit = -520;
    private _gNodeResetX = 1080;
    private _groundScale = 0.5;
    private _groundPools:cc.NodePool = new cc.NodePool();
    public _gameMgr = null;
    private _slowSpeed = 1;
    private static _groundMgr = null;


    //路障
    private _obstacleY = 51;
    private _showObstacles = 12;

    //金幣
    private _coinY = -1
    private _showCoins = 15;



    onLoad () {        
        this.initGroundPools();
        GroundMgr.instance();
    }

    start () {
        this.addEvent();
        this.initGrounds();
    }

    public static instance() {
        if(!this._groundMgr) {
            this._groundMgr = new GroundMgr();
        }

        return this._groundMgr;
    }

    private addEvent() {
        CommonFunc.getEventNode().on(GameConst.SLOW_SPEED, this.changeSlowSpeed, this);
    }

    private initGrounds():void {
        for(let i = 0, max = this.groundsNode.length; i < max; i++) {
            this.makeGround(this.groundsNode[i], i);
            this.makeObstacle(this.groundsNode[i], i);
            this.makeCoin(this.groundsNode[i], i);
        }
    }

    //節點上鋪上地板
    private makeGround(gNode:cc.Node, index):void {
        let grounds = GroundsPos[index];

        for(let i = 0, max = grounds.length; i < max; i++) {
            
            if(grounds[i] === 1) {
                let ground = this.popGround();
                let width = ground.width * this._groundScale;
                ground.y = this._posY;
                ground.x = this._endPosX + (width * i);
                ground.parent = gNode;
            }           
        }
    }

    //節點上鋪上路障
    private makeObstacle(gNode:cc.Node, index):void {
        let obstacles = obstaclePos[index];

        for(let i = 0, max = obstacles.length; i < max; i++) {
            
            if(obstacles[i] === 1) {
                let obstacle =  cc.instantiate(this.obstaclePrefab);
                let width = obstacle.width * obstacle.scale;
                obstacle.y = this._obstacleY;
                obstacle.x = this._endPosX + (width * i);
                obstacle.parent = gNode;
            }           
        }
    }

    //節點上鋪上金幣
    private makeCoin(gNode:cc.Node, index):void {
        let coins = CoinPos[index];

        for(let i = 0, max = coins.length; i < max; i++) {
            
            if(coins[i] === 1) {
                let coin =  cc.instantiate(this.coinPrefab);
                let width = coin.width * coin.scale;
                coin.y = this._coinY;
                coin.x = this._endPosX + (width * i);
                coin.name = "Coin";
                coin.parent = gNode;
            }           
        }
    }

    //重置節點上金幣
    private resetCoin(gNode:cc.Node, index):void {
        let coins = CoinPos[index];
        let j = 0;

        for(let i = 0, max = gNode.childrenCount; i < max; i++) {
            if(!gNode.children[i] || gNode.children[i].name != "Coin") continue;

            gNode.children[i].active = (coins[j] === 1) ? true : false;
            j+= 1;
        }
    }

    //節點上鋪滿無間隔的地板
    private fullGround(gNode:cc.Node):void {
        // for(let i = 0; i < this._showGrounds; i++) {
        //     let ground = this.popGround();
        //     ground.y = this._posY;
        //     ground.x = this._endPosX + ((ground.width * this._groundScale) * i);
        //     ground.parent = this.node;
        // }

        // for(let i = 0; i < this._showObstacles; i++) {
        //     let obstacle = cc.instantiate(this.obstaclePrefab);
        //     obstacle.y = this._obstacleY;
        //     obstacle.x = this._endPosX + ((obstacle.width * this._groundScale) * i) + 3;
        //     obstacle.parent = gNode;
        // }

        for(let i = 0; i < this._showCoins; i++) {
            let coin = cc.instantiate(this.coinPrefab);
            coin.y = this._coinY;
            coin.x = this._endPosX + ((coin.width * coin.scale) * i) + 3;
            coin.parent = gNode;
        }
    }

    private moveGround():void {
        //TODO: 移動node節點
        //當ground1抵達endNode時回收並重繪地板
        //ground1以外的照舊
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

    private resetGround():void {
        cc.log("resetGround");

        for(let i = 0, max = this.groundsNode.length; i < max; i++) {
            this.groundsNode[i].x = this._gNodeLimit + (this.groundsNode[i].width * i)

            // for(let j = this.groundsNode[i].childrenCount-1, jMax = 0; j >= jMax; j--) {
            //     cc.log(this.groundsNode[i].children[j]);
            //     this.putGround(this.groundsNode[i].children[j]);
            // }
        }

        // this.initGrounds();
    }

    public changeSlowSpeed(speed:number):void {
        this._slowSpeed = speed / 100;
    }

    update (dt) {

        if(CommonFunc.getGameStatus() === GameConst.GAME_STATUS_END) {
            return;
        } else if(CommonFunc.getGameStatus() === GameConst.GAME_STATUS_FREE) {
            return;          
        } else if(CommonFunc.getGameStatus() === GameConst.GAME_STATUS_PLAY) {
            for(let i = 0, max = this.groundsNode.length; i < max; i++) {

                let x = this.groundsNode[i].x;

                if(x <= this._gNodeLimit) {
                    
                    let index = (i - 1 < 0) ? max - 1 : i - 1;
                    
                    // x = this._gNodeResetX;
                    x = this.groundsNode[index].x + (this.groundsNode[i].width);
                    // cc.log(this.groundsNode[index].x, x, i);

                    //TODO: 金幣重生
                    this.resetCoin(this.groundsNode[i], i);
                }
                
                x += (this._speed * this._slowSpeed) * dt;
                this.groundsNode[i].x = x;
            }     

        }
    }
}
