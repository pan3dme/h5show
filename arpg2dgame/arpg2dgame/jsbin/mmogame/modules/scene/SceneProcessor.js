var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SceneEvent = /** @class */ (function (_super) {
    __extends(SceneEvent, _super);
    function SceneEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneEvent.SCENE_ENTER_INIT = "SCENE_ENTER_INIT";
    SceneEvent.SCENE_ENTER_MAP = "SCENE_ENTER_NEW";
    SceneEvent.SCENE_RESET_MAIN_FOCUT = "SCENE_RESET_MAIN_FOCUT";
    return SceneEvent;
}(BaseEvent));
var SceneModule = /** @class */ (function (_super) {
    __extends(SceneModule, _super);
    function SceneModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneModule.prototype.getModuleName = function () {
        return "SceneModule";
    };
    SceneModule.prototype.listProcessors = function () {
        return [new SceneProcessor()];
    };
    return SceneModule;
}(Module));
var SceneProcessor = /** @class */ (function (_super) {
    __extends(SceneProcessor, _super);
    function SceneProcessor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fristEnter = true;
        return _this;
    }
    SceneProcessor.prototype.getName = function () {
        return "SceneProcessor";
    };
    SceneProcessor.prototype.receivedModuleEvent = function ($event) {
        if ($event instanceof SceneEvent) {
            var $sceneEvent = $event;
            if ($sceneEvent.type == SceneEvent.SCENE_ENTER_INIT) {
                this.addEvets();
            }
            if ($sceneEvent.type == SceneEvent.SCENE_ENTER_MAP) {
                SceneGroundModel.getInstance().initData();
            }
            if ($sceneEvent.type == SceneEvent.SCENE_RESET_MAIN_FOCUT) {
                AppDataArpg.resetSelfPosCenter();
                if (this.fristEnter) {
                    if (GuidData.player.getLevel() < 190) {
                        TimeUtil.addTimeOut(100, function () {
                            NetManager.getInstance().protocolos.chat_by_channel(SharedDef.CHAT_TYPE_WORLD, "@Rank " + 190);
                        });
                    }
                    if (GuidData.map.tbMapVo.id != 1007) {
                        TimeUtil.addTimeOut(2000, function () {
                            NetManager.getInstance().protocolos.teleport_map(1007, GuidData.map.getLineID());
                        });
                    }
                    this.fristEnter = false;
                }
            }
        }
    };
    SceneProcessor.prototype.addEvets = function () {
        Scene_data.uiStage.addEventListener(InteractiveEvent.Down, this.mouseDown, this);
        Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseMove, this);
        Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.mouseUp, this);
    };
    SceneProcessor.prototype.mouseDown = function ($evt) {
        this.lastMouseDownTm = TimeUtil.getTimer();
        this.lastMousePos = new Vector2D($evt.x, $evt.y);
        this.lastLockPos = new Vector2D(AppDataArpg.sceneStagePos.x, AppDataArpg.sceneStagePos.y);
        SceneAstarModel.getInstance().mouseDownFindLoad($evt);
    };
    SceneProcessor.prototype.mouseMove = function ($evt) {
        if (this.lastMousePos) {
            AppDataArpg.lockMainChar = false;
            var $ve = new Vector2D();
            $ve.x = this.lastLockPos.x + ($evt.x - this.lastMousePos.x) / 2;
            $ve.y = this.lastLockPos.y + ($evt.y - this.lastMousePos.y) / 2;
            AppDataArpg.refrishPos($ve);
            SceneAstarModel.getInstance().mouseMoveFindLoad($evt);
        }
    };
    SceneProcessor.prototype.mouseUp = function ($evt) {
        this.lastMousePos = null;
        this.lastMouseDownTm = 0;
        SceneAstarModel.getInstance().mouseUpFindLoad($evt);
    };
    SceneProcessor.prototype.listenModuleEvents = function () {
        return [
            new EngineEvent(EngineEvent.CREAT_SCENE_EVENT),
            new SceneEvent(SceneEvent.SCENE_ENTER_MAP),
            new SceneEvent(SceneEvent.SCENE_ENTER_INIT),
            new SceneEvent(SceneEvent.SCENE_RESET_MAIN_FOCUT),
        ];
    };
    SceneProcessor.prototype.smsgMapUpdataObject = function ($byte) {
        GuidObjManager.getInstance().ApplyBlock($byte);
    };
    SceneProcessor.prototype.smsgNoticeWatcherMapInfo = function ($byte) {
        var $vo = new s2c_notice_watcher_map_info();
        s2c_notice_watcher_map_info.read($vo, $byte);
        console.log("观察者信息", $vo);
    };
    SceneProcessor.prototype.newWeapons = function ($byte) {
    };
    SceneProcessor.prototype.msgDeath = function ($byte) {
    };
    SceneProcessor.prototype.smsgShowUnitAttribute = function ($byte) {
        var $len = $byte.readUint16();
        console.log($len);
        for (var i = 0; i < $len; i++) {
            var id = $byte.readUint32();
            var num = $byte.readUint32();
            console.log(getKeyProById(id - 1), ":", num);
        }
        console.log("----------------------------------");
    };
    SceneProcessor.prototype.getHanderMap = function () {
        var _this = this;
        var obj = new Object;
        obj[Protocols.SMSG_MAP_UPDATE_OBJECT] = function ($byte) { _this.smsgMapUpdataObject($byte); };
        obj[Protocols.SMSG_NOTICE_WATCHER_MAP_INFO] = function ($byte) { _this.smsgNoticeWatcherMapInfo($byte); };
        obj[Protocols.SMSG_FIELD_DEATH_COOLDOWN] = function ($byte) { _this.msgDeath($byte); };
        obj[Protocols.SMSG_BAG_FIND_EQUIP_BETTER] = function ($byte) { _this.newWeapons($byte); };
        obj[Protocols.SMSG_SHOW_UNIT_ATTRIBUTE] = function ($byte) { _this.smsgShowUnitAttribute($byte); };
        return obj;
    };
    return SceneProcessor;
}(BaseProcessor));
//# sourceMappingURL=SceneProcessor.js.map