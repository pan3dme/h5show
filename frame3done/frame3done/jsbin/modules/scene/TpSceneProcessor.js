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
        _this.lastTime = 0;
        _this.haveVidoe = true;
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
                Scene_data.focus3D.rotationY = 90;
                Scene_data.light.setData((new Vector3D(0.5, 0.6, 0.7)), new Vector3D(0.8, 0.8, 0.8), new Vector3D(0.2, 0.2, 0.2));
                this.addGridLineSprite();
                var $modelid = getUrlParam("name");
                //$modelid ="frame3d.txt"
                if ($modelid) {
                    this._frame3dRes = new Frame3dRes();
                    this._frame3dRes.load(Scene_data.fileRoot + "pan/frame3dres/" + $modelid + ".txt", function () { return _this.loadFrame3DFinish(); });
                    TimeUtil.addFrameTick(function () { _this.upData(); });
                }
                else {
                    window.location.href = "index.html?name=huowumatou_frame";
                }
            }
        }
    };
    TpSceneProcessor.prototype.loadFrame3DFinish = function () {
        DirectShadowDisplay3DSprite.showWhiteTexture = false;
        this.frameImodelItem = new Array();
        for (var i = 0; i < this._frame3dRes.frameItem.length; i++) {
            var $base = new FrameFileNode();
            $base.setFrameNodeVo(this._frame3dRes.frameItem[i]);
            this.frameImodelItem.push($base);
        }
        if (this._frame3dRes.haveVideo) {
            var $modelid = getUrlParam("name");
            this.createVideo($modelid);
        }
    };
    TpSceneProcessor.prototype.upData = function () {
        if (!Scene_data.fbo) {
            Scene_data.fbo = ShadowModel.getInstance().getFBO(); //512*512
        }
        if (this._frame3dRes.haveVideo && this.haveVidoe) {
            Frame3dRes.frameNum = Math.floor(LightBmpModel.getInstance().videoElem.currentTime * 36);
        }
        else {
            this.mathTimeFrame();
        }
        for (var i = 0; this.frameImodelItem && i < this.frameImodelItem.length; i++) {
            this.frameImodelItem[i].update();
        }
        if (this._frame3dRes.haveVideo && this.haveVidoe) {
            LightBmpModel.getInstance().upLightTexture(this.frameImodelItem);
        }
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.update();
        ShadowModel.getInstance().updateDepth();
        SceneManager.getInstance().update();
        Scene_data.context3D.setWriteDepth(true);
    };
    TpSceneProcessor.prototype.mathTimeFrame = function () {
        if (isNaN(Frame3dRes.frameNum)) {
            Frame3dRes.frameNum = 0;
        }
        var dt = TimeUtil.getTimer() - this.lastTime;
        Frame3dRes.frameNum += dt / (1000 / Frame3dRes.frameSpeedNum);
        Frame3dRes.frameNum = Frame3dRes.frameNum % (FrameLinePointVo.maxTime - 1);
        this.lastTime = TimeUtil.getTimer();
    };
    TpSceneProcessor.prototype.createVideo = function ($modelid) {
        var _this = this;
        LightBmpModel.getInstance().videoElem = document.createElement("video"); //创建video
        LightBmpModel.getInstance().videoElem.setAttribute('src', Scene_data.fileRoot + "pan/frame3dres/mp4/" + $modelid + ".mp4");
        LightBmpModel.getInstance().videoElem.autoplay = true;
        LightBmpModel.getInstance().videoElem.loop = true;
        LightBmpModel.getInstance().videoElem.addEventListener("error", function () {
            console.log("没有视屏");
            _this.haveVidoe = false;
        });
    };
    TpSceneProcessor.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        //  SceneManager.getInstance().addDisplay($GridLineSprite);
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