var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var back;
(function (back) {
    var BackSpacePanel = (function (_super) {
        __extends(BackSpacePanel, _super);
        function BackSpacePanel() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._midRender.uiAtlas = new UIAtlas;
            this.applyLoad();
        }
        BackSpacePanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("pan/marmoset/uilist/baseui.xml", "pan/marmoset/uilist/baseui.png", function () { _this.loadConfigCom(); });
        };
        BackSpacePanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            this._topRender.uiAtlas = this._midRender.uiAtlas;
            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._midRender);
            this.a_cell_base_bg = this.addEvntBut("a_cell_base_bg", this._bottomRender);
            this.makePointUi();
            this.refrishUi();
            this.left = 100;
            this.top = 100;
        };
        BackSpacePanel.prototype.refrishUi = function () {
            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
            this.a_cell_base_bg.width = this.a_tittle_bg.width;
            var $h = 17;
            this.pointuv.goToAndStop(0);
            this.pointuv.x = 10;
            this.pointuv.y = 30;
            this.pointrgb.goToAndStop(0);
            this.pointrgb.x = 130;
            this.pointrgb.y = 30;
            this.pointr.goToAndStop(0);
            this.pointr.x = 130;
            this.pointr.y = 30 + $h * 1;
            this.pointg.goToAndStop(0);
            this.pointg.x = 130;
            this.pointg.y = 30 + $h * 2;
            this.pointb.goToAndStop(0);
            this.pointb.x = 130;
            this.pointb.y = 30 + $h * 3;
            this.pointrgba.goToAndStop(0);
            this.pointrgba.x = 130;
            this.pointrgba.y = 30 + $h * 4;
        };
        BackSpacePanel.prototype.makePointUi = function () {
            this.pointuv = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointrgb = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointr = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointg = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointb = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointrgba = this.addEvntBut("a_point_frame", this._bottomRender);
        };
        BackSpacePanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_tittle_bg:
                    this.addStageMoveEvets(evt);
                    break;
                default:
                    this.clikUiEvent(evt.target);
                    break;
            }
        };
        BackSpacePanel.prototype.clikUiEvent = function (evt) {
        };
        BackSpacePanel.prototype.addStageMoveEvets = function ($e) {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        BackSpacePanel.prototype.onMove = function ($e) {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x);
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y);
            this.resize();
        };
        BackSpacePanel.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        return BackSpacePanel;
    })(UIPanel);
    back.BackSpacePanel = BackSpacePanel;
})(back || (back = {}));
//# sourceMappingURL=BackSpacePanel.js.map