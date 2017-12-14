var MainCharControlModel = /** @class */ (function () {
    function MainCharControlModel() {
    }
    MainCharControlModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new MainCharControlModel();
        }
        return this._instance;
    };
    MainCharControlModel.prototype.sendStop = function () {
        var $mainChar = GameInstance.mainChar;
        $mainChar.stopMove();
        if ($mainChar.unit) {
            var $arr = [$mainChar.getAstarPos(), $mainChar.getAstarPos()];
            $mainChar.unit.sendPath($arr);
        }
    };
    MainCharControlModel.prototype.setWalkPathFun = function ($item, $bfun) {
        if ($bfun === void 0) { $bfun = null; }
        if (SceneManager.getInstance().ready) {
            var mainChar = GameInstance.mainChar;
            this.sendPath($item);
            $item.shift();
            mainChar.applyWalk($item);
            mainChar.walkCompleteBackFun = $bfun;
        }
    };
    MainCharControlModel.prototype.sendPath = function ($ary) {
        var mainChar = GameInstance.mainChar;
        if (mainChar.unit) {
            mainChar.unit.sendPath($ary);
            // console.log("发送移动线路--------------",TimeUtil.getTimer())
        }
    };
    MainCharControlModel.prototype.clikEat = function () {
        var $cdTime = tb.SkillData.getCdMeshBySkillId(SharedDef.PLAYER_INT_FIELD_RESTORE_POTION_CD);
        if (isNaN($cdTime) || ($cdTime - TimeUtil.getTimer()) < 0) {
            tb.SkillData.setCdMeshData(SharedDef.PLAYER_INT_FIELD_RESTORE_POTION_CD, 12 * 1000);
            NetManager.getInstance().protocolos.use_restore_potion();
            console.log("发送吃药");
        }
        else {
            //  console.log("clikEatCd中")
        }
    };
    return MainCharControlModel;
}());
//# sourceMappingURL=MainCharControlModel.js.map