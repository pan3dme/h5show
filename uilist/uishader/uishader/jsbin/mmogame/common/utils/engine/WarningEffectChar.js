var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WarningEffectChar = (function (_super) {
    __extends(WarningEffectChar, _super);
    function WarningEffectChar() {
        _super.call(this);
        this.shadow = false;
    }
    WarningEffectChar.prototype.removeStage = function () {
        _super.prototype.removeStage.call(this);
    };
    WarningEffectChar.prototype.showBlood = function ($colorType) {
        if ($colorType === void 0) { $colorType = 0; }
    };
    WarningEffectChar.prototype.updateFrame = function (t) {
        if (this._disappearTm < TimeUtil.getTimer()) {
            SceneManager.getInstance().removeMovieDisplay(this);
        }
        else {
            _super.prototype.updateFrame.call(this, t);
        }
    };
    WarningEffectChar.prototype.setSpellName = function ($alarmEffect) {
        this.addPart("abc", "cde", getModelUrl(String($alarmEffect)));
        this.tittleHeight = 20;
        this._disappearTm = TimeUtil.getTimer() + 2000;
    };
    WarningEffectChar.prototype.addStage = function () {
        _super.prototype.addStage.call(this);
    };
    return WarningEffectChar;
})(SceneChar);
//# sourceMappingURL=WarningEffectChar.js.map