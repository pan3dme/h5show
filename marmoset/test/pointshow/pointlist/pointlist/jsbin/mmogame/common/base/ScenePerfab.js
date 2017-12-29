var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ScenePerfab = (function (_super) {
    __extends(ScenePerfab, _super);
    function ScenePerfab() {
        _super.apply(this, arguments);
    }
    ScenePerfab.prototype.setPerfabName = function ($str) {
        var _this = this;
        this.item = new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            _this.loadPartRes("", groupRes, _this.item);
        });
    };
    ScenePerfab.prototype.updateRotationMatrix = function () {
        _super.prototype.updateRotationMatrix.call(this);
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            if ($dis && $dis.rotationData) {
                if ($dis.rotationData) {
                    this._rotationMatrix.getRotaion($dis.rotationData);
                }
            }
        }
    };
    return ScenePerfab;
})(Display3dMovie);
//# sourceMappingURL=ScenePerfab.js.map