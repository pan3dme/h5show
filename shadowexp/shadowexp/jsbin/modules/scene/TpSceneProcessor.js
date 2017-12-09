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
        var _this = _super.call(this) || this;
        _this.skipNum = 0;
        return _this;
    }
    TpSceneProcessor.prototype.getName = function () {
        return "TpSceneProcessor";
    };
    TpSceneProcessor.prototype.receivedModuleEvent = function ($event) {
        var _this = this;
        if ($event instanceof TpSceneEvent) {
            var $tpMenuEvent = $event;
            if ($tpMenuEvent.type == TpSceneEvent.SHOW_TP_SCENE_EVENT) {
                Scene_data.cam3D.distance = 200;
                Scene_data.focus3D.rotationY = 0;
                Scene_data.light.setData((new Vector3D(0.5, 0.6, 0.7)), new Vector3D(0.8, 0.8, 0.8), new Vector3D(0.2, 0.2, 0.2));
                this.addGridLineSprite();
                var $modelid = getUrlParam("modelid");
                if ($modelid) {
                    this.addDirectShadowDisplay3DSprite($modelid);
                }
                else {
                    window.location.href = "index.html?modelid=40407";
                }
                if (!Scene_data.fbo) {
                    Scene_data.fbo = ShadowModel.getInstance().getFBO(); //512*512
                }
                TimeUtil.addFrameTick(function () { _this.upData(); });
            }
        }
    };
    TpSceneProcessor.prototype.upData = function () {
        ShadowModel.getInstance().sunRotationY++;
        ShadowModel.getInstance().updateDepth();
    };
    TpSceneProcessor.prototype.addDirectShadowDisplay3DSprite = function ($str) {
        var $base = new DirectShadowDisplay3DSprite();
        $base.setModelById("football");
        $base.y = 40;
        $base.x = 0;
        $base.scaleX = 2;
        $base.scaleY = 2.01;
        $base.scaleZ = 2;
        SceneManager.getInstance().addDisplay($base);
        this.addRandom("whitebox");
        // this.addWoodBox("whitebox")
        this.addWhitedrum("whitedrum");
        this.addGroundplant("groundplant");
    };
    TpSceneProcessor.prototype.addWoodBox = function ($str) {
        var $base = new DirectShadowDisplay3DSprite();
        $base.setModelById($str);
        $base.y = 10;
        $base.z = 0;
        $base.x = -50;
        $base.scaleX = 2;
        $base.scaleY = 2;
        $base.scaleZ = 2;
        SceneManager.getInstance().addDisplay($base);
    };
    TpSceneProcessor.prototype.addWhitedrum = function ($str) {
        var $base = new DirectShadowDisplay3DSprite();
        $base.setModelById($str);
        $base.y = 10;
        $base.z = -25;
        $base.x = 12;
        $base.scaleX = 1;
        $base.scaleY = 3;
        $base.scaleZ = 1;
        SceneManager.getInstance().addDisplay($base);
    };
    TpSceneProcessor.prototype.addRandom = function ($str) {
        for (var i = 0; i < 10; i++) {
            var $base = new DirectShadowDisplay3DSprite();
            $base.setModelById($str);
            var $pos = new Vector3D(50, 0, 0);
            var $m = new Matrix3D();
            $m.appendRotation(360 / 10 * i, Vector3D.Y_AXIS);
            $pos = $m.transformVector($pos);
            $base.x = $pos.x;
            $base.z = $pos.z;
            $base.rotationY = 360 / 10 * i;
            $base.rotationX = 0;
            $base.rotationZ = 360 / 10 * i;
            $base.scaleX = 2;
            $base.scaleY = $base.scaleX;
            $base.scaleZ = $base.scaleX;
            $base.y = 10;
            SceneManager.getInstance().addDisplay($base);
        }
    };
    TpSceneProcessor.prototype.addGroundplant = function ($str) {
        var $base = new DirectShadowDisplay3DSprite();
        $base.setModelById($str);
        $base.y = 1;
        $base.x = 0;
        $base.scaleX = 10;
        $base.scaleY = 1;
        $base.scaleZ = 10;
        SceneManager.getInstance().addDisplay($base);
    };
    TpSceneProcessor.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        // SceneManager.getInstance().addDisplay($GridLineSprite);
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