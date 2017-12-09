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
var SceneModSprite = /** @class */ (function (_super) {
    __extends(SceneModSprite, _super);
    function SceneModSprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SceneModSprite.prototype.setModelById = function ($str) {
        var _this = this;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            for (var i = 0; i < groupRes.dataAry.length; i++) {
                var item = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    _this.setObjUrl(item.objUrl);
                    _this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                    _this.dynamic = true;
                    break;
                }
            }
        });
    };
    return SceneModSprite;
}(Display3DSprite));
//# sourceMappingURL=SceneModSprite.js.map