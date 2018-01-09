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
    var MtUIRenderComponent = /** @class */ (function (_super) {
        __extends(MtUIRenderComponent, _super);
        function MtUIRenderComponent() {
            return _super.call(this) || this;
        }
        MtUIRenderComponent.prototype.createFrame = function ($upskin) {
            var frameMc = new materialui.MtFrameCompenent;
            frameMc.skinName = $upskin;
            var rec = this.uiAtlas.getRec($upskin);
            frameMc.setFrameData(rec);
            frameMc.uiRender = this;
            return frameMc;
        };
        MtUIRenderComponent.prototype.creatBaseComponent = function ($skinName) {
            var ui = new materialui.MtUICompenent();
            ui.skinName = $skinName;
            var rec = this.uiAtlas.getRec($skinName);
            ui.tr.setRec(rec);
            ui.width = rec.pixelWitdh;
            ui.height = rec.pixelHeight;
            ui.uiRender = this;
            return ui;
        };
        MtUIRenderComponent.prototype.creatGrid9Component = function ($skinName, $width, $height) {
            var ui = new materialui.MtGrid9Compenent();
            ui.skinName = $skinName;
            var rec = this.uiAtlas.getGridRec($skinName);
            ui.tr.setRec(rec);
            ui.ogw = rec.ogw;
            ui.ogh = rec.ogh;
            ui.gw = ui.ogw / rec.pixelWitdh;
            ui.gh = ui.ogh / rec.pixelHeight;
            ui.width = $width;
            ui.height = $height;
            ui.uiRender = this;
            return ui;
        };
        return MtUIRenderComponent;
    }(UIRenderComponent));
    materialui.MtUIRenderComponent = MtUIRenderComponent;
})(materialui || (materialui = {}));
//# sourceMappingURL=MtUIRenderComponent.js.map