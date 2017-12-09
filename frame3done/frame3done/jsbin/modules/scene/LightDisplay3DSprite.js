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
var LightDisplay3DShader = /** @class */ (function (_super) {
    __extends(LightDisplay3DShader, _super);
    function LightDisplay3DShader() {
        return _super.call(this) || this;
    }
    LightDisplay3DShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    LightDisplay3DShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "attribute vec2 lightPosition;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform vec4 uvtx;\n" +
            "varying vec2 v_texCoord;" +
            "varying vec2 v_lightCoord;" +
            "varying vec4 v_uvtx;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(u2Texture.x, u2Texture.y);" +
            "   v_lightCoord = vec2(lightPosition.x, lightPosition.y);" +
            "   v_uvtx = uvtx;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = vpMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    LightDisplay3DShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "uniform sampler2D l_texture;\n" +
            "varying vec2 v_texCoord;" +
            "varying vec2 v_lightCoord;" +
            "varying vec4 v_uvtx;" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            "vec4 lightUv = texture2D(l_texture, v_lightCoord.xy*v_uvtx.xy+v_uvtx.zw);\n" +
            "gl_FragColor =infoUv*lightUv*2.0 ;\n" +
            "}";
        return $str;
    };
    LightDisplay3DShader.LightDisplay3DShader = "LightDisplay3DShader";
    return LightDisplay3DShader;
}(Shader3D));
var LightDisplay3DSprite = /** @class */ (function (_super) {
    __extends(LightDisplay3DSprite, _super);
    function LightDisplay3DSprite() {
        var _this = _super.call(this) || this;
        _this.uxtxData = new Float32Array([1, 1, 0, 0]);
        ProgrmaManager.getInstance().registe(LightDisplay3DShader.LightDisplay3DShader, new LightDisplay3DShader);
        return _this;
    }
    LightDisplay3DSprite.prototype.setFrameNodeUrl = function ($vo) {
        var $dis = new Display3DSprite();
        this.setObjUrl($vo.resurl);
        this.setPicUrl($vo.materialInfoArr[0].url);
        this.setLightMapUrl($vo.lighturl);
        this.shader = ProgrmaManager.getInstance().getProgram(LightDisplay3DShader.LightDisplay3DShader);
    };
    LightDisplay3DSprite.prototype.update = function () {
        if (this.objData && this.objData.indexBuffer && this.sceneVisible) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVc4fv(this.shader, "uvtx", this.uxtxData);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, this.objData.stride, this.objData.uvsOffsets);
            Scene_data.context3D.setVaOffset(2, 2, this.objData.stride, this.objData.lightuvsOffsets);
            Scene_data.context3D.setRenderTexture(this.shader, "s_texture", this.baseTexture.texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "l_texture", this.lightMapTextureRes.texture, 2);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return LightDisplay3DSprite;
}(Display3DSprite));
//# sourceMappingURL=LightDisplay3DSprite.js.map