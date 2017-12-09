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
                this.addGridLineSprite();
                this.addModel();
                this.outTextureSprite = new OutTextureSprite();
                TimeUtil.addFrameTick(function () { _this.updata(); });
            }
        }
    };
    TpSceneProcessor.prototype.updata = function () {
        // SceneManager.getInstance().update();
        OutNrmTextureModel.getInstance().renderNrm();
        OutDephtTextureModel.getInstance().renderNrm();
        ExpBakedModel.getInstance().renderBacked();
        //this.outTextureSprite.showTexture(ExpBakedModel.getInstance().fbo.texture)
        ExpNrmAndDephtModel.getInstance().expNrmDepht(OutNrmTextureModel.getInstance().fbo.texture, OutDephtTextureModel.getInstance().fbo.texture, ExpBakedModel.getInstance().fbo.texture);
    };
    TpSceneProcessor.prototype.addModel = function () {
        Scene_data.cam3D.distance = 150;
        this.outLinePerfab = new OutLinePerfab();
        this.outLinePerfab.setPerfabName("hpplant");
        this.outLinePerfab.scale = 15;
        this.outLinePerfab.uvscaleData = [5, 5];
        SceneManager.getInstance().addDisplay(this.outLinePerfab);
        for (var i = 0; i < 7; i++) {
            var $A = new OutLinePerfab();
            $A.setPerfabName("hpbox");
            $A.x = 50 - i * 20;
            $A.y = 5;
            $A.rotationY = i * (360 / 5);
            $A.rotationX = random(360);
            $A.rotationZ = random(360);
            $A.rotationY = random(360);
            $A.scale = 0.5;
            $A.uvscaleData = [1, 1];
            SceneManager.getInstance().addDisplay($A);
        }
        var $B = new OutLinePerfab();
        $B.setPerfabName("hptree");
        $B.y = 0;
        $B.z = 30;
        $B.scale = 0.1;
        $B.uvscaleData = [2, 2];
        SceneManager.getInstance().addDisplay($B);
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
}(BaseProcessor));
//# sourceMappingURL=TpSceneProcessor.js.map