import CommonFunc from "./Common/CommonFunc";
import { GameConst, HeroStatus } from "./Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {  
    
    @property(cc.Node)
    eventNode: cc.Node = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    @property(cc.Node)
    GroundNode: cc.Node = null;

    @property(cc.Node)
    jumpBtn: cc.Node = null;

    @property(cc.Node)
    rollBtn: cc.Node = null;

    @property(cc.Node)
    GameEndWindow: cc.Node = null;

    @property(cc.Node)
    restartBtn: cc.Node = null;

    public _hero: cc.Node = null;
    public _heroScript = null;
    private _status = GameConst.GAME_STATUS_FREE;

    private static instance: GameMgr = null;
	/**
	 * 获取实例的静态方法实例
	 * @return GameMgr
	 *
	 */
	public static getInstance(): GameMgr {
		if (!this.instance) {
			this.instance = new GameMgr();
		}
		return this.instance;
	}
    
    onLoad () {        
        this.addEvent();
    }

    start () {

        this.init();
        //TODO: 場景倒數計時、遊戲開始動畫
        this.initHero();
    }

    private addEvent():void {
        CommonFunc.getEventNode().on(GameConst.CHANGE_STATUS, this.changeStatus, this);
        this.jumpBtn.on(cc.Node.EventType.TOUCH_START, this.clickJumpBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_START, this.clickRollBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_END, this.clickRollBtnEnd, this);
        this.restartBtn.on(cc.Node.EventType.TOUCH_END, this.clickRestartBtn, this);

        //test
        this.node.getChildByName("GameStartWindow").getChildByName('button').on(cc.Node.EventType.TOUCH_END, this.testStart, this);
    }

    private init():void {
        CommonFunc.setGameMgr(this);
        cc.director.getCollisionManager().enabled = true;
        this.GameEndWindow.active = false;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    //prefab載入角色
    public initHero():void {
        this._hero = cc.instantiate(this.heroPrefab);
        this.node.addChild(this._hero);
        this._hero.scale = 0.5;
        this._hero.setPosition(-92, -57);
        this._heroScript = this._hero.getComponent('Hero');
    }

    public clickJumpBtn():void {
        this._heroScript.jump();
    }

    public clickRollBtn():void {
        this._heroScript.roll();
    }

    public clickRollBtnEnd():void {
        this._heroScript.run();
    }

    public clickRestartBtn():void {
        this.changeStatus(GameConst.GAME_STATUS_FREE);
        this.GameEndWindow.active = false;
        this.node.getChildByName("GameStartWindow").active = true;
    }

    private playPrepareAnim():void {
        //TODO: 播放倒數動畫
    }

    private changeStatus(status:GameConst):void {
        cc.log("changeStatus", status);
        this._status = status;

        switch (this._status) {
            case GameConst.GAME_STATUS_END:
                //TODO: 顯示結束畫面
                cc.log("GAME END !!!");
                this.GameEndWindow.active = true;
                break;   
            case GameConst.GAME_STATUS_FREE:
                CommonFunc.getEventNode().emit(GameConst.CHANGE_HERO_STATUS, HeroStatus.FREE);
                break;   
            case GameConst.GAME_STATUS_PLAY:
                CommonFunc.getEventNode().emit(GameConst.CHANGE_HERO_STATUS, HeroStatus.PLAY);
                break;    
            default:
                break;
        }
    }

    public getStatus():GameConst {
        return this._status;
    }

    public testStart():void {
        this.changeStatus(GameConst.GAME_STATUS_PLAY);
        this.node.getChildByName("GameStartWindow").active = false;
    }

    // update (dt) {}
}
