var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var UishaderShader = (function (_super) {
    __extends(UishaderShader, _super);
    function UishaderShader() {
        _super.call(this);
    }
    UishaderShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vNormal");
    };
    UishaderShader.prototype.getVertexShaderString = function () {
        var $str = "precision highp float;\n" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vNormal;\n" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}void main(void){" +
            "   vec4 vt0= vec4(vPosition, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "G=ic(vNormal);\n" +
            "}";
        return $str;
    };
    UishaderShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(G.xyz,1.0);\n" +
            "}";
        return $str;
    };
    UishaderShader.UishaderShader = "UishaderShader";
    return UishaderShader;
})(Shader3D);
var UishaderSprite = (function (_super) {
    __extends(UishaderSprite, _super);
    function UishaderSprite() {
        _super.call(this);
        this.skipNum = 0;
    }
    UishaderSprite.prototype.initModeStr = function ($vec, $index) {
        ProgrmaManager.getInstance().registe(UishaderShader.UishaderShader, new UishaderShader);
        this.shader = ProgrmaManager.getInstance().getProgram(UishaderShader.UishaderShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.indexs = new Array();
        this.objData.uvs = new Array();
        this.objData.tangents = new Array();
        this.objData.bitangents = new Array();
        this.objData.normals = new Array();
        for (var i = 0; i < $index.length; i++) {
            var $fcnum = 11;
            var $ind = $index[i];
            var a1 = $vec[$fcnum * $ind + 0] * 5;
            var a2 = $vec[$fcnum * $ind + 1] * 5;
            var a3 = $vec[$fcnum * $ind + 2] * 5;
            var u1 = $vec[$fcnum * $ind + 3];
            var u2 = $vec[$fcnum * $ind + 4];
            var T1 = $vec[$fcnum * $ind + 5];
            var T2 = $vec[$fcnum * $ind + 6];
            var B1 = $vec[$fcnum * $ind + 7];
            var B2 = $vec[$fcnum * $ind + 8];
            var N1 = $vec[$fcnum * $ind + 9];
            var N2 = $vec[$fcnum * $ind + 10];
            this.objData.vertices.push(a1, a2, a3);
            this.objData.uvs.push(u1, u2);
            this.pushTBN(this.objData.tangents, T1, T2);
            this.pushTBN(this.objData.bitangents, B1, B2);
            this.pushTBN(this.objData.normals, N1, N2);
            this.objData.indexs.push(i);
        }
        this.loadTexture();
        this.upToGpu();
    };
    UishaderSprite.prototype.upToGpu = function () {
        if (this.objData.indexs.length) {
            this.objData.treNum = this.objData.indexs.length;
            this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
            this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);
            this.objData.tangentBuffer = this.uploadBuff3D(this.objData.tangents);
            this.objData.bitangentBuffer = this.uploadBuff3D(this.objData.bitangents);
            this.objData.normalsBuffer = this.uploadBuff3D(this.objData.normals);
            this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
        }
    };
    UishaderSprite.prototype.uploadBuff3D = function ($jsData) {
        var renderContext = Scene_data.context3D.renderContext;
        var $buffData = renderContext.createBuffer();
        renderContext.bindBuffer(renderContext.ARRAY_BUFFER, $buffData);
        renderContext.bufferData(renderContext.ARRAY_BUFFER, new Uint16Array($jsData), renderContext.STATIC_DRAW);
        return $buffData;
    };
    UishaderSprite.prototype.update = function () {
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes && this._nrmTextureRes && this.modelBuff) {
            Scene_data.context3D.setProgram(this.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            //Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            //Scene_data.context3D.setVa(1, 3, this.objData.vertexBuffer);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.vertexBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(0);
            Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 0, 0);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.normalsBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(1);
            Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 0);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    UishaderSprite.prototype.pushTBN = function ($arr, $a, $b) {
        $arr.push($a, $b);
        // $arr.push(1, 1);
    };
    UishaderSprite.prototype.loadTexture = function () {
    };
    UishaderSprite.prototype.loadUvPic = function ($baseuv, $nrmuv) {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $baseuv, function ($texture) {
            _this._uvTextureRes = $texture;
        });
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $nrmuv, function ($texture) {
            _this._nrmTextureRes = $texture;
        });
    };
    UishaderSprite.prototype.loadFileById = function ($id, $baseuv, $nrmuv) {
        var _this = this;
        this.loadUvPic($baseuv, $nrmuv);
        LoadManager.getInstance().load(Scene_data.fileRoot + "pan/marmoset/model/objs" + $id + ".txt", LoadManager.XML_TYPE, function ($objstr) {
            var $dd = $objstr.split("|");
            _this.initModeStr(_this.getArrByStr($dd[0]), _this.getArrByStr($dd[1]));
        });
        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", function ($buff) {
            _this.modelBuff = $buff;
        });
    };
    UishaderSprite.prototype.initData = function () {
    };
    UishaderSprite.prototype.getArrByStr = function ($dtstr) {
        var configText = $dtstr.split(",");
        var $dataArr = new Array();
        for (var i = 0; i < configText.length; i++) {
            $dataArr.push(Number(configText[i]));
        }
        return $dataArr;
    };
    return UishaderSprite;
})(BaseDiplay3dSprite);
//# sourceMappingURL=UishaderSprite.js.map