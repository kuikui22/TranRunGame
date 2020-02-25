import { GroundsPos, GameConst } from "./Common/GameConst";
import GameMgr from "./GameMgr";
import CommonFunc from "./Common/CommonFunc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundMgr extends cc.Component {

    @property(cc.Prefab)
    groundPrefab:cc.Prefab = null;

    @property(cc.Prefab)
    obstaclePrefab:cc.Prefab = null;

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


    //路障
    private obstacleY = 51;





    onLoad () {
        this.initGroundPools();
    }

    start () {
        this.initGrounds();
    }

    private initGrounds():void {
        for(let i = 0, max = this.groundsNode.length; i < max; i++) {
            this.makeGround(this.groundsNode[i]);
        }
    }

    //節點上鋪上地板
    private makeGround(gNode:cc.Node):void {
        for(let i = 0, max = GroundsPos.length; i < max; i++) {
            for(let j = 0, jMax = GroundsPos[i].length; j < jMax; j++) {
                
                if(GroundsPos[i][j] === 1) {
                    let ground = this.popGround();
                    let width = ground.width * this._groundScale;
                    ground.y = this._posY;
                    ground.x = this._endPosX + (width * j);
                    ground.parent = gNode;
                }
            }            
        }
    }

    //節點上鋪滿無間隔的地板
    private fullGround(gNode:cc.Node):void {
        for(let i = 0; i < this._showGrounds; i++) {
            let ground = this.popGround();
            ground.y = this._posY;
            ground.x = this._endPosX + ((ground.width * this._groundScale) * i);
            ground.parent = this.node;
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
                }

                x += this._speed * dt;         
                this.groundsNode[i].x = x;
            }     

        }
    }
}
