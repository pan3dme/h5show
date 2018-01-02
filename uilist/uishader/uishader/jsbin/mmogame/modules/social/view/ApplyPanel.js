var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var social;
(function (social) {
    var ApplyPanel = (function (_super) {
        __extends(ApplyPanel, _super);
        function ApplyPanel() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.middle = 0;
            this.center = 0;
            this.setBlackBg();
            //添加好友面板渲染器
            this._AbgRender = new UIRenderComponent;
            this.addRender(this._AbgRender);
            this._AbottomRender = new UIRenderComponent;
            this.addRender(this._AbottomRender);
            this._AbaseRender = new UIRenderComponent;
            this.addRender(this._AbaseRender);
            this._AtopRender = new UIRenderComponent;
            this.addRender(this._AtopRender);
            this._AbgRender.uiAtlas = new UIAtlas;
        }
        ApplyPanel.prototype.dispose = function () {
            this._AbgRender.dispose();
            this._AbgRender = null;
            this._AbaseRender.dispose();
            this._AbaseRender = null;
            this._AtopRender.dispose();
            this._AtopRender = null;
            if (this.applyList) {
                this.applyList.dispose();
                this.applyList = null;
            }
            _super.prototype.dispose.call(this);
        };
        ApplyPanel.prototype.applyLoad = function () {
            var _this = this;
            this._AbottomRender.uiAtlas = WindowUi.winUIAtlas;
            this._AbgRender.uiAtlas.setInfo("ui/uidata/social/socialmodel.xml", "ui/uidata/social/socialmodel.png", function () { _this.loadConfigCom(); }, "ui/uidata/social/socialpc.png");
        };
        ApplyPanel.prototype.loadConfigCom = function () {
            this._AbaseRender.uiAtlas = this._AbgRender.uiAtlas;
            this._AtopRender.uiAtlas = this._AbgRender.uiAtlas;
            var renderLevel = this._AtopRender;
            this.a_btn3 = this.addEvntButUp("cnew_btn1", this._AbottomRender);
            this.setSizeForPanelUiCopy(this.a_btn3, "a_btn3", renderLevel);
            this._AbottomRender.applyObjData();
            this.listIndex1 = this.addChild(renderLevel.getComponent("listIndex1"));
            this.addUIList(["aF_txt3", "aF_txt2", "aF_txt1", "line1111", "line11111", "aY_cleartxt", "aY_txt", "line22", "line3_1"], renderLevel);
            this.applyLoadComplete();
            this.resize();
        };
        ApplyPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.applyList) {
                this.applyList.left = this.listIndex1.parent.x / UIData.Scale + this.listIndex1.x;
                this.applyList.top = this.listIndex1.parent.y / UIData.Scale + this.listIndex1.y;
            }
        };
        ApplyPanel.prototype.show = function () {
            UIManager.getInstance().addUIContainer(this);
            if (!this.applyList) {
                this.applyList = new social.ApplyList();
                this.applyList.init(this._AtopRender.uiAtlas);
            }
            this.applyList.show();
            this.resize();
        };
        ApplyPanel.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
            if (this.applyList) {
                this.applyList.hide();
            }
        };
        ApplyPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.e_close:
                    this.hide();
                    break;
                case this.a_btn3:
                    var $ary = GuidData.social.getApplyList();
                    if ($ary.length > 0) {
                        // console.log("一键清空");
                        NetManager.getInstance().protocolos.social_clear_apply();
                    }
                    break;
                default:
                    break;
            }
        };
        return ApplyPanel;
    })(WindowMinUi);
    social.ApplyPanel = ApplyPanel;
})(social || (social = {}));
//# sourceMappingURL=ApplyPanel.js.map