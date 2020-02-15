import { HeroAct } from "./Common/GameConst";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {  
    
    @property(cc.Node)
    eventNode: cc.Node = null;

    @property(cc.Prefab)
    heroPrefab: cc.Prefab = null;

    @property(cc.Node)
    jumpBtn: cc.Node = null;

    @property(cc.Node)
    rollBtn: cc.Node = null;

    public _hero: cc.Node = null;
    public _heroScript = null;

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

        //TODO: 場景倒數計時、遊戲開始動畫
        this.initHero();
    }

    private addEvent():void {
        this.jumpBtn.on('click', this.clickJumpBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_START, this.clickRollBtn, this);
        this.rollBtn.on(cc.Node.EventType.TOUCH_END, this.clickRollBtnEnd, this);
    }

    //prefab載入角色
    public initHero():void {
        this._hero = cc.instantiate(this.heroPrefab);
        this.node.addChild(this._hero);
        this._hero.scale = 0.5;
        this._hero.setPosition(-92, -57);
        this._heroScript = this._hero.getComponent('Hero');

        // let self = this;        
        // cc.loader.loadRes("prefab/Hero", function (err, prefab) {
        //     if(err) {
        //         cc.log(err);
        //     } else {
        //         self._hero = cc.instantiate(prefab);
        //         self.node.addChild(self._hero);
        //         self._hero.scale = 0.5;
        //         self._hero.setPosition(-92, -57);
        //     }
        // });
    }

    public clickJumpBtn():void {
        this._heroScript.jump();
    }

    public clickRollBtn():void {
        this._heroScript.roll();
    }

    public clickRollBtnEnd(): void {
        this._heroScript.run();
    }

    // update (dt) {}
}
