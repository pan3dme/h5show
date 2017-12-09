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
var FrameBuildSprite = /** @class */ (function (_super) {
    __extends(FrameBuildSprite, _super);
    function FrameBuildSprite() {
        return _super.call(this) || this;
    }
    FrameBuildSprite.prototype.setFrameNodeUrl = function ($vo) {
        this.groupItem = new Array();
        var $dis = new Display3DSprite();
        $dis._rotationData = new Float32Array(9);
        $dis.setObjUrl($vo.resurl);
        $dis.setPicUrl($vo.materialInfoArr[0].url);
        $dis.sceneVisible = false;
        this.groupItem.push($dis);
    };
    FrameBuildSprite.prototype.update = function () {
        if (this.sceneVisible) {
            Scene_data.context3D.setWriteDepth(true);
            _super.prototype.update.call(this);
        }
    };
    return FrameBuildSprite;
}(DirectShadowDisplay3DSprite));
//# sourceMappingURL=FrameBuildSprite.js.map