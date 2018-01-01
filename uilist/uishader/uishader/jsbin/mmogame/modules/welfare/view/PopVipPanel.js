var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var welfare;
(function (welfare) {
    var PopVipPanel = (function (_super) {
        __extends(PopVipPanel, _super);
        function PopVipPanel() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            this._publicbgRender1 = new UIRenderComponent;
            this.addRender(this._publicbgRender1);
            this._publicbgRender2 = new UIRenderComponent;
            this.addRender(this._publicbgRender2);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            // this._topRender = new UIRenderComponent;
            // this.addRender(this._topRender)
        }
        PopVipPanel.prototype.dispose = function () {
            this._baseRender.dispose();
            this._baseRender = null;
            // this._publicbgRender1.dispose();
            // this._publicbgRender1 = null;
            // this._publicbgRender2.dispose();
            // this._publicbgRender2 = null;
        };
        PopVipPanel.prototype.initUiAtlas = function ($uiAtlas, $publicbguiAtlas) {
            this._publicbgRender1.uiAtlas = $publicbguiAtlas;
            this._publicbgRender2.uiAtlas = $publicbguiAtlas;
            this._baseRender.uiAtlas = $uiAtlas;
            // this._topRender.uiAtlas = $uiAtlas;
            this.initView();
        };
        PopVipPanel.prototype.initView = function () {
            // this.but_qr = this.addEvntButUp("but_1", this._publicbgRender2);
            // this.but_qr.x = 317
            // this.but_qr.y = 331
            // this.but_qx = this.addEvntButUp("but_1", this._publicbgRender2);
            // this.but_qx.x = 497
            // this.but_qx.y = 331
            // var qx = this.addChild(<UICompenent>this._publicbgRender2.getComponent("qx"));
            // qx.x = 533
            // qx.y = 344
            var renderLevel = this._baseRender;
            // this.addUIList(["a_38", "a_45", "a_40", "a_42", "a_44_1"], renderLevel);
        };
        PopVipPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        PopVipPanel.prototype.show = function () {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
            }
        };
        PopVipPanel.prototype.hide = function () {
            if (this.hasStage) {
                UIManager.getInstance().removeUIContainer(this);
            }
        };
        PopVipPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.but_qr:
                    //购买vip
                    ModuleEventManager.dispatchEvent(new welfare.WelfareEvent(welfare.WelfareEvent.HIDE_Welfare_EVENT));
                    ModulePageManager.openPanel(SharedDef.MODULE_MALL, [2]);
                case this.but_qx:
                    this.hide();
                    break;
                default:
                    break;
            }
        };
        return PopVipPanel;
    })(UIConatiner);
    welfare.PopVipPanel = PopVipPanel;
})(welfare || (welfare = {}));
//# sourceMappingURL=PopVipPanel.js.map