var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ScenePortal = (function (_super) {
    __extends(ScenePortal, _super);
    function ScenePortal() {
        _super.call(this);
        this.shadow = false;
    }
    ScenePortal.prototype.removeStage = function () {
        _super.prototype.removeStage.call(this);
    };
    ScenePortal.prototype.showBlood = function ($colorType) {
        if ($colorType === void 0) { $colorType = 0; }
    };
    ScenePortal.prototype.setAvatar = function (num) {
        this.addPart("abc", "cde", getModelUrl(String(num)));
        this.tittleHeight = 20;
    };
    ScenePortal.prototype.addStage = function () {
        _super.prototype.addStage.call(this);
    };
    return ScenePortal;
})(SceneChar);
//# sourceMappingURL=ScenePortal.js.map