var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var faction;
(function (faction) {
    var ExistFactionUiPanel = (function (_super) {
        __extends(ExistFactionUiPanel, _super);
        function ExistFactionUiPanel() {
            _super.call(this, 2);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            this._publicbgRender = new UIRenderComponent;
            this.addRender(this._publicbgRender);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._redPointRender = new RedPointRender;
            this.addRender(this._redPointRender);
            this._topRender.uiAtlas = new UIAtlas();
        }
        ExistFactionUiPanel.prototype.dispose = function () {
            this._baseRender.dispose();
            this._baseRender = null;
            this._topRender.dispose();
            this._topRender = null;
            this.factionFunctionPanel.dispose();
            this.factionFunctionPanel = null;
            this.factionPersonPanel.dispose();
            this.factionPersonPanel = null;
            this._redPointRender.dispose();
            this._redPointRender = null;
            _super.prototype.dispose.call(this);
        };
        ExistFactionUiPanel.prototype.applyLoad = function () {
            var _this = this;
            this._publicbgRender.uiAtlas = WindowUi.winUIAtlas;
            this._topRender.uiAtlas.setInfo("ui/uidata/faction/newfaction/extisfaction.xml", "ui/uidata/faction/newfaction/extisfaction.png", function () { _this.loadConfigCom(); }, "ui/uidata/faction/factionpc.png");
        };
        ExistFactionUiPanel.prototype.loadConfigCom = function () {
            this._baseRender.uiAtlas = this._topRender.uiAtlas;
            this.winmidRender.uiAtlas = this._publicbgRender.uiAtlas;
            var renderLevel = this._topRender;
            this.factionPersonPanel = new faction.FactionPersonPanel();
            this.factionPersonPanel.initUiAtlas(renderLevel.uiAtlas, this._publicbgRender.uiAtlas);
            this.factionPersonPanel.parent = this;
            this.factionFunctionPanel = new faction.FactionFunctionPanel();
            this.factionFunctionPanel.initUiAtlas(renderLevel.uiAtlas, this);
            var rightLinebg = this.addChild(this.winmidRender.getComponent("cnew_right_bg"));
            this.setSizeForPanelUiCopy(rightLinebg, "bg_1", renderLevel);
            this.addUIList(["title"], renderLevel);
            this.tab_person = this.addEvntBut("tab_person", this._baseRender);
            this.tab_shang = this.addEvntBut("tab_shang", this._baseRender);
            this._redPointRender.getRedPointUI(this, 61, new Vector2D(this.tab_person.x + this.tab_person.width - 5, this.tab_person.y));
            this._redPointRender.getRedPointUI(this, 63, new Vector2D(this.tab_shang.x + this.tab_shang.width - 5, this.tab_shang.y));
            this.applyLoadComplete();
        };
        ExistFactionUiPanel.prototype.selectlo = function ($value) {
            if ($value == 0) {
                this.tab_person.selected = true;
                this.tab_shang.selected = false;
            }
            else if ($value == 1) {
                this.tab_person.selected = false;
                this.tab_shang.selected = true;
            }
            this.selectdatalo($value);
        };
        ExistFactionUiPanel.prototype.showhide_select = function ($value) {
            if ($value == 0) {
                this.factionPersonPanel.show();
                this.factionFunctionPanel.hide();
            }
            else if ($value == 1) {
                this.factionPersonPanel.hide();
                this.factionFunctionPanel.show();
            }
        };
        ExistFactionUiPanel.prototype.selectdatalo = function ($value) {
            if (this._typelo == $value) {
                return;
            }
            this._typelo = $value;
            //处理逻辑
            this.showhide_select($value);
        };
        ExistFactionUiPanel.prototype.refresh = function () {
        };
        ExistFactionUiPanel.prototype.show = function (value) {
            if (value === void 0) { value = 0; }
            UIManager.getInstance().addUIContainer(this);
            ModulePageManager.showResTittle([1, 2, 3]);
            this.selectlo(value);
        };
        ExistFactionUiPanel.prototype.hide = function () {
            this._typelo = -1;
            UIManager.getInstance().removeUIContainer(this);
            this.factionPersonPanel.hide();
            this.factionFunctionPanel.hide();
            _super.prototype.hide.call(this);
            // this.queenPanel.hide();
        };
        ExistFactionUiPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        ExistFactionUiPanel.prototype.butClik = function (evt) {
            console.log("--btn---", evt.target);
            switch (evt.target) {
                case this.tab_person:
                    this.selectlo(0);
                    break;
                case this.tab_shang:
                    this.selectlo(1);
                    // this.setRedPoint();
                    break;
                case this.w_close:
                    ModuleEventManager.dispatchEvent(new faction.FactionEvent(faction.FactionEvent.HIDE_EXISTFACTIONUI_EVENT));
                    break;
                default:
                    break;
            }
        };
        return ExistFactionUiPanel;
    })(WindowUi);
    faction.ExistFactionUiPanel = ExistFactionUiPanel;
})(faction || (faction = {}));
//# sourceMappingURL=ExistFactionUiPanel.js.map