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
        MaterialModelSprite.prototype.setInputVa = function () {
            Scene_data.context3D.setVa(0, 3, this.inputObjdata.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.inputObjdata.uvBuffer);
            if (!(this.material.directLight || this.material.noLight)) {
                Scene_data.context3D.setVa(2, 2, this.inputObjdata.lightUvBuffer);
            }
            if (this.material.usePbr || this.material.directLight) {
                Scene_data.context3D.setVa(3, 3, this.inputObjdata.normalsBuffer);
                Scene_data.context3D.setVcMatrix3fv(this.material.shader, "rotationMatrix3D", this._rotationData);
            }
            if (this.material.useNormal) {
                Scene_data.context3D.setVa(4, 3, this.inputObjdata.tangentBuffer);
                Scene_data.context3D.setVa(5, 3, this.inputObjdata.bitangentBuffer);
            }
            this.objData = this.inputObjdata;
        };
        MaterialModelSprite.prototype.setMaterialVaCompress = function () {
            if (this.inputObjdata) {
                this.setInputVa();
            }
            else {
                _super.prototype.setMaterialVaCompress.call(this);
            }
        };
        return MaterialModelSprite;
    }(Display3DSprite));
    left.MaterialModelSprite = MaterialModelSprite;
})(left || (left = {}));
//# sourceMappingURL=MaterialModelSprite.js.map