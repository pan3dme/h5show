var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var left;
(function (left) {
    var BuildMaterialShader = (function (_super) {
        __extends(BuildMaterialShader, _super);
        function BuildMaterialShader() {
            _super.call(this);
            this.name = "BuildMaterialShader";
        }
        BuildMaterialShader.prototype.buildParamAry = function ($material) {
            this.paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
        };
        BuildMaterialShader.BuildMaterialShader = "BuildMaterialShader";
        return BuildMaterialShader;
    })(MaterialShader);
    left.BuildMaterialShader = BuildMaterialShader;
})(left || (left = {}));
//# sourceMappingURL=BuildMaterialShader.js.map