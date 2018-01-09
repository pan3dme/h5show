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
var SampleSahder = /** @class */ (function (_super) {
    __extends(SampleSahder, _super);
    function SampleSahder() {
        return _super.call(this) || this;
    }
    SampleSahder.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");
    };
    SampleSahder.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 vPosition;" +
            "attribute vec2 vTexCoord;" +
            "attribute vec2 vTangent;" +
            "attribute vec2 vBitangent;" +
            "attribute vec2 vNormal;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;\n" +
            "varying vec3 v_normal;\n" +
            "vec3 ic(vec2 id){\n" +
            "bool ie = (id.y > (32767.1 / 65535.0)); \n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}\n" +
            "void main(void)" +
            "{" +
            "v_normal =ic(vNormal/ 65535.0);\n" +
            "   v_texCoord = vec2(vTexCoord.x, vTexCoord.y);" +
            "   vec4 vt0= vec4(vPosition, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    SampleSahder.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "varying vec2 v_texCoord;\n" +
            "varying vec3 v_normal;\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            "gl_FragColor =vec4(infoUv.xyz, 1.0);\n" +
            "}";
        return $str;
    };
    SampleSahder.SampleSahder = "SampleSahder";
    return SampleSahder;
}(Shader3D));
var SampleSprite3D = /** @class */ (function (_super) {
    __extends(SampleSprite3D, _super);
    function SampleSprite3D() {
        var _this = _super.call(this) || this;
        _this.scaleX = 10;
        _this.scaleY = 10;
        _this.scaleZ = 10;
        ProgrmaManager.getInstance().registe(SampleSahder.SampleSahder, new SampleSahder);
        _this.shader = ProgrmaManager.getInstance().getProgram(SampleSahder.SampleSahder);
        _this.program = _this.shader.program;
        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", function ($buff) {
            _this.modelBuff = $buff;
        });
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", function (groupRes) {
            _this.loadPartRes(groupRes);
        });
        return _this;
    }
    SampleSprite3D.prototype.loadPartRes = function (groupRes) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.kkkDisplay3DSprite = new Display3DSprite;
                this.kkkDisplay3DSprite.setObjUrl(item.objUrl);
                return;
            }
        }
    };
    SampleSprite3D.prototype.loadTexture = function () {
        var _this = this;
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic703432.txt", function ($texture) {
            _this._uvTextureRes = $texture;
        });
    };
    SampleSprite3D.prototype.update = function () {
        if (this.kkkDisplay3DSprite && this.kkkDisplay3DSprite.objData) {
            if (this._uvTextureRes && this.modelBuff) {
                Scene_data.context3D.setProgram(this.program);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
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
                Scene_data.context3D.setRenderTexture(this.shader, "s_texture", this._uvTextureRes.texture, 0);
                Scene_data.context3D.drawCall(this.kkkDisplay3DSprite.objData.indexBuffer, this.kkkDisplay3DSprite.objData.treNum);
            }
        }
    };
    return SampleSprite3D;
}(BaseDiplay3dSprite));
//# sourceMappingURL=SampleSprite3D.js.map