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
var left;
(function (left) {
    var BuildMaterialShader = /** @class */ (function (_super) {
        __extends(BuildMaterialShader, _super);
        function BuildMaterialShader() {
            var _this = _super.call(this) || this;
            _this.name = "BuildMaterialShader";
            return _this;
        }
        BuildMaterialShader.prototype.buildParamAry = function ($material) {
            this.paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
        };
        BuildMaterialShader.BuildMaterialShader = "BuildMaterialShader";
        return BuildMaterialShader;
    }(MaterialShader));
    left.BuildMaterialShader = BuildMaterialShader;
})(left || (left = {}));
//# sourceMappingURL=BuildMaterialShader.js.map