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
var TpSceneModule = /** @class */ (function (_super) {
    __extends(TpSceneModule, _super);
    function TpSceneModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TpSceneModule.prototype.getModuleName = function () {
        return "TpSceneModule";
    };
    TpSceneModule.prototype.listProcessors = function () {
        return [new TpSceneProcessor()];
    };
    return TpSceneModule;
}(Module));
var TpSceneEvent = /** @class */ (function (_super) {
    __extends(TpSceneEvent, _super);
    function TpSceneEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //展示面板
    TpSceneEvent.SHOW_TP_SCENE_EVENT = "SHOW_TP_SCENE_EVENT";
    TpSceneEvent.ENTER_SCENE_EVENT = "ENTER_SCENE_EVENT";
    return TpSceneEvent;
}(BaseEvent));
var TpSceneProcessor = /** @class */ (function (_super) {
    __extends(TpSceneProcessor, _super);
    function TpSceneProcessor() {
        return _super.call(this) || this;
    }
    TpSceneProcessor.prototype.getName = function () {
        return "TpSceneProcessor";
    };
    TpSceneProcessor.prototype.receivedModuleEvent = function ($event) {
        var _this = this;
        if ($event instanceof TpSceneEvent) {
            var $tpMenuEvent = $event;
            if ($tpMenuEvent.type == TpSceneEvent.SHOW_TP_SCENE_EVENT) {
                Scene_data.fileRoot = "res/";
                FBO.fw = 1024;
                FBO.fh = 1024;
                this.loadScene();
                TimeUtil.addFrameTick(function () { _this.updata(); });
                SceneManager.getInstance().ready = true;
            }
        }
    };
    TpSceneProcessor.prototype.loadScene = function () {
        var _this = this;
        Scene_data.cam3D.distance = 150;
        ResManager.getInstance().loadSceneRes("outlinescene", this.completeFun, this.progressFun, function ($str) {
            _this.loadSceneConfigCom($str);
        });
    };
    TpSceneProcessor.prototype.completeFun = function () {
    };
    TpSceneProcessor.prototype.progressFun = function (obj) {
    };
    TpSceneProcessor.prototype.loadSceneConfigCom = function (obj) {
        var buildAry = obj.buildItem;
        for (var i = 0; i < buildAry.length; i++) {
            var itemObj = buildAry[i];
            if (itemObj.type == BaseRes.PREFAB_TYPE) {
                var itemDisplay = this.getBuildSprite(itemObj);
                SceneManager.getInstance().addDisplay(itemDisplay);
            }
        }
    };
    TpSceneProcessor.prototype.getBuildSprite = function (itemObj) {
        var itemDisplay = new OutLineSprite();
        itemDisplay.setObjUrl(itemObj.objsurl);
        itemDisplay.setLightMapUrl(itemObj.lighturl);
        itemDisplay.scaleX = itemObj.scaleX;
        itemDisplay.scaleY = itemObj.scaleY;
        itemDisplay.scaleZ = itemObj.scaleZ;
        itemDisplay.x = itemObj.x;
        itemDisplay.y = itemObj.y;
        itemDisplay.z = itemObj.z;
        itemDisplay.rotationX = itemObj.rotationX;
        itemDisplay.rotationY = itemObj.rotationY;
        itemDisplay.rotationZ = itemObj.rotationZ;
        itemDisplay.type = 0;
        itemDisplay.id = itemObj.id;
        console.log(itemDisplay.id);
        switch (itemDisplay.id) {
            case 3:
                itemDisplay.uvscaleData = [6, 6];
                break;
            case 4:
                itemDisplay.uvscaleData = [4, 4];
                break;
            case 6:
            case 7:
                itemDisplay.uvscaleData = [4, 4];
                break;
            default:
                break;
        }
        return itemDisplay;
    };
    TpSceneProcessor.prototype.updata = function () {
        OutNrmTextureModel.getInstance().renderNrm();
        OutDephtTextureModel.getInstance().renderNrm();
        ExpBakedModel.getInstance().renderBacked();
        ExpNrmAndDephtModel.getInstance().expNrmDepht(OutNrmTextureModel.getInstance().fbo.texture, OutDephtTextureModel.getInstance().fbo.texture, ExpBakedModel.getInstance().fbo.texture);
    };
    TpSceneProcessor.prototype.listenModuleEvents = function () {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    };
    return TpSceneProcessor;
}(BaseProcessor));
//# sourceMappingURL=TpSceneProcessor.js.map