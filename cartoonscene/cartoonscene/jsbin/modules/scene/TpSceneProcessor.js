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
                FBO.fw = 1024;
                FBO.fh = 1024;
                this.addGridLineSprite();
                //this.addModel();
                this.loadScene();
                this.outTextureSprite = new OutTextureSprite();
                TimeUtil.addFrameTick(function () { _this.updata(); });
            }
        }
    };
    TpSceneProcessor.prototype.loadScene = function () {
        var _this = this;
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
        var itemDisplay = new CartoonDisplay3dSprite();
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
        switch (itemDisplay.id) {
            case 4:
                // itemDisplay.Factor = 0.9
                itemDisplay.Outline = 0.1;
                break;
            case 6:
            case 7:
                itemDisplay.Factor = 0.9;
                itemDisplay.Outline = 2;
                break;
            default:
                break;
        }
        return itemDisplay;
    };
    TpSceneProcessor.prototype.updata = function () {
        SceneManager.getInstance().update();
        for (var j = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof CartoonDisplay3dSprite) {
                    var $oso = $display3d;
                    $oso.updateCortoon();
                }
            }
        }
        //    OutLineTextureModel.getInstance().renderNrm()
        //    this.outTextureSprite.showTexture(OutLineTextureModel.getInstance().fbo.texture)
    };
    TpSceneProcessor.prototype.addModel = function () {
        Scene_data.cam3D.distance = 150;
        //Scene_data.focus3D.rotationX = 0
        Scene_data.focus3D.rotationY = 0;
        var $b = new CartoonPerfab();
        $b.setPerfabName("hptree");
        $b.x = 0;
        $b.scale = 0.1;
        $b.Factor = 0.9;
        $b.Outline = 2;
        SceneManager.getInstance().addDisplay($b);
        var $a = new CartoonPerfab();
        $a.setPerfabName("hpball");
        $a.x = 40;
        $a.scale = 0.5;
        SceneManager.getInstance().addDisplay($a);
        //var $a: CartoonPerfab = new CartoonPerfab()
        //$a.setPerfabName("hpball")
        //$a.x = 40
        //SceneManager.getInstance().addDisplay($a);
        //var $c: CartoonPerfab = new CartoonPerfab()
        //$c.setPerfabName("hpbox")
        //$c.x = -40
        //SceneManager.getInstance().addDisplay($c);
        //$a.rotationY = random(360)
        //$b.rotationY = random(360)
        //$c.rotationY = random(360)
        //$a.rotationX = random(360)
        //$b.rotationX = random(360)
        //$c.rotationX = random(360)
    };
    TpSceneProcessor.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        //   SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
        Scene_data.camFar = 2000;
    };
    TpSceneProcessor.prototype.listenModuleEvents = function () {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    };
    return TpSceneProcessor;
}(BaseProcessor));
//# sourceMappingURL=TpSceneProcessor.js.map