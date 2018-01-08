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
var materialui;
(function (materialui) {
    var ComboBoxMenuPanel = /** @class */ (function (_super) {
        __extends(ComboBoxMenuPanel, _super);
        function ComboBoxMenuPanel() {
            var _this = _super.call(this) || this;
            _this.width = 200;
            _this.height = 200;
            _this.layer = 1000;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this._bottomRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this._midRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this._topRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this.loadConfigCom();
            return _this;
        }
        ComboBoxMenuPanel.prototype.loadConfigCom = function () {
            this.d_empty_bg = this.addEvntBut("d_empty_bg", this._bottomRender);
            this.d_empty_bg.top = 0;
            this.d_empty_bg.left = 0;
            this.d_empty_bg.width = Scene_data.stageWidth;
            this.d_empty_bg.height = Scene_data.stageHeight;
        };
        ComboBoxMenuPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.d_empty_bg:
                    break;
                default:
                    this._comBoxFun && this._comBoxFun(evt.target.data);
                    break;
            }
            this.hide();
        };
        ComboBoxMenuPanel.prototype.showComboBoxList = function ($comboxData, $comBoxFun) {
            this._comboxData = $comboxData;
            this._comBoxFun = $comBoxFun;
            this.clear();
            for (var i = 0; i < this._comboxData.length; i++) {
                var $ui = this.addEvntBut("d_combobox_frame", this._topRender);
                $ui.goToAndStop(i);
                $ui.data = this._comboxData[i].type;
                this.comboboxItem.push($ui);
                this.drawFrontToFrame($ui, ColorType.Black000000 + String(this._comboxData[i].name));
                $ui.x = 0;
                $ui.y = i * 21;
            }
        };
        ComboBoxMenuPanel.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
        };
        ComboBoxMenuPanel.prototype.clear = function () {
            if (!this.comboboxItem) {
                this.comboboxItem = new Array();
            }
            while (this.comboboxItem.length) {
                var $ui = this.comboboxItem.pop();
                this.removeChild($ui);
            }
        };
        ComboBoxMenuPanel.prototype.drawFrontToFrame = function ($ui, $str, $align) {
            if ($align === void 0) { $align = TextAlign.CENTER; }
            var $toRect = $ui.getSkinCtxRect();
            var $ctx = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            $ctx.clearRect(0, 0, $toRect.width, $toRect.height);
            $ctx.fillStyle = "#ffffff"; // text color
            $ctx.fillRect(0, 0, $toRect.width, $toRect.height);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        };
        return ComboBoxMenuPanel;
    }(UIPanel));
    materialui.ComboBoxMenuPanel = ComboBoxMenuPanel;
})(materialui || (materialui = {}));
//# sourceMappingURL=ComboBoxMenuPanel.js.map