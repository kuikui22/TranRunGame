const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMgr extends cc.Component {    

    // @property
    // text: string = 'hello';

    _hero: cc.Node = null;
    
    onLoad () {
        this.initHero();
    }

    start () {

        //TODO: 場景倒數計時、遊戲開始動畫
        
    }

    //prefab載入角色
    public initHero():void {
        let self = this;
        
        cc.loader.loadRes("prefab/Hero", function (err, prefab) {
            if(err) {
                cc.log(err);
            } else {
                self._hero = cc.instantiate(prefab);
                self.node.addChild(self._hero);
                self._hero.scale = 0.5;
                self._hero.setPosition(-92, -57);
            }
        });
    }

    public clickJumpBtn():void {
        //TODO: 跳按鈕
    }

    public clickRollBtn():void {
        //TODO: 滾按鈕
    }

    // update (dt) {}
}
