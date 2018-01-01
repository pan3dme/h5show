var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var adventurebang;
(function (adventurebang) {
    var AdventureBangPanel = (function (_super) {
        __extends(AdventureBangPanel, _super);
        function AdventureBangPanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.bottom = 0;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._midRender.uiAtlas = new UIAtlas;
        }
        AdventureBangPanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("ui/uidata/adventure/offlinereward/offlinereward.xml", "ui/uidata/adventure/offlinereward/offlinereward.png", function () { _this.loadConfigCom(); });
        };
        AdventureBangPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            this._topRender.uiAtlas = this._midRender.uiAtlas;
            this.addChild(this._bottomRender.getComponent("a_bg"));
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        AdventureBangPanel.prototype.butClik = function (evt) {
            this.close();
        };
        AdventureBangPanel.prototype.close = function () {
        };
        AdventureBangPanel.prototype.refresh = function () {
        };
        return AdventureBangPanel;
    })(UIPanel);
    adventurebang.AdventureBangPanel = AdventureBangPanel;
})(adventurebang || (adventurebang = {}));
//# sourceMappingURL=AdventureBangPanel.js.map