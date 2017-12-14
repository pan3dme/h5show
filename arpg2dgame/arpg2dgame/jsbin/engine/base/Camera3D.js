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
var Camera3D = /** @class */ (function (_super) {
    __extends(Camera3D, _super);
    function Camera3D() {
        var _this = _super.call(this) || this;
        _this._distance = 500;
        _this.needChange = true;
        _this.cameraMatrix = new Matrix3D;
        return _this;
    }
    Object.defineProperty(Camera3D.prototype, "distance", {
        get: function () {
            return this._distance;
        },
        set: function (value) {
            this._distance = value;
        },
        enumerable: true,
        configurable: true
    });
    Camera3D.prototype.lookAt = function ($target) {
        this.lookAtTarget = $target;
    };
    Object.defineProperty(Camera3D.prototype, "astarRect", {
        set: function (value) {
            this._astarRect = new Rectangle();
            this._astarRect.x = value.x;
            this._astarRect.y = value.y;
            this._astarRect.width = value.width;
            this._astarRect.height = value.height;
            this._midPos = new Vector3D();
            this._midPos.x = this._astarRect.x + this._astarRect.width / 2;
            this._midPos.z = this._astarRect.y + this._astarRect.height / 2;
            this._scaleVec = new Vector3D();
            this._scaleVec.x = (this._astarRect.width - 100) / this._astarRect.width;
            this._scaleVec.z = (this._astarRect.height - 100) / this._astarRect.height;
        },
        enumerable: true,
        configurable: true
    });
    Camera3D.prototype.update = function () {
        if (this.lookAtTarget) {
        }
    };
    Object.defineProperty(Camera3D.prototype, "postion", {
        get: function () {
            return new Vector3D(this.x, this.y, this.z);
        },
        enumerable: true,
        configurable: true
    });
    return Camera3D;
}(Object3D));
//# sourceMappingURL=Camera3D.js.map