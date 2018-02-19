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
/*
class MaterialModelShader extends Shader3D {
    static MaterialModelShader: string = "MaterialModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
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
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
                "vec4 infoUv = texture2D(fs0, v_texCoord.xy);\n" +
                "gl_FragColor =vec4(1.0,0.0,0.0,1.0);\n" +
            "}"
        return $str

    }

}
*/
var left;
(function (left) {
    var MaterialModelSprite = /** @class */ (function (_super) {
        __extends(MaterialModelSprite, _super);
        function MaterialModelSprite() {
            var _this = _super.call(this) || this;
            //model/cartoontree05.txt
            //model/cartoontree05.txt
            GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/pan3dme1.txt", function (groupRes) {
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
                    this.scaleX = this.scaleY = this.scaleZ = 10;
                    this.setObjUrl(item.objUrl);
                    this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                    return;
                }
            }
        };
        MaterialModelSprite.prototype.update = function () {
            _super.prototype.update.call(this);
        };
        MaterialModelSprite.prototype.setMaterialTexture = function ($material, $mp) {
            if ($mp === void 0) { $mp = null; }
            var texVec = $material.texList;
            for (var i = 0; i < texVec.length; i++) {
                if (texVec[i].type == TexItem.LIGHTMAP) {
                    Scene_data.context3D.setRenderTexture($material.shader, texVec[i].name, this.lightMapTexture, texVec[i].id);
                }
                else if (texVec[i].type == TexItem.LTUMAP && Scene_data.pubLut) {
                    Scene_data.context3D.setRenderTexture($material.shader, texVec[i].name, Scene_data.pubLut, texVec[i].id);
                }
                else if (texVec[i].type == TexItem.CUBEMAP) {
                    if ($material.useDynamicIBL) {
                    }
                    else {
                        var index = Math.floor($material.roughness * 5);
                        if (Scene_data.skyCubeMap) {
                            var cubeTexture = Scene_data.skyCubeMap[index];
                            Scene_data.context3D.setRenderTextureCube($material.program, texVec[i].name, cubeTexture, texVec[i].id);
                        }
                    }
                }
                else {
                    if (texVec[i].texture) {
                        Scene_data.context3D.setRenderTexture($material.shader, texVec[i].name, texVec[i].texture, texVec[i].id);
                    }
                }
            }
            if ($mp) {
                for (i = 0; i < $mp.dynamicTexList.length; i++) {
                    if ($mp.dynamicTexList[i].target) {
                        Scene_data.context3D.setRenderTexture($material.shader, $mp.dynamicTexList[i].target.name, $mp.dynamicTexList[i].texture, $mp.dynamicTexList[i].target.id);
                    }
                }
            }
        };
        return MaterialModelSprite;
    }(Display3DSprite));
    left.MaterialModelSprite = MaterialModelSprite;
})(left || (left = {}));
//# sourceMappingURL=MaterialModelSprite.js.map