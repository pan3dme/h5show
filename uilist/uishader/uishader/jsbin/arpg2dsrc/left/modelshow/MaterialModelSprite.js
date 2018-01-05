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
var MaterialModelShader = /** @class */ (function (_super) {
    __extends(MaterialModelShader, _super);
    function MaterialModelShader() {
        return _super.call(this) || this;
    }
    MaterialModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
    };
    MaterialModelShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 v2CubeTexST;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(v2CubeTexST.x, v2CubeTexST.y);" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = vpMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    MaterialModelShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(fs0, v_texCoord.xy);\n" +
            "gl_FragColor =vec4(1.0,0.0,0.0,1.0);\n" +
            "}";
        return $str;
    };
    MaterialModelShader.MaterialModelShader = "MaterialModelShader";
    return MaterialModelShader;
}(Shader3D));
var left;
(function (left) {
    var MaterialModelSprite = /** @class */ (function (_super) {
        __extends(MaterialModelSprite, _super);
        function MaterialModelSprite() {
            var _this = _super.call(this) || this;
            GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/cartoontree05.txt", function (groupRes) {
                _this.loadPartRes(groupRes);
            });
            _this.setLightMapUrl("ui/load/blood.png");
            return _this;
        }
        MaterialModelSprite.prototype.setCamPos = function ($material) {
            var $scale = 1;
            $material.updateCam(Scene_data.cam3D.x / $scale, Scene_data.cam3D.y / $scale, Scene_data.cam3D.z / $scale);
        };
        MaterialModelSprite.prototype.loadPartRes = function (groupRes) {
            for (var i = 0; i < groupRes.dataAry.length; i++) {
                var item = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    this.scaleX = this.scaleY = this.scaleZ = 0.2;
                    this.setObjUrl(item.objUrl);
                    this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                    return;
                }
            }
        };
        MaterialModelSprite.prototype.setMaterialUrl = function (value, $paramData) {
            var _this = this;
            if ($paramData === void 0) { $paramData = null; }
            value = value.replace("_byte.txt", ".txt");
            value = value.replace(".txt", "_byte.txt");
            this.materialUrl = Scene_data.fileRoot + value;
            MaterialManager.getInstance().getMaterialByte(this.materialUrl, function ($material) {
                _this.material = $material;
                if ($paramData) {
                    _this.materialParam = new MaterialBaseParam();
                    _this.materialParam.setData(_this.material, $paramData);
                }
            }, null, true, MaterialShader.MATERIAL_SHADER, MaterialShader);
        };
        MaterialModelSprite.prototype.updateMaterial = function () {
            if (!this.material || !this.objData) {
                return;
            }
            var $tempShader = this.material.shader;
            Scene_data.context3D._contextSetTest.clear();
            Scene_data.context3D.setProgram($tempShader.program);
            Scene_data.context3D.setVcMatrix4fv($tempShader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($tempShader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setRenderTexture($tempShader, "fs0", this.lightMapTextureRes.texture, 0);
            Scene_data.context3D.pushVa(this.objData.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, this.objData.stride, this.objData.uvsOffsets);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        };
        return MaterialModelSprite;
    }(Display3DSprite));
    left.MaterialModelSprite = MaterialModelSprite;
})(left || (left = {}));
//# sourceMappingURL=MaterialModelSprite.js.map