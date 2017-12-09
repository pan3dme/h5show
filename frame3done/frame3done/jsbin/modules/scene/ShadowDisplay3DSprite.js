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
var ShadowDisplay3DShader = /** @class */ (function (_super) {
    __extends(ShadowDisplay3DShader, _super);
    function ShadowDisplay3DShader() {
        return _super.call(this) || this;
    }
    ShadowDisplay3DShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
        $context.bindAttribLocation(this.program, 2, "lightPosition");
    };
    ShadowDisplay3DShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "attribute vec2 lightPosition;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat4 shadowViewMatx3D;" +
            "uniform vec4 uvtx;\n" +
            "varying vec2 v_texCoord;" +
            "varying vec2 v_lightCoord;" +
            "varying vec3 v_PositionFromLight;" +
            "varying vec4 v_uvtx;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(u2Texture.x, u2Texture.y);" +
            "   v_lightCoord = vec2(lightPosition.x, lightPosition.y);" +
            "   v_uvtx = uvtx;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = vpMatrix3D * vt0;" +
            "   vec4 vt1= vec4(v3Position, 1.0);" +
            "   vt1 = posMatrix3D * vt1;" +
            "   vt1 = shadowViewMatx3D * vt1;" +
            "   v_PositionFromLight = vec3(vt1.x, vt1.y,vt1.z);" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    ShadowDisplay3DShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "uniform sampler2D depht_texture;\n" +
            "uniform sampler2D l_texture;\n" +
            "varying vec2 v_texCoord;" +
            "varying vec2 v_lightCoord;" +
            "varying vec3 v_PositionFromLight;" +
            "varying vec4 v_uvtx;" +
            "float toNum(vec4 vect){\n" +
            "float a= vect.x * 255.0;\n" +
            "float b= vect.y * 255.0;\n" +
            "return  (a * 255.0 + b) / (255.0*255.0);\n" +
            " }\n" +
            "float getuvvisible(vec2 uvpos,float uvbias){\n" +
            "vec4 uvft5 = texture2D(depht_texture, uvpos.xy); " + //深度图采样
            "float uvdephz  =toNum(uvft5); " +
            "float uvvisibility = (v_PositionFromLight.z > uvdephz + uvbias) ? 0.9 : 1.0;\n" + //深度判断
            "return  uvvisibility;\n" +
            " }\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            "vec4 lightUv = texture2D(l_texture, v_lightCoord.xy*v_uvtx.xy+v_uvtx.zw);\n" +
            "float bias  =0.01; " +
            "float thxy  = 0.0005; " +
            "float totalnum =getuvvisible(vec2(v_PositionFromLight.x, v_PositionFromLight.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x+thxy, v_PositionFromLight.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x-thxy, v_PositionFromLight.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x, v_PositionFromLight.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x, v_PositionFromLight.y-thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x+thxy, v_PositionFromLight.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x+thxy, v_PositionFromLight.y-thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x-thxy, v_PositionFromLight.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(v_PositionFromLight.x-thxy, v_PositionFromLight.y-thxy),bias) ; " +
            "float visibility = totalnum;\n" + //深度判断
            "gl_FragColor =infoUv*lightUv*visibility ;\n" +
            "}";
        return $str;
    };
    ShadowDisplay3DShader.ShadowDisplay3DShader = "ShadowDisplay3DShader";
    return ShadowDisplay3DShader;
}(Shader3D));
var ShadowDisplay3DSprite = /** @class */ (function (_super) {
    __extends(ShadowDisplay3DSprite, _super);
    function ShadowDisplay3DSprite() {
        var _this = _super.call(this) || this;
        _this.uxtxData = new Float32Array([0.5, 0.5, 0, 0]);
        ProgrmaManager.getInstance().registe(ShadowDisplay3DShader.ShadowDisplay3DShader, new ShadowDisplay3DShader);
        return _this;
    }
    ShadowDisplay3DSprite.prototype.setFrameNodeUrl = function ($vo) {
        var $dis = new Display3DSprite();
        this.setObjUrl($vo.resurl);
        this.setPicUrl($vo.materialInfoArr[0].url);
        this.setLightMapUrl($vo.lighturl);
        this.shader = ProgrmaManager.getInstance().getProgram(ShadowDisplay3DShader.ShadowDisplay3DShader);
    };
    ShadowDisplay3DSprite.prototype.update = function () {
        if (!Scene_data.fbo || !ShadowModel.shadowViewMatx3D) {
            return;
        }
        if (this.objData && this.objData.indexBuffer) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "shadowViewMatx3D", ShadowModel.shadowViewMatx3D.m);
            Scene_data.context3D.setVc4fv(this.shader, "uvtx", this.uxtxData);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, this.objData.stride, this.objData.uvsOffsets);
            Scene_data.context3D.setVaOffset(2, 2, this.objData.stride, this.objData.lightuvsOffsets);
            Scene_data.context3D.setRenderTexture(this.shader, "s_texture", this.baseTexture.texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "depht_texture", Scene_data.fbo.texture, 1);
            Scene_data.context3D.setRenderTexture(this.shader, "l_texture", this.lightMapTextureRes.texture, 2);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return ShadowDisplay3DSprite;
}(Display3DSprite));
//# sourceMappingURL=ShadowDisplay3DSprite.js.map