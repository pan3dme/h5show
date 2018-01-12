var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var homeui;
(function (homeui) {
    var HomeUiPanel = (function (_super) {
        __extends(HomeUiPanel, _super);
        function HomeUiPanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this.interfaceUI = true;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            // this._bottomRender = new UIRenderComponent;
            // this.addRender(this._bottomRender);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            //this._topRender = new UIRenderComponent;
            // this.addRender(this._topRender);
            this._redPointRender = new RedPointRender;
            this.addRender(this._redPointRender);
            this._baseRender.uiAtlas = new UIAtlas;
        }
        HomeUiPanel.prototype.applyLoad = function () {
            var _this = this;
            this._baseRender.uiAtlas.setInfo("ui/uidata/mainui/home/home.xml", "ui/uidata/mainui/home/home.png", function () { _this.loadConfigCom(); });
        };
        HomeUiPanel.prototype.loadConfigCom = function () {
            //this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            //this._topRender.uiAtlas = this._midRender.uiAtlas;
            this.homeSysPanel = new homeui.HomeSysPanel();
            this.homeSysPanel.setRender(this._baseRender, this._redPointRender);
            this.addVirtualContainer(this.homeSysPanel);
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        return HomeUiPanel;
    })(UIPanel);
    homeui.HomeUiPanel = HomeUiPanel;
})(homeui || (homeui = {}));
//# sourceMappingURL=HomeUiPanel.js.map