var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OutLineShader = (function (_super) {
    __extends(OutLineShader, _super);
    function OutLineShader() {
        _super.call(this);
    }
    OutLineShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    OutLineShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec3 nrm3Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec3 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = nrm3Position;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    OutLineShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying vec3 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(v_texCoord,1.0);\n" +
            "}";
        return $str;
    };
    OutLineShader.OutLineShader = "OutLineShader";
    return OutLineShader;
})(Shader3D);
var OutLineSprite = (function (_super) {
    __extends(OutLineSprite, _super);
    function OutLineSprite() {
        _super.call(this);
        ProgrmaManager.getInstance().registe(OutLineShader.OutLineShader, new OutLineShader);
        this.shader = ProgrmaManager.getInstance().getProgram(OutLineShader.OutLineShader);
    }
    OutLineSprite.prototype.update = function () {
        if (this.objData && this.objData.indexBuffer) {
            var tf = Scene_data.context3D.pushVa(this.objData.vertexBuffer);
            if (tf) {
            }
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 3, this.objData.stride, this.objData.normalsOffsets);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return OutLineSprite;
})(Display3DSprite);
var OutLinePerfab = (function (_super) {
    __extends(OutLinePerfab, _super);
    function OutLinePerfab() {
        _super.apply(this, arguments);
    }
    OutLinePerfab.prototype.loadPartRes = function ($bindSocket, groupRes, ary) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                var display = new OutLineSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                display.dynamic = true;
                ary.push(display);
                display.setBind(this, $bindSocket);
                SceneManager.getInstance().addDisplay(display);
            }
        }
    };
    OutLinePerfab.prototype.updateMatrix = function () {
        _super.prototype.updateMatrix.call(this);
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            if ($dis) {
                $dis.posMatrix = this.posMatrix.clone();
            }
        }
    };
    return OutLinePerfab;
})(ScenePerfab);
//# sourceMappingURL=OutLineSprite.js.map