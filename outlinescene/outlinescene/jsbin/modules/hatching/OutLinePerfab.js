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
var OutLinePerfab = /** @class */ (function (_super) {
    __extends(OutLinePerfab, _super);
    function OutLinePerfab() {
        var _this = _super.call(this) || this;
        _this._uvscaleData = [1, 1];
        return _this;
    }
    OutLinePerfab.prototype.loadPartRes = function ($bindSocket, groupRes, ary) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                var display = new OutLineSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                display.dynamic = true;
                ary.push(display);
                display.setBind(this, $bindSocket);
                SceneManager.getInstance().addDisplay(display);
            }
        }
        this.updateMatrix();
        this.uvscaleData = this._uvscaleData;
    };
    Object.defineProperty(OutLinePerfab.prototype, "uvscaleData", {
        get: function () {
            return this._uvscaleData;
        },
        set: function (value) {
            this._uvscaleData = value;
            for (var i = 0; i < this.item.length; i++) {
                var $dis = this.item[i];
                if ($dis) {
                    $dis.uvscaleData = this._uvscaleData;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    OutLinePerfab.prototype.updateMatrix = function () {
        _super.prototype.updateMatrix.call(this);
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            if ($dis) {
                $dis.posMatrix = this.posMatrix.clone();
            }
        }
    };
    OutLinePerfab.prototype.setPerfabName = function ($str) {
        var _this = this;
        this.item = new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            _this.loadPartRes("", groupRes, _this.item);
        });
    };
    OutLinePerfab.prototype.updateRotationMatrix = function () {
        _super.prototype.updateRotationMatrix.call(this);
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            if ($dis && $dis._rotationData) {
                if ($dis._rotationData) {
                    this._rotationMatrix.getRotaion($dis._rotationData);
                }
            }
        }
    };
    return OutLinePerfab;
}(ScenePerfab));
//# sourceMappingURL=OutLinePerfab.js.map