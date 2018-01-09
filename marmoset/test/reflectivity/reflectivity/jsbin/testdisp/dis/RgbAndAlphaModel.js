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
var RgbAndAlphaModelShader = /** @class */ (function (_super) {
    __extends(RgbAndAlphaModelShader, _super);
    function RgbAndAlphaModelShader() {
        return _super.call(this) || this;
    }
    RgbAndAlphaModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    RgbAndAlphaModelShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(u2Texture.x, 1.0-u2Texture.y);" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    RgbAndAlphaModelShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "uniform sampler2D s_alpha;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            "vec4 alphaUv = texture2D(s_alpha, v_texCoord.xy);\n" +
            "infoUv.w = alphaUv.x;\n" +
            "gl_FragColor =infoUv;\n" +
            "}";
        return $str;
    };
    RgbAndAlphaModelShader.RgbAndAlphaModelShader = "RgbAndAlphaModelShader";
    return RgbAndAlphaModelShader;
}(Shader3D));
var RgbAndAlphaModelSprite = /** @class */ (function (_super) {
    __extends(RgbAndAlphaModelSprite, _super);
    function RgbAndAlphaModelSprite() {
        return _super.call(this) || this;
    }
    RgbAndAlphaModelSprite.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(RgbAndAlphaModelShader.RgbAndAlphaModelShader, new RgbAndAlphaModelShader);
        this.shader = ProgrmaManager.getInstance().getProgram(RgbAndAlphaModelShader.RgbAndAlphaModelShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.vertices.push(-1, 1, 0.5);
        this.objData.vertices.push(1, 1, 0.5);
        this.objData.vertices.push(1, -1, 0.5);
        this.objData.vertices.push(-1, -1, 0.5);
        this.objData.uvs = new Array();
        this.objData.uvs.push(0, 0);
        this.objData.uvs.push(1, 0);
        this.objData.uvs.push(1, 1);
        this.objData.uvs.push(0, 1);
        this.objData.indexs = new Array();
        this.objData.indexs.push(0, 1, 2);
        this.objData.indexs.push(0, 2, 3);
        this.upToGpu();
    };
    RgbAndAlphaModelSprite.prototype.drawModel = function ($texture, $alpha) {
        if (this.objData && this.objData.indexBuffer) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);
            Scene_data.context3D.setRenderTexture(this.shader, "s_texture", $texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "s_alpha", $alpha, 0);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return RgbAndAlphaModelSprite;
}(BaseDiplay3dSprite));
var RgbAndAlphaModel = /** @class */ (function () {
    function RgbAndAlphaModel() {
    }
    RgbAndAlphaModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new RgbAndAlphaModel();
        }
        return this._instance;
    };
    RgbAndAlphaModel.prototype.fromFilesMergeAlpha = function (a, b) {
        this.renderContext = Scene_data.context3D.renderContext;
        var $fboRect = new Rectangle(0, 0, Math.max(a.width, b.width), Math.max(a.height, b.height));
        var fbo = this.getFBO($fboRect); //512*512
        this.updateDepthTexture(fbo);
        this.renderContext.viewport(0, 0, $fboRect.width, $fboRect.width);
        this.renderContext.clearColor(0, 0, 0, 0);
        this.renderContext.clearDepth(1.0);
        this.renderContext.enable(this.renderContext.DEPTH_TEST);
        this.renderContext.depthMask(true);
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        this.renderContext.frontFace(this.renderContext.CW);
        this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT);
        var $outTextureSprite = new RgbAndAlphaModelSprite();
        $outTextureSprite.drawModel(a.texture, b.texture);
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        Engine.resetSize();
        var $textureRes = new TextureRes();
        $textureRes.texture = Scene_data.context3D.creatTexture($fboRect.width, $fboRect.height);
        $textureRes.width = $fboRect.width;
        $textureRes.height = $fboRect.height;
        $textureRes.useNum = 1;
        $textureRes.texture = fbo.texture;
        return $textureRes;
    };
    RgbAndAlphaModel.prototype.updateDepthTexture = function (fbo) {
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    };
    RgbAndAlphaModel.prototype.getFBO = function (fboRect) {
        this.renderContext = Scene_data.context3D.renderContext;
        var gl = Scene_data.context3D.renderContext;
        var fbo = new FBO();
        fbo.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fboRect.width, fboRect.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        fbo.frameBuffer = gl.createFramebuffer();
        fbo.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fboRect.width, fboRect.height);
        return fbo;
    };
    return RgbAndAlphaModel;
}());
//# sourceMappingURL=RgbAndAlphaModel.js.map