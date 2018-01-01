var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fightui;
(function (fightui) {
    var FightUiPanel = (function (_super) {
        __extends(FightUiPanel, _super);
        function FightUiPanel() {
            var _this = this;
            _super.call(this);
            this.uiAtlasComplet = false;
            this.interfaceUI = true;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.right = 0;
            this.bottom = 0;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._cdUIRenderComponent = new CdRenderComponent();
            this.addRender(this._cdUIRenderComponent);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._midRender.uiAtlas = new UIAtlas;
            TimeUtil.addFrameTick(function (t) { _this.update(t); });
        }
        FightUiPanel.prototype.update = function (t) {
            if (this.uiAtlasComplet) {
                this.fightSkillPanel.update(t);
            }
        };
        FightUiPanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("ui/uidata/mainui/fight/fight.xml", "ui/uidata/mainui/fight/fight.png", function () { _this.loadConfigCom(); });
        };
        FightUiPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            this._topRender.uiAtlas = this._midRender.uiAtlas;
            this._cdUIRenderComponent.uiAtlas = this._midRender.uiAtlas;
            this.fightSkillPanel = new fightui.FightSkillPanel();
            this.fightSkillPanel.setRender(this._bottomRender, this._midRender, this._topRender, this._cdUIRenderComponent);
            this.addVirtualContainer(this.fightSkillPanel);
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        return FightUiPanel;
    })(UIPanel);
    fightui.FightUiPanel = FightUiPanel;
})(fightui || (fightui = {}));
//# sourceMappingURL=FightUiPanel.js.map