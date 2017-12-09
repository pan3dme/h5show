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
var OutTextureShader = /** @class */ (function (_super) {
    __extends(OutTextureShader, _super);
    function OutTextureShader() {
        return _super.call(this) || this;
    }
    OutTextureShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    OutTextureShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(u2Texture.x, u2Texture.y);" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    OutTextureShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            "gl_FragColor =infoUv;\n" +
            "}";
        return $str;
    };
    OutTextureShader.OutTextureShader = "OutTextureShader";
    return OutTextureShader;
}(Shader3D));
var OutTextureSprite = /** @class */ (function (_super) {
    __extends(OutTextureSprite, _super);
    function OutTextureSprite() {
        return _super.call(this) || this;
    }
    OutTextureSprite.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(OutTextureShader.OutTextureShader, new OutTextureShader);
        this.shader = ProgrmaManager.getInstance().getProgram(OutTextureShader.OutTextureShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.vertices.push(-1, 1, 0.5);
        this.objData.vertices.push(0, 1, 0.5);
        this.objData.vertices.push(0, -1, 0.5);
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
    OutTextureSprite.prototype.showTexture = function ($texture) {
        Scene_data.context3D.update();
        Scene_data.context3D.setDepthTest(true);
        MathClass.getCamView(Scene_data.cam3D, Scene_data.focus3D); //一定要角色帧渲染后再重置镜头矩阵
        if (this.objData && this.objData.indexBuffer) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);
            Scene_data.context3D.setRenderTexture(this.shader, "s_texture", $texture, 0);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return OutTextureSprite;
}(BaseDiplay3dSprite));
//# sourceMappingURL=OutTextureSprite.js.map