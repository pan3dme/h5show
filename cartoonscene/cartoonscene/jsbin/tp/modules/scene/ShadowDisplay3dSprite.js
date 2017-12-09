var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ShadowDisplay3dShader = (function (_super) {
    __extends(ShadowDisplay3dShader, _super);
    function ShadowDisplay3dShader() {
        _super.call(this);
    }
    ShadowDisplay3dShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    ShadowDisplay3dShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(u2Texture.x, u2Texture.y);" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = vpMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    ShadowDisplay3dShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D f0;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(f0, v_texCoord.xy);\n" +
            "gl_FragColor =infoUv;\n" +
            "}";
        return $str;
    };
    ShadowDisplay3dShader.ShadowDisplay3dShader = "ShadowDisplay3dShader";
    return ShadowDisplay3dShader;
})(Shader3D);
var ShadowModel = (function () {
    function ShadowModel() {
    }
    ShadowModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new ShadowModel();
        }
        return this._instance;
    };
    ShadowModel.prototype.updateFBO = function () {
        if (!Scene_data.fbo) {
            Scene_data.fbo = Scene_data.context3D.getFBO();
        }
        Scene_data.context3D.updateFBO(Scene_data.fbo);
        Scene_data.viewMatrx3D.identity();
        Scene_data.context3D.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
        Scene_data.viewMatrx3D.perspectiveFieldOfViewLH(2, 1, 50, Scene_data.camFar);
        Scene_data.viewMatrx3D.appendScale(2, 2 * (Scene_data.stageWidth / Scene_data.stageHeight), 1);
        MathClass.updateVp();
        Scene_data.context3D.setProgram(null);
        SceneManager.getInstance().updateSpriteDisplay();
        Engine.resetSize();
    };
    return ShadowModel;
})();
var ShadowDisplay3dSprite = (function (_super) {
    __extends(ShadowDisplay3dSprite, _super);
    function ShadowDisplay3dSprite() {
        _super.call(this);
        this.initData();
    }
    ShadowDisplay3dSprite.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(ShadowDisplay3dShader.ShadowDisplay3dShader, new ShadowDisplay3dShader);
        this.shader = ProgrmaManager.getInstance().getProgram(ShadowDisplay3dShader.ShadowDisplay3dShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.vertices.push(-100, 0, -100);
        this.objData.vertices.push(+100, 0, -100);
        this.objData.vertices.push(+100, 0, +100);
        this.objData.vertices.push(-100, 0, +100);
        this.objData.uvs = new Array();
        this.objData.uvs.push(0, 0);
        this.objData.uvs.push(1, 0);
        this.objData.uvs.push(1, 1);
        this.objData.uvs.push(0, 1);
        this.objData.indexs = new Array();
        this.objData.indexs.push(0, 1, 2);
        this.objData.indexs.push(0, 2, 3);
        this.loadTexture();
        this.upToGpu();
    };
    ShadowDisplay3dSprite.prototype.loadTexture = function () {
        var $ctx = UIManager.getInstance().getContext2D(128, 128, false);
        $ctx.fillStyle = "rgb(255,255,255)";
        $ctx.fillRect(0, 0, 128, 128);
        this._uvTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);
        // this.setPicUrl("pan/128.jpg")
    };
    ShadowDisplay3dSprite.prototype.setPicUrl = function ($str) {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $str, function ($texture) {
            _this._uvTextureRes = $texture;
        });
    };
    ShadowDisplay3dSprite.prototype.upToGpu = function () {
        if (this.objData.indexs.length) {
            this.objData.treNum = this.objData.indexs.length;
            this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
            this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);
            this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
        }
    };
    ShadowDisplay3dSprite.prototype.update = function () {
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);
            if (Scene_data.fbo) {
                Scene_data.context3D.setRenderTexture(this.shader, "f0", Scene_data.fbo.texture, 0);
            }
            else {
                Scene_data.context3D.setRenderTexture(this.shader, "f0", this._uvTextureRes.texture, 0);
            }
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return ShadowDisplay3dSprite;
})(Display3D);
//# sourceMappingURL=ShadowDisplay3dSprite.js.map