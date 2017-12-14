var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PointListShader = (function (_super) {
    __extends(PointListShader, _super);
    function PointListShader() {
        _super.call(this);
    }
    PointListShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "n3Position");
    };
    PointListShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec3 n3Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform vec4 scalesizenum;" +
            "varying vec3 v_colorvec;" +
            "void main(void)" +
            "{" +
            "   v_colorvec = n3Position;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "   gl_PointSize     = scalesizenum.x;" +
            "}";
        return $str;
    };
    PointListShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying vec3 v_colorvec;" +
            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(v_colorvec, 1.0);\n" +
            "}";
        return $str;
    };
    PointListShader.PointListShader = "PointListShader";
    return PointListShader;
})(Shader3D);
var PointListSpriter = (function (_super) {
    __extends(PointListSpriter, _super);
    function PointListSpriter() {
        _super.call(this);
    }
    PointListSpriter.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(PointListShader.PointListShader, new PointListShader);
        this.shader = ProgrmaManager.getInstance().getProgram(PointListShader.PointListShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        var $point = new Array();
        var $color = new Array();
        for (var i = 0; i < 1000; i++) {
            $point.push(random(100) - 50, random(100) - 50, random(100) - 50);
            $color.push(Math.random(), Math.random(), Math.random());
        }
        this.setNewItemData($point, $color);
    };
    PointListSpriter.prototype.setNewItemData = function ($point, $color) {
        if ($color === void 0) { $color = null; }
        this.objData.vertices = new Array();
        this.objData.normals = new Array();
        for (var i = 0; i < $point.length / 3; i++) {
            this.objData.vertices.push($point[i * 3 + 0], $point[i * 3 + 1], $point[i * 3 + 2]);
            if ($color) {
                if ($point.length == $color.length) {
                    this.objData.normals.push($color[i * 3 + 0], $color[i * 3 + 1], $color[i * 3 + 2]);
                }
                else {
                    var $alpha = $color[i * 4 + 3];
                    this.objData.normals.push($color[i * 4 + 0] * $alpha, $color[i * 4 + 1] * $alpha, $color[i * 4 + 2] * $alpha);
                }
            }
            else {
                this.objData.normals.push(1, 0, 0);
            }
        }
        this.upToGpu();
    };
    PointListSpriter.prototype.upToGpu = function () {
        this.objData.treNum = this.objData.vertices.length / 3;
        this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
        this.objData.normalsBuffer = Scene_data.context3D.uploadBuff3D(this.objData.normals);
    };
    PointListSpriter.prototype.update = function () {
        if (this.objData && this.objData.vertexBuffer) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setWriteDepth(false);
            Scene_data.context3D.setDepthTest(false);
            Scene_data.context3D.setBlendParticleFactors(1);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVc4fv(this.shader, "scalesizenum", [PointListSpriter.PointSize, 1, 1, 1]);
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 3, this.objData.normalsBuffer);
            Scene_data.context3D.renderContext.drawArrays(Scene_data.context3D.renderContext.POINTS, 0, this.objData.treNum);
        }
    };
    PointListSpriter.PointSize = 1;
    return PointListSpriter;
})(BaseDiplay3dSprite);
//# sourceMappingURL=PointListSpriter.js.map