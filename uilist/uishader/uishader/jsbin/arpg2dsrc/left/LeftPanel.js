var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var left;
(function (left) {
    var modelShowRender = (function (_super) {
        __extends(modelShowRender, _super);
        function modelShowRender() {
            _super.call(this);
        }
        modelShowRender.prototype.makeRenderDataVc = function ($vcId) {
            _super.prototype.makeRenderDataVc.call(this, $vcId);
            for (var i = 0; i < this.renderData2.length / 4; i++) {
                this.renderData2[i * 4 + 0] = 1;
                this.renderData2[i * 4 + 1] = -1;
                this.renderData2[i * 4 + 2] = 0;
                this.renderData2[i * 4 + 3] = 0;
            }
        };
        return modelShowRender;
    })(UIRenderOnlyPicComponent);
    left.modelShowRender = modelShowRender;
    var LeftPanel = (function (_super) {
        __extends(LeftPanel, _super);
        function LeftPanel() {
            var _this = this;
            _super.call(this);
            this.layer = 100;
            this.left = 0;
            this.top = 0;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this.modelPic = new modelShowRender();
            this.addRender(this.modelPic);
            this._topRender.uiAtlas = new UIAtlas();
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.xml", "pan/marmoset/uilist/left/left.png", function () { _this.loadConfigCom(); });
        }
        LeftPanel.prototype.initView = function () {
            var $ui = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("ui/load/map/bigworld.jpg");
            $ui.top = 10;
            $ui.left = 10;
            left.ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic";
            this.addEvntBut;
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);
        };
        LeftPanel.prototype.addStageMoveEvets = function ($e) {
            this.lastCameRotation = new Vector2D(Scene_data.focus3D.rotationX, Scene_data.focus3D.rotationY);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.onMove = function ($e) {
            var $n = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
            Scene_data.focus3D.rotationX = this.lastCameRotation.x - $n.y;
            Scene_data.focus3D.rotationY = this.lastCameRotation.y - $n.x;
        };
        LeftPanel.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas;
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;
            //     this.addChild(this._topRender.getComponent("a_base"));
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender);
            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;
            this.initView();
            this.resize();
        };
        LeftPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break;
                default:
                    break;
            }
        };
        LeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.a_panel_bg) {
                this.a_panel_bg.width = 250;
                this.a_panel_bg.height = Scene_data.stageHeight;
            }
        };
        return LeftPanel;
    })(UIPanel);
    left.LeftPanel = LeftPanel;
})(left || (left = {}));
//# sourceMappingURL=LeftPanel.js.map