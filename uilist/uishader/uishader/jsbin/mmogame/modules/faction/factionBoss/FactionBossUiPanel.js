var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var faction;
(function (faction) {
    var FactionBossUiPanel = (function (_super) {
        __extends(FactionBossUiPanel, _super);
        function FactionBossUiPanel() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            this._publicRender = new UIRenderComponent;
            this.addRender(this._publicRender);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._topRender.uiAtlas = new UIAtlas();
        }
        FactionBossUiPanel.prototype.dispose = function () {
            this._baseRender.dispose();
            this._baseRender = null;
            this._topRender.dispose();
            this._topRender = null;
            _super.prototype.dispose.call(this);
        };
        FactionBossUiPanel.prototype.applyLoad = function () {
            var _this = this;
            GameData.getPublicUiAtlas(function ($publicbgUiAtlas) {
                _this._publicRender.uiAtlas = $publicbgUiAtlas;
                _this._topRender.uiAtlas.setInfo("ui/uidata/faction/factionboss/factionboss.xml", "ui/uidata/faction/factionboss/factionboss.png", function () { _this.loadConfigCom(); }, "ui/uidata/faction/factionboss/factionbossuse.png");
            });
        };
        FactionBossUiPanel.prototype.loadConfigCom = function () {
            this._baseRender.uiAtlas = this._topRender.uiAtlas;
            this.winmidRender.uiAtlas = this._topRender.uiAtlas;
            var renderLevel = this._topRender;
            //  this.addChild(<UICompenent>renderLevel.getComponent("test"));
            this.addChild(this.winmidRender.getComponent("a_list_bg"));
            this.addChild(this.winmidRender.getComponent("a_left_line"));
            this.addChild(this._baseRender.getComponent("a_bottom_bg"));
            this.addChild(this._baseRender.getComponent("a_num_bg2"));
            this.addChild(this._baseRender.getComponent("a_num_bg1"));
            this.addChild(this._baseRender.getComponent("a_num_bg0"));
            this.addChild(renderLevel.getComponent("a_res_icon1"));
            this.addChild(renderLevel.getComponent("a_res_icon0"));
            this.a_5 = this.addChild(renderLevel.getComponent("a_5"));
            this.a_6 = this.addChild(renderLevel.getComponent("a_6"));
            this.a_7 = this.addChild(renderLevel.getComponent("a_7"));
            this.addChild(renderLevel.getComponent("a_rand_but"));
            this.addChild(renderLevel.getComponent("a_boss_lp_label"));
            this.addChild(renderLevel.getComponent("a_kill_jifen_label"));
            this.addChild(renderLevel.getComponent("a_day_canget_label"));
            this.addChild(renderLevel.getComponent("a_boss_buy_label"));
            this.addChild(renderLevel.getComponent("a_rewaard_info_label"));
            this.addChild(renderLevel.getComponent("a_win_tittle"));
            this.applyLoadComplete();
        };
        FactionBossUiPanel.prototype.show = function () {
            UIManager.getInstance().addUIContainer(this);
            if (!this.factionBossRightPanel) {
                this.factionBossRightPanel = new faction.FactionBossRightPanel();
                this.factionBossRightPanel.initUiAtlas(this._topRender.uiAtlas, this._publicRender.uiAtlas);
            }
            this.factionBossRightPanel.show();
            this.refreshCurrentNum();
            this.refreshCurrentIntegral();
            this.refreshCurrentResidue();
            ModulePageManager.showResTittle([1, 2, 3]);
        };
        FactionBossUiPanel.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
            if (this.factionBossRightPanel) {
                this.factionBossRightPanel.hide();
            }
            _super.prototype.hide.call(this);
        };
        FactionBossUiPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        FactionBossUiPanel.prototype.refreshCurrentNum = function () {
            var tab2 = tb.Tb_faction_base.get_Tb_faction_baseById(GuidData.faction.getLev());
            // GuidData.faction.getBossTokenNum() + "/" + tab2.token_max_keep
            //  ArtFont.getInstance().writeFontToSkinName(this._baseRender.uiAtlas, this.a_5.skinName, GuidData.faction.getBossTokenNum() + "/" + tab2.token_max_keep, ArtFont.num1, TextAlign.RIGHT);
            LabelTextFont.writeSingleLabel(this._baseRender.uiAtlas, this.a_5.skinName, ColorType.Orange853d07 + GuidData.faction.getBossTokenNum() + "/" + tab2.token_max_keep, 16);
        };
        FactionBossUiPanel.prototype.refreshCurrentIntegral = function () {
            var tab2 = tb.Tb_faction_base.get_Tb_faction_baseById(GuidData.faction.getLev());
            //   ArtFont.getInstance().writeFontToSkinName(this._baseRender.uiAtlas, this.a_6.skinName, GuidData.faction.getBossTokenPoints() + "/" + tab2.token_points, ArtFont.num1, TextAlign.LEFT);
            LabelTextFont.writeSingleLabel(this._baseRender.uiAtlas, this.a_6.skinName, ColorType.Orange853d07 + GuidData.faction.getBossTokenPoints() + "/" + tab2.token_points, 16);
        };
        FactionBossUiPanel.prototype.refreshCurrentResidue = function () {
            var tab2 = tb.Tb_faction_base.get_Tb_faction_baseById(GuidData.faction.getLev());
            var residue = tab2.token_daily - GuidData.faction.getBossTokenPointscount();
            // ArtFont.getInstance().writeFontToSkinName(this._baseRender.uiAtlas, this.a_7.skinName, String(residue), ArtFont.num1, TextAlign.LEFT);
            LabelTextFont.writeSingleLabel(this._baseRender.uiAtlas, this.a_7.skinName, ColorType.Orange853d07 + String(residue), 16);
        };
        FactionBossUiPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.w_close:
                    ModuleEventManager.dispatchEvent(new faction.FactionBossEvent(faction.FactionBossEvent.HIDE_BOSS_EVENT));
                    break;
                default:
                    break;
            }
        };
        return FactionBossUiPanel;
    })(WindowUi);
    faction.FactionBossUiPanel = FactionBossUiPanel;
})(faction || (faction = {}));
//# sourceMappingURL=FactionBossUiPanel.js.map