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
var colorview;
(function (colorview) {
    var ColorPanel = /** @class */ (function (_super) {
        __extends(ColorPanel, _super);
        function ColorPanel() {
            var _this = _super.call(this) || this;
            _this.layer = 2000;
            _this.left = 400;
            _this.top = 200;
            _this.width = 300;
            _this.height = 300;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this._topRender.uiAtlas = new UIAtlas();
            _this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/colorview/colorview.xml", "pan/marmoset/uilist/colorview/colorview.png", function () { _this.loadConfigCom(); });
            return _this;
        }
        ColorPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas;
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.c_tittle = this.addEvntBut("c_tittle", this._bottomRender);
            this.addEvntBut("c_bg", this._bottomRender);
        };
        ColorPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.c_tittle:
                    this.addStageMoveEvets(evt);
                    break;
                default:
                    break;
            }
        };
        ColorPanel.prototype.addStageMoveEvets = function ($e) {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        ColorPanel.prototype.onMove = function ($e) {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x) / UIData.Scale;
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y) / UIData.Scale;
            this.resize();
        };
        ColorPanel.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        return ColorPanel;
    }(UIPanel));
    colorview.ColorPanel = ColorPanel;
})(colorview || (colorview = {}));
//# sourceMappingURL=ColorPanel.js.map