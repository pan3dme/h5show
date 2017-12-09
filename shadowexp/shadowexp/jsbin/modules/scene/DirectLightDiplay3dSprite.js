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
var DirectLightDiplay3dShader = /** @class */ (function (_super) {
    __extends(DirectLightDiplay3dShader, _super);
    function DirectLightDiplay3dShader() {
        return _super.call(this) || this;
    }
    DirectLightDiplay3dShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
        $context.bindAttribLocation(this.program, 2, "v3Normal");
    };
    DirectLightDiplay3dShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 v2CubeTexST;" +
            "varying vec2 v0;" +
            "varying vec3 v2;" +
            "attribute vec3 v3Normal;" +
            "uniform vec3 sunDirect;" +
            "uniform vec3 sunColor;" +
            "uniform vec3 ambientColor;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat3 rotationMatrix3D;" +
            "void main(void){;" +
            "v0 = vec2(v2CubeTexST.x, v2CubeTexST.y); " +
            "vec4 vt0= vec4(v3Position, 1.0);" +
            "vt0 = posMatrix3D * vt0;" +
            "vt0 = vpMatrix3D * vt0;" +
            "vec3 n = rotationMatrix3D * v3Normal;" +
            "float suncos = dot(n.xyz,sunDirect.xyz);" +
            "suncos = clamp(suncos,0.0,1.0);" +
            "v2 = sunColor * suncos + ambientColor;" +
            "gl_Position = vt0;" +
            "}";
        return $str;
    };
    DirectLightDiplay3dShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v2;" +
            "void main(void)\n" +
            "{\n" +
            "vec4 ft0 = texture2D(fs0, v0); " +
            "vec4 ft1 = vec4(v2, 1.0); " +
            "vec4 ft2 = vec4(0, 0, 0, 1); " +
            "ft2.xyz = ft1.xyz*ft0.xyz; " +
            "ft2.w = 1.0; " +
            "gl_FragColor = ft2; " +
            "}";
        return $str;
    };
    DirectLightDiplay3dShader.DirectLightDiplay3dShader = "DirectLightDiplay3dShader";
    return DirectLightDiplay3dShader;
}(Shader3D));
var DirectLightDiplay3dSprite = /** @class */ (function (_super) {
    __extends(DirectLightDiplay3dSprite, _super);
    function DirectLightDiplay3dSprite() {
        var _this = _super.call(this) || this;
        _this.nrmFlag = 0;
        _this.initData();
        return _this;
    }
    DirectLightDiplay3dSprite.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(DirectLightDiplay3dShader.DirectLightDiplay3dShader, new DirectLightDiplay3dShader);
        this.modelShder = ProgrmaManager.getInstance().getProgram(DirectLightDiplay3dShader.DirectLightDiplay3dShader);
    };
    DirectLightDiplay3dSprite.prototype.setObjUrl = function (value) {
        var _this = this;
        ObjDataManager.getInstance().getObjData(Scene_data.fileRoot + value, function ($obj) {
            _this.objData = $obj;
        });
    };
    DirectLightDiplay3dSprite.prototype.getRotationMatrixM = function () {
        var $Matrix3D = new Matrix3D;
        var rotationData = new Float32Array(9);
        $Matrix3D.getRotaion(rotationData);
        return rotationData;
    };
    DirectLightDiplay3dSprite.prototype.update = function () {
        for (var i = 0; i < this.groupItem.length; i++) {
            this.drawTemp(this.groupItem[i]);
        }
    };
    DirectLightDiplay3dSprite.prototype.drawTemp = function ($dis) {
        var $objdata = $dis.objData;
        var $shader = this.modelShder;
        if ($objdata && $objdata.indexBuffer && this._uvTextureRes) {
            Scene_data.context3D.setProgram($shader.program);
            Scene_data.context3D.setVc3fv($shader, "sunDirect", Scene_data.light.sunDirect);
            Scene_data.context3D.setVc3fv($shader, "sunColor", Scene_data.light.sunColor);
            Scene_data.context3D.setVc3fv($shader, "ambientColor", Scene_data.light.ambientColor);
            Scene_data.context3D.setVcMatrix3fv($shader, "rotationMatrix3D", this.getRotationMatrixM());
            Scene_data.context3D.setVcMatrix4fv($shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $objdata.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, $objdata.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, $objdata.stride, $objdata.uvsOffsets);
            Scene_data.context3D.setVaOffset(2, 3, $objdata.stride, $objdata.normalsOffsets);
            Scene_data.context3D.setRenderTexture($shader, "fs0", this._uvTextureRes.texture, 0);
            Scene_data.context3D.drawCall($objdata.indexBuffer, $objdata.treNum);
        }
    };
    DirectLightDiplay3dSprite.prototype.setPicUrl = function ($str) {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $str, function ($texture) {
            _this._uvTextureRes = $texture;
        });
    };
    DirectLightDiplay3dSprite.prototype.setModelById = function ($str) {
        var _this = this;
        this.groupItem = new Array();
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            for (var i = 0; i < groupRes.dataAry.length; i++) {
                var item = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    var $dis = new Display3DSprite();
                    $dis.setObjUrl(item.objUrl);
                    _this.groupItem.push($dis);
                    if (item.materialInfoArr && item.materialInfoArr.length) {
                        _this.setPicUrl(item.materialInfoArr[0].url);
                    }
                    else {
                        console.log("没有指定贴图");
                    }
                }
            }
        });
    };
    return DirectLightDiplay3dSprite;
}(Display3D));
//# sourceMappingURL=DirectLightDiplay3dSprite.js.map