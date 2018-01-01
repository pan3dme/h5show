var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SceneBaseChar = (function (_super) {
    __extends(SceneBaseChar, _super);
    function SceneBaseChar() {
        _super.apply(this, arguments);
        this._avatar = -1;
        this._visible = true;
    }
    Object.defineProperty(SceneBaseChar.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
        },
        enumerable: true,
        configurable: true
    });
    SceneBaseChar.prototype.setAvatar = function (num) {
        if (this._avatar == num) {
            return;
        }
        this._avatar = num;
        this.setRoleUrl(this.getSceneCharAvatarUrl(num));
    };
    SceneBaseChar.prototype.update = function () {
        if (this.visible) {
            _super.prototype.update.call(this);
        }
        if (this._shadow) {
            this._shadow._visible = this.visible;
        }
    };
    SceneBaseChar.prototype.getSceneCharAvatarUrl = function (num) {
        var $url = getRoleUrl(String(num));
        return getRoleUrl(String(num));
    };
    SceneBaseChar.prototype.getSceneCharWeaponUrl = function (num, $suffix) {
        if ($suffix === void 0) { $suffix = ""; }
        return getModelUrl(String(num + $suffix));
    };
    return SceneBaseChar;
})(Display3dMovie);
//# sourceMappingURL=SceneBaseChar.js.map