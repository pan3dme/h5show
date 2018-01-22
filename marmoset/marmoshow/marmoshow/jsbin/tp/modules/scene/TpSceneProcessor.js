var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TpSceneModule = (function (_super) {
    __extends(TpSceneModule, _super);
    function TpSceneModule() {
        _super.apply(this, arguments);
    }
    TpSceneModule.prototype.getModuleName = function () {
        return "TpSceneModule";
    };
    TpSceneModule.prototype.listProcessors = function () {
        return [new TpSceneProcessor()];
    };
    return TpSceneModule;
})(Module);
var TpSceneEvent = (function (_super) {
    __extends(TpSceneEvent, _super);
    function TpSceneEvent() {
        _super.apply(this, arguments);
    }
    //展示面板
    TpSceneEvent.SHOW_TP_SCENE_EVENT = "SHOW_TP_SCENE_EVENT";
    TpSceneEvent.ENTER_SCENE_EVENT = "ENTER_SCENE_EVENT";
    return TpSceneEvent;
})(BaseEvent);
var TpSceneProcessor = (function (_super) {
    __extends(TpSceneProcessor, _super);
    function TpSceneProcessor() {
        _super.call(this);
    }
    TpSceneProcessor.prototype.getName = function () {
        return "TpSceneProcessor";
    };
    TpSceneProcessor.prototype.receivedModuleEvent = function ($event) {
        if ($event instanceof TpSceneEvent) {
            var $tpMenuEvent = $event;
            if ($tpMenuEvent.type == TpSceneEvent.SHOW_TP_SCENE_EVENT) {
                this.addGridLineSprite();
                //this.makeUrlParamList();
                this.addBaseModel(1000, "pan/marmoset/model/1007.jpg", "pan/marmoset/model/1004.jpg");
                //      this.addBaseModel(1001, "pan/marmoset/model/1003.jpg");
                //    this.addBaseModel(1002, "pan/marmoset/model/1007.jpg");
                Scene_data.cam3D.distance = 250;
            }
        }
    };
    TpSceneProcessor.prototype.makeUrlParamList = function () {
        var _this = this;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", function (groupRes) {
            _this.loadPartRes(groupRes);
        });
    };
    TpSceneProcessor.prototype.addBaseModel = function ($id, $baseuv, $nrmuv) {
        var $ds = new UishaderSprite();
        $ds.loadFileById($id, $baseuv, $nrmuv);
        SceneManager.getInstance().addDisplay($ds);
        $ds.x = 50;
        SceneManager.getInstance().addDisplay(new ProdkarenModelSprite);
    };
    TpSceneProcessor.prototype.loadPartRes = function (groupRes) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                var display = new Display3DSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                SceneManager.getInstance().addSpriteDisplay(display);
            }
        }
    };
    TpSceneProcessor.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
    };
    TpSceneProcessor.prototype.listenModuleEvents = function () {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    };
    return TpSceneProcessor;
})(BaseProcessor);
//# sourceMappingURL=TpSceneProcessor.js.map