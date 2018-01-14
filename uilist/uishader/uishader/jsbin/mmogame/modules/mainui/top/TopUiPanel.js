var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var topui;
(function (topui) {
    var TopUiPanel = (function (_super) {
        __extends(TopUiPanel, _super);
        function TopUiPanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this.interfaceUI = true;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._centerRender = new UIRenderComponent;
            this.addRender(this._centerRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._redPointRender = new RedPointRender();
            this.addRender(this._redPointRender);
            this._cdRender = new CdRenderComponent();
            this.addRender(this._cdRender);
            this._effRender = new FrameUIRender;
            this.addRender(this._effRender);
            this._midRender.uiAtlas = new UIAtlas;
        }
        TopUiPanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("ui/uidata/mainui/top/top.xml", "ui/uidata/mainui/top/top.png", function () { _this.loadConfigCom(); });
        };
        //  public topUiBuffPanel: TopUiBuffPanel
        TopUiPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            this._topRender.uiAtlas = this._midRender.uiAtlas;
            this._cdRender.uiAtlas = this._midRender.uiAtlas;
            this._centerRender.uiAtlas = this._midRender.uiAtlas;
            this.topPandaPanel = new topui.TopPandaPanel();
            this.topPandaPanel.setRender(this._bottomRender, this._midRender, this._topRender, this._redPointRender);
            this.addVirtualContainer(this.topPandaPanel);
            this.topHeadPanel = new topui.TopHeadPanel();
            this.topHeadPanel.setRender(this._bottomRender, this._midRender, this._topRender, this._effRender, this._redPointRender);
            this.addVirtualContainer(this.topHeadPanel);
            this.topTargetHeadPanel = new topui.TopTargetHeadPanel();
            this.topTargetHeadPanel.setRender(this._bottomRender, this._midRender, this._topRender, this._centerRender);
            this.addVirtualContainer(this.topTargetHeadPanel);
            //this.topUiBuffPanel = new TopUiBuffPanel();
            //this.topUiBuffPanel.setRender(this._topRender,this._cdRender);
            //this.addVirtualContainer(this.topUiBuffPanel);
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        TopUiPanel.prototype.refresh = function () {
            if (this.uiAtlasComplet) {
                this.topPandaPanel.refresh();
                this.topHeadPanel.refresh();
            }
        };
        return TopUiPanel;
    })(UIPanel);
    topui.TopUiPanel = TopUiPanel;
})(topui || (topui = {}));
//# sourceMappingURL=TopUiPanel.js.map