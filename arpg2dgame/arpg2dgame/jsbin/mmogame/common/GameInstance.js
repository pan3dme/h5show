var QuestMoveVo = /** @class */ (function () {
    function QuestMoveVo() {
    }
    return QuestMoveVo;
}());
var GameInstance = /** @class */ (function () {
    function GameInstance() {
    }
    GameInstance.getGameEndMillisecond = function ($endT) {
        return TimeUtil.getTimer() + ($endT - GameInstance.gameSyncTime.time_now) * 1000;
    };
    GameInstance.getGameSecond = function ($endT) {
        // var $a: number = Math.floor(GameInstance.gameSyncTime.time_now + (TimeUtil.getTimer() - GameInstance.gameSyncClientTime) / 1000);
        var $a = this.getServerNow();
        return $endT - $a;
    };
    GameInstance.getServerNow = function () {
        var $t = (TimeUtil.getTimer() - GameInstance.appSyncClientTime) / 1000 + GameInstance.appSynctTime.time_now;
        return float2int($t);
    };
    Object.defineProperty(GameInstance, "threeBattarId", {
        get: function () {
            return this._threeBattarId;
        },
        set: function (value) {
            this._threeBattarId = value;
            //console.log("this._threeBattarId", this._threeBattarId)
        },
        enumerable: true,
        configurable: true
    });
    GameInstance.init = function () {
        ModuleEventManager.dispatchEvent(new LoginEvent(LoginEvent.LOGIN_CONNET_EVENT));
        ModuleEventManager.dispatchEvent(new SceneEvent(SceneEvent.SCENE_ENTER_INIT));
    };
    Object.defineProperty(GameInstance, "attackTarget", {
        get: function () {
            return GameInstance._attackTarget;
        },
        set: function (value) {
            if (GameInstance._attackTarget) {
                GameInstance._attackTarget.removePart(SceneChar.SEL_PART);
            }
            GameInstance._attackTarget = value;
            if (GameInstance._attackTarget) {
                GameInstance._attackTarget.addPart(SceneChar.SEL_PART, SceneChar.NONE_SLOT, getModelUIUrl("6301"));
            }
        },
        enumerable: true,
        configurable: true
    });
    GameInstance.addSceneChar = function ($char) {
        this.roleList.push($char);
        SceneManager.getInstance().addMovieDisplay($char);
        // if($char.mountChar){
        //     SceneManager.getInstance().addMovieDisplay($char.mountChar);
        // }
    };
    GameInstance.removeSceneChar = function ($char) {
        this.removeAttackTarget($char);
        var index = this.roleList.indexOf($char);
        if (index != -1) {
            this.roleList.splice(index, 1);
        }
        SceneManager.getInstance().removeMovieDisplay($char);
        // if($char.mountChar){
        //     SceneManager.getInstance().removeMovieDisplay($char.mountChar);
        // }
    };
    GameInstance.clearRoleList = function () {
        while (this.roleList && this.roleList.length) {
            SceneCharManager.getInstance().removeSceneChar(this.roleList.pop());
        }
    };
    GameInstance.removeAttackTarget = function ($char) {
        if (GameInstance.attackTarget == $char) {
            //  console.log("-------------移除攻击目标------")
            GameInstance.attackTarget = null;
        }
    };
    GameInstance.getSceneCharByID = function ($id) {
        for (var i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i].id == $id) {
                return this.roleList[i];
            }
        }
        return null;
    };
    GameInstance.initGameConfig = function () {
    };
    GameInstance.intLoadScene = function ($url) {
        if (SceneManager.getInstance().testUrl($url)) {
        }
        else {
            UIManager.getInstance().removeAll();
        }
        GameInstance.setMapData();
        GameInstance.loadScene($url, this.configFinish);
    };
    //public static test(): void {
    //    var movie: Display2dMovie = new Display2dMovie();
    //    movie.initData(6, 1, 40 / 512, 40 / 128, 12);
    //    movie.setUrl("rolemovie/gjs_00.png");
    //    movie.play(CharAction.ATTACK_01);
    //    SceneManager.getInstance().addDisplay2D(movie);
    //}
    GameInstance.loadScene = function (name, completeFun, progressFun) {
        if (completeFun === void 0) { completeFun = null; }
        if (progressFun === void 0) { progressFun = null; }
        GameInstance.mapName = name;
        GameInstance.loadComplteFun = completeFun;
        GameInstance.loadProgressFun = progressFun;
        var evt = new EngineEvent(EngineEvent.CREAT_SCENE_EVENT);
        evt.sceneName = GameInstance.mapName;
        evt.sceneLoadcomplteFun = GameInstance.mainSceneComplete;
        evt.sceneAnylsizFun = GameInstance.mainSceneAnalysisComplete;
        evt.sceneProgressFun = GameInstance.mainSceneProgress;
        ModuleEventManager.dispatchEvent(evt);
    };
    GameInstance.setMapData = function () {
        //  Scene_data.focus3D.rotationY = 0;
        Scene_data.focus3D.rotationY = 0;
        Scene_data.focus3D.rotationX = -45;
        Scene_data.cam3D.distance = 250;
        Scene_data.focus3D.x = 0;
        Scene_data.focus3D.z = 0;
        Scene_data.focus3D.y = 0;
        SceneManager.mapQudaTreeDistance = 2000;
    };
    GameInstance.mainSceneAnalysisComplete = function () {
        if (GameInstance.loadComplteFun) {
            GameInstance.loadComplteFun();
        }
    };
    GameInstance.configFinish = function () {
    };
    GameInstance.firstEnterScene = function () {
        if (GameInstance.first) {
            return;
        }
        GameInstance.first = true;
        GameData.configData.read();
    };
    GameInstance.mainSceneComplete = function () {
        //  SceneGroundModel.getInstance().initData();
        ModuleEventManager.dispatchEvent(new SceneEvent(SceneEvent.SCENE_ENTER_MAP));
    };
    GameInstance.mainSceneProgress = function (num) {
        if (GameInstance.loadProgressFun) {
            GameInstance.loadProgressFun(num);
        }
    };
    GameInstance.roleList = new Array;
    GameInstance.bagCdItem = new Object;
    GameInstance.useYaoGan = false;
    GameInstance._threeBattarId = 0; //三连击序号 换场景从0开始
    GameInstance.first = false;
    return GameInstance;
}());
//# sourceMappingURL=GameInstance.js.map