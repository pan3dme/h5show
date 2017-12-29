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
var LightSpriteList = /** @class */ (function (_super) {
    __extends(LightSpriteList, _super);
    function LightSpriteList() {
        var _this = _super.call(this) || this;
        //"model/fanguan.txt"
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", function (groupRes) {
            _this.loadPartRes(groupRes);
        });
        return _this;
    }
    LightSpriteList.prototype.setCamPos = function ($material) {
        var $scale = 1;
        $material.updateCam(Scene_data.cam3D.x / $scale, Scene_data.cam3D.y / $scale, Scene_data.cam3D.z / $scale);
    };
    LightSpriteList.prototype.loadPartRes = function (groupRes) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.scaleX = this.scaleY = this.scaleZ = 10;
                this.setObjUrl(item.objUrl);
                this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                return;
            }
        }
    };
    return LightSpriteList;
}(Display3DSprite));
//# sourceMappingURL=LightSpriteList.js.map