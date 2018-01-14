var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bottomui;
(function (bottomui) {
    var BottomAotuScaleText = (function (_super) {
        __extends(BottomAotuScaleText, _super);
        function BottomAotuScaleText() {
            _super.call(this);
            this.lastAotuTextVisible = false;
            this.interfaceUI = true;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.bottom = 0;
            this.center = 0;
        }
        BottomAotuScaleText.prototype.setRender = function ($bottom, $mid, $top) {
            this._bottomRender = $bottom;
            this._midRender = $mid;
            this._topRender = $top;
            this.loadConfigCom();
        };
        BottomAotuScaleText.prototype.loadConfigCom = function () {
            this.aotuTxtItem = new Array();
            for (var i = 0; i < 5; i++) {
                this.aotuTxtItem.push(this._topRender.getComponent("e_aotu_txt_" + i));
            }
        };
        BottomAotuScaleText.prototype.updata = function (t) {
            if (AotuSkillManager.getInstance().aotuBattle) {
                if (!this.lastAotuTextVisible) {
                    this.lastAotuTextVisible = true;
                    this.setUiListVisibleByItem(this.aotuTxtItem, this.lastAotuTextVisible);
                }
                this.changeUiSize(this.aotuTxtItem);
            }
            else {
                if (this.lastAotuTextVisible) {
                    this.lastAotuTextVisible = false;
                    this.setUiListVisibleByItem(this.aotuTxtItem, this.lastAotuTextVisible);
                }
            }
        };
        BottomAotuScaleText.prototype.changeUiSize = function ($arr) {
            for (var i = 0; i < $arr.length; i++) {
                var $sn = (TimeUtil.getTimer() % 1000) / 1000;
                var $t = (TimeUtil.getTimer() + 100) / 200 - i;
                var $ui = $arr[i];
                var $scale = 0.5 + (Math.sin($t) + 1) / 5;
                $ui.width = 48 * $scale;
                $ui.height = 48 * $scale;
                var basPos = new Vector2D(354 + i * 50, 323);
                $ui.x = basPos.x + (48 - $ui.width) / 2;
                $ui.y = basPos.y + (48 - $ui.height) / 2;
            }
        };
        return BottomAotuScaleText;
    })(UIVirtualContainer);
    bottomui.BottomAotuScaleText = BottomAotuScaleText;
})(bottomui || (bottomui = {}));
//# sourceMappingURL=BottomAotuScaleText.js.map