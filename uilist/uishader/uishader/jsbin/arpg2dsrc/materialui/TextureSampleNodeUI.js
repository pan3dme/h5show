var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var TextureSampleNodeUI = (function (_super) {
        __extends(TextureSampleNodeUI, _super);
        function TextureSampleNodeUI() {
            _super.call(this);
            this.left = 400;
            this.top = 100;
        }
        TextureSampleNodeUI.prototype.makePointUi = function () {
            this.pointuv = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointrgb = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointr = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointg = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointb = this.addEvntBut("a_point_frame", this._bottomRender);
            this.pointrgba = this.addEvntBut("a_point_frame", this._bottomRender);
            /*
                        var $h: number = 17
            this.pointuv.goToAndStop(0);
            this.pointuv.x = 10;
            this.pointuv.y = 30;

            this.pointrgb.goToAndStop(0);
            this.pointrgb.x = 130;
            this.pointrgb.y = 30

            this.pointr.goToAndStop(0);
            this.pointr.x = 130;
            this.pointr.y = 30 + $h * 1;

            this.pointg.goToAndStop(0);
            this.pointg.x = 130;
            this.pointg.y = 30 + $h * 2;

            this.pointb.goToAndStop(0);
            this.pointb.x = 130;
            this.pointb.y = 30 + $h * 3;

            this.pointrgba.goToAndStop(0);
            this.pointrgba.x = 130;
            this.pointrgba.y = 30 + $h * 4;
            */
        };
        return TextureSampleNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.TextureSampleNodeUI = TextureSampleNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=TextureSampleNodeUI.js.map