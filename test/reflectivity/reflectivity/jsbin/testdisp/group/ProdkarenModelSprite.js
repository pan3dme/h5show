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
var ProdkarenModelShader = /** @class */ (function (_super) {
    __extends(ProdkarenModelShader, _super);
    function ProdkarenModelShader() {
        return _super.call(this) || this;
    }
    ProdkarenModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");
    };
    ProdkarenModelShader.prototype.getVertexShaderString = function () {
        var $str = "#define MOBILE\n" +
            "#define NOBLEND\n" +
            "#define SHADOW_COUNT 3\n" +
            "#define LIGHT_COUNT 3\n" +
            "precision highp float;\n" +
            "uniform mat4 uModelViewProjectionMatrix;\n" +
            "uniform mat4 uSkyMatrix;\n" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vTexCoord;\n" +
            "attribute vec2 vTangent;\n" +
            "attribute vec2 vBitangent;\n" +
            "attribute vec2 vNormal;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "attribute vec4 vColor;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "attribute vec2 vTexCoord2;\n" +
            "#endif\n" +
            "varying highp vec3 D;\n" +
            "varying mediump vec2 j;\n" +
            "varying mediump vec3 E;\n" +
            "varying mediump vec3 F;\n" +
            "varying mediump vec3 G;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "varying lowp vec4 H;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "varying mediump vec2 I;\n" +
            "#endif\n" +
            "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}vec4 m(mat4 o,vec3 p){return o[0]*p.x+(o[1]*p.y+(o[2]*p.z+o[3]));\n" +
            "}vec3 ih(mat4 o,vec3 id){return o[0].xyz*id.x+o[1].xyz*id.y+o[2].xyz*id.z;\n" +
            "}void main(void){gl_Position=m(uModelViewProjectionMatrix,vPosition.xyz);\n" +
            "j=vTexCoord;\n" +
            "E=ih(uSkyMatrix,ic(vTangent));\n" +
            "F=ih(uSkyMatrix,ic(vBitangent));\n" +
            "G=ih(uSkyMatrix,ic(vNormal));\n" +
            "D=m(uSkyMatrix,vPosition.xyz).xyz;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "H=vColor;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "I=vTexCoord2;\n" +
            "#endif\n" +
            "}\n";
        return $str;
    };
    ProdkarenModelShader.prototype.getFragmentShaderString = function () {
        var $str = "#define MOBILE\n" +
            "#define NOBLEND\n" +
            "#define SHADOW_COUNT 3\n" +
            "#define LIGHT_COUNT 3\n" +
            "#extension GL_OES_standard_derivatives : enable\n" +
            "precision mediump float;\n" +
            "varying highp vec3 D;\n" +
            "varying mediump vec2 j;\n" +
            "varying mediump vec3 E;\n" +
            "varying mediump vec3 F;\n" +
            "varying mediump vec3 G;\n" +
            "#ifdef VERTEX_COLOR\n" +
            "varying lowp vec4 H;\n" +
            "#endif\n" +
            "#ifdef TEXCOORD_SECONDARY\n" +
            "varying mediump vec2 I;\n" +
            "#endif\n" +
            "uniform sampler2D tAlbedo;\n" +
            "uniform sampler2D tReflectivity;\n" +
            "uniform sampler2D tNormal;\n" +
            "uniform sampler2D tExtras;\n" +
            "uniform sampler2D tSkySpecular;\n" +
            "uniform vec4 uDiffuseCoefficients[9];\n" +
            "uniform vec3 uCameraPosition;\n" +
            "uniform vec3 uFresnel;\n" +
            "uniform float uAlphaTest;\n" +
            "uniform float uHorizonOcclude;\n" +
            "uniform float uHorizonSmoothing;\n" +
            "#ifdef EMISSIVE\n" +
            "uniform float uEmissiveScale;\n" +
            "uniform vec4 uTexRangeEmissive;\n" +
            "#endif\n" +
            "#ifdef AMBIENT_OCCLUSION\n" +
            "uniform vec4 uTexRangeAO;\n" +
            "#endif\n" +
            "#ifdef LIGHT_COUNT\n" +
            "uniform vec4 uLightPositions[LIGHT_COUNT];\n" +
            "uniform vec3 uLightDirections[LIGHT_COUNT];\n" +
            "uniform vec3 uLightColors[LIGHT_COUNT];\n" +
            "uniform vec3 uLightParams[LIGHT_COUNT];\n" +
            "uniform vec3 uLightSpot[LIGHT_COUNT];\n" +
            "#endif\n" +
            "#ifdef ANISO\n" +
            "uniform float uAnisoStrength;\n" +
            "uniform vec3 uAnisoTangent;\n" +
            "uniform float uAnisoIntegral;\n" +
            "uniform vec4 uTexRangeAniso;\n" +
            "#endif\n" +
            "#define saturate(x) clamp( x, 0.0, 1.0 )\n" +
            "vec3 L(vec3 c){return c*c;\n" +
            "}vec3 O(vec3 n){vec3 fA=E;\n" +
            "vec3 fB=F;\n" +
            "vec3 fC=gl_FrontFacing?G:-G;\n" +
            "#ifdef TSPACE_RENORMALIZE\n" +
            "fC=normalize(fC);\n" +
            "#endif\n" +
            "#ifdef TSPACE_ORTHOGONALIZE\n" +
            "fA-=dot(fA,fC)*fC;\n" +
            "#endif\n" +
            "#ifdef TSPACE_RENORMALIZE\n" +
            "fA=normalize(fA);\n" +
            "#endif\n" +
            "#ifdef TSPACE_ORTHOGONALIZE\n" +
            "fB=(fB-dot(fB,fC)*fC)-dot(fB,fA)*fA;\n" +
            "#endif\n" +
            "#ifdef TSPACE_RENORMALIZE\n" +
            "fB=normalize(fB);\n" +
            "#endif\n" +
            "#ifdef TSPACE_COMPUTE_BITANGENT\n" +
            "vec3 fD=cross(fC,fA);\n" +
            "fB=dot(fD,fB)<0.0?-fD:fD;\n" +
            "#endif\n" +
            "n=2.0*n-vec3(1.0);\n" +
            "return normalize(fA*n.x+fB*n.y+fC*n.z);\n" +
            "}" +
            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(1.0,0.0,1.0,1.0);\n" +
            "}";
        return $str;
    };
    ProdkarenModelShader.ProdkarenModelShader = "ProdkarenModelShader";
    return ProdkarenModelShader;
}(Shader3D));
var ProdkarenModelSprite = /** @class */ (function (_super) {
    __extends(ProdkarenModelSprite, _super);
    function ProdkarenModelSprite() {
        var _this = _super.call(this) || this;
        _this.skipNum = 0;
        _this.scaleX = 10;
        _this.scaleY = 10;
        _this.scaleZ = 10;
        ProgrmaManager.getInstance().registe(ProdkarenModelShader.ProdkarenModelShader, new ProdkarenModelShader);
        _this.shader = ProgrmaManager.getInstance().getProgram(ProdkarenModelShader.ProdkarenModelShader);
        _this.program = _this.shader.program;
        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", function ($buff) {
            _this.modelBuff = $buff;
        });
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", function (groupRes) {
            _this.loadPartRes(groupRes);
        });
        return _this;
    }
    ProdkarenModelSprite.prototype.loadPartRes = function (groupRes) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.kkkDisplay3DSprite = new Display3DSprite;
                this.kkkDisplay3DSprite.setObjUrl(item.objUrl);
                return;
            }
        }
    };
    ProdkarenModelSprite.prototype.loadTexture = function () {
        var _this = this;
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic703432.txt", function ($texture) {
            _this._uvTextureRes = $texture;
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic598211.txt", function ($texture) {
            _this.glossTextRes = $texture;
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic535317.txt", function ($texture) {
            _this.normalTextRes = $texture;
        });
    };
    ProdkarenModelSprite.prototype.update = function () {
        if (this.kkkDisplay3DSprite && this.kkkDisplay3DSprite.objData) {
            if (this._uvTextureRes && this.glossTextRes && this.normalTextRes && this.modelBuff) {
                Scene_data.context3D.setProgram(this.program);
                var $uModelViewProjectionMatrix = Scene_data.viewMatrx3D.clone();
                $uModelViewProjectionMatrix.prepend(Scene_data.cam3D.cameraMatrix);
                $uModelViewProjectionMatrix.prepend(this.posMatrix);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uModelViewProjectionMatrix", $uModelViewProjectionMatrix.m);
                var $uSkyMatrix = new Matrix3D();
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uSkyMatrix", $uSkyMatrix.m);
                Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.modelBuff);
                Scene_data.context3D.renderContext.enableVertexAttribArray(0);
                Scene_data.context3D.renderContext.enableVertexAttribArray(1);
                Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 32, 0);
                Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.FLOAT, false, 32, 12);
                Scene_data.context3D.renderContext.enableVertexAttribArray(2);
                Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 20);
                Scene_data.context3D.renderContext.enableVertexAttribArray(3);
                Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 24);
                Scene_data.context3D.renderContext.enableVertexAttribArray(4);
                Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 28);
                Scene_data.context3D.cullFaceBack(true);
                Scene_data.context3D.setRenderTexture(this.shader, "tAlbedo", this._uvTextureRes.texture, 0);
                Scene_data.context3D.setRenderTexture(this.shader, "tReflectivity", this.normalTextRes.texture, 1);
                Scene_data.context3D.setRenderTexture(this.shader, "tNormal", this.glossTextRes.texture, 2);
                Scene_data.context3D.setRenderTexture(this.shader, "tExtras", this.glossTextRes.texture, 3);
                Scene_data.context3D.setRenderTexture(this.shader, "tSkySpecular", this.glossTextRes.texture, 4);
                Scene_data.context3D.drawCall(this.kkkDisplay3DSprite.objData.indexBuffer, this.kkkDisplay3DSprite.objData.treNum);
            }
        }
    };
    return ProdkarenModelSprite;
}(BaseDiplay3dSprite));
//# sourceMappingURL=ProdkarenModelSprite.js.map