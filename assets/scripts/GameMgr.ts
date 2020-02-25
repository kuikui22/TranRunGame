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

    @property(cc.Node)
    cutdownNode: cc.Node = null;

    public _hero: cc.Node = null;
    public _heroScript = null;
    private _status = GameConst.GAME_STATUS_FREE;
    public _cutdownNum = 5;

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
        this.playCutdownAnim();
    }

    private addEvent():void {
        CommonFunc.getEventNode().on(GameConst.CHANGE_STATUS, this.changeStatus, this);
        this.jumpBtn.on(cc.Node.EventType.TOUCH_START, this.clickJumpBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_START, this.clickRollBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_END, this.clickRollBtnEnd, this);
        this.restartBtn.on(cc.Node.EventType.TOUCH_END, this.clickRestartBtn, this);
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
    }

    //播放倒數動畫
    private playCutdownAnim():void {
        let self = this;
        let label = this.cutdownNode.getChildByName('label');
        label.scale = 1;
        label.stopAllActions();
        label.getComponent(cc.Label).string = this._cutdownNum.toString();
        let action = cc.scaleTo(0.5, 1.3);
        let timeDelay = 0;
        this.cutdownNode.active = true;

        for(let i = this._cutdownNum - 1; i >= -1; i--) {

            label.runAction(cc.sequence(
                cc.delayTime(timeDelay),
                action.easing(cc.easeBackOut()),
                cc.scaleTo(0.5, 1),
                cc.callFunc(function(target, num) {
                    if(num < 0) {
                        self.cutdownNode.active = false;                    
                        self.changeStatus(GameConst.GAME_STATUS_PLAY);
                        return;
                    }

                    target.getComponent(cc.Label).string = num;  

                }, label, i)
            ));

            timeDelay += 1;
        }        
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
                this.readyGame();
                break;   
            case GameConst.GAME_STATUS_PLAY:
                this.startGame();
                break;    
            default:
                break;
        }
    }

    public getStatus():GameConst {
        return this._status;
    }

    private readyGame():void {
        cc.log('readyGame....');
        this.playCutdownAnim();
        CommonFunc.getEventNode().emit(GameConst.CHANGE_HERO_STATUS, HeroStatus.FREE);
        this.GroundNode.getComponent('GroundMgr').resetGround();
    }

    private startGame():void {
        CommonFunc.getEventNode().emit(GameConst.CHANGE_HERO_STATUS, HeroStatus.PLAY);
    }

    // update (dt) {}
}
