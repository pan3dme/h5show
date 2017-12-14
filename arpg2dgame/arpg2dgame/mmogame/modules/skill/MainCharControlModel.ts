class MainCharControlModel {
    private static _instance: MainCharControlModel;
    public static getInstance(): MainCharControlModel {
        if (!this._instance) {
            this._instance = new MainCharControlModel();
        }
        return this._instance;
    }
    public constructor() {

    }
    public sendStop(): void {
        var $mainChar: SceneChar = GameInstance.mainChar;
        $mainChar.stopMove();
        if ($mainChar.unit) {
            var $arr: Array<Vector2D> = [$mainChar.getAstarPos(), $mainChar.getAstarPos()];
            $mainChar.unit.sendPath($arr);
        }


    }
    public setWalkPathFun($item: Array<Vector2D>, $bfun: Function = null): void {

        if (SceneManager.getInstance().ready) {
            var mainChar: SceneChar = GameInstance.mainChar;
            this.sendPath($item);
            $item.shift();
            mainChar.applyWalk($item);
            mainChar.walkCompleteBackFun = $bfun


        }
    }
    public sendPath($ary: Array<Vector2D>): void {
        var mainChar: SceneChar = GameInstance.mainChar;
        if (mainChar.unit) {
            mainChar.unit.sendPath($ary);
            // console.log("发送移动线路--------------",TimeUtil.getTimer())
        }
    }
    public clikEat(): void {
        var $cdTime: number = tb.SkillData.getCdMeshBySkillId(SharedDef.PLAYER_INT_FIELD_RESTORE_POTION_CD);
        if (isNaN($cdTime) || ($cdTime - TimeUtil.getTimer()) < 0) {
            tb.SkillData.setCdMeshData(SharedDef.PLAYER_INT_FIELD_RESTORE_POTION_CD, 12 * 1000)
            NetManager.getInstance().protocolos.use_restore_potion();
              console.log("发送吃药")
        } else {
            //  console.log("clikEatCd中")
        }
    }
}