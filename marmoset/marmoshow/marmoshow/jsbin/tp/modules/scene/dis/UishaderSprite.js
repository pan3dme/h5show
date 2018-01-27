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
var UishaderShader = /** @class */ (function (_super) {
    __extends(UishaderShader, _super);
    function UishaderShader() {
        return _super.call(this) || this;
    }
    UishaderShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");
    };
    UishaderShader.prototype.getVertexShaderString = function () {
        var $str = "precision highp float;\n" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vTexCoord;\n" +
            "attribute vec2 vTangent;\n" +
            "attribute vec2 vBitangent;\n" +
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
            "return r ;}\n" +
            "void main(void){" +
            "   vec4 vt0= vec4(vPosition, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "j=vTexCoord;\n" +
            "E=ic(vTangent);\n" +
            "F=ic(vBitangent);\n" +
            "G=ic(vNormal);\n" +
            "D=vPosition.xyz;\n" +
            "}";
        return $str;
    };
    UishaderShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D tAlbedo;\n" +
            "uniform sampler2D tReflectivity;\n" +
            "uniform sampler2D tNormal;\n" +
            "uniform sampler2D tSkySpecular;\n" +
            "uniform vec3 uCameraPosition;\n" +
            "uniform vec4 uDiffuseCoefficients[9];\n" +
            "uniform float uHorizonOcclude;\n" +
            "uniform vec3 uFresnel;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "#define saturate(x) clamp( x, 0.0, 1.0 )\n" +
            "vec3 L(vec3 c){return c*c;}\n" +
            "vec3 O(vec3 n) { vec3 fA = E; \n" +
            "vec3 fB=F;\n" +
            "vec3 fC=G;\n" +
            "n=2.0*n-vec3(1.0);\n" +
            "return normalize(fA*n.x+fB*n.y+fC*n.z);\n" +
            "}\n" +
            "vec3 du(vec3 eN){\n" +
            "#define c(n) uDiffuseCoefficients[n].xyz\n" +
            "vec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n" +
            "#undef c\n" +
            "vec3 sqr=eN*eN;\n" +
            "C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n" +
            "C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n" +
            "return C;\n" +
            "}\n" +
            "vec3 dB(vec3 eN,float V){\n" +
            "eN/=dot(vec3(1.0),abs(eN));\n" +
            "vec2 eY=abs(eN.zx)-vec2(1.0,1.0);\n" +
            "vec2 eZ=vec2(eN.x<0.0?eY.x:-eY.x,eN.z<0.0?eY.y:-eY.y);\n" +
            "vec2 fc=(eN.y<0.0)?eZ:eN.xz;\n" +
            "fc=vec2(0.5*(254.0/256.0),0.125*0.5*(254.0/256.0))*fc+vec2(0.5,0.125*0.5);\n" +
            "float fd=fract(7.0*V);\n" +
            "fc.y+=0.125*(7.0*V-fd);\n" +
            "vec2 fe=fc+vec2(0.0,0.125);\n" +
            "vec4 ff=mix(texture2D(tSkySpecular,fc),texture2D(tSkySpecular,fe),fd);\n" +
            "vec3 r=ff.xyz*(7.0*ff.w);\n" +
            "return r*r;\n" +
            "}\n" +
            "float dC(vec3 eN,vec3 fh){float fi=dot(eN,fh);\n" +
            "fi=saturate(1.0+uHorizonOcclude*fi);\n" +
            "return fi*fi;\n" +
            "}\n" +
            "vec3 dY(vec3 T,vec3 N,vec3 U,float eH){float eI=1.0-saturate(dot(T,N));\n" +
            "float eJ=eI*eI;\n" +
            "eI*=eJ*eJ;\n" +
            "eI*=eH;\n" +
            "return(U-eI*U)+eI*uFresnel;\n" +
            "}\n" +
            "#undef saturate \n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 J=texture2D(tAlbedo,j);\n" +
            "vec3 outv3c3=vec3(0.99,1.0,1.0);\n" +
            "vec3 K=L(J.xyz);\n" +
            "vec3 N=O(texture2D(tNormal,j).xyz);\n" +
            "vec3 T=normalize(uCameraPosition-D);\n" +
            "J=texture2D(tReflectivity,j);\n" +
            "vec3 U=L(J.xyz);\n" +
            "float V=J.w;\n" +
            "float W=V;\n" +
            "float dd=1.0;\n" +
            "vec3 dn=du(N);\n" +
            "dn*=dd;\n" +
            "vec3 dv=reflect(-T,N);\n" +
            "vec3 dA=dB(dv,V);\n" +
            "dA*=dC(dv,G);\n" +
            "dA*=dY(T,N,U,V*V);\n" +
            "gl_FragColor.xyz=dn*K+dA;\n" +
            /*
            "if(outv3c3.x!=0.99){\n" +
              "gl_FragColor.xyz=outv3c3.xyz;\n" +
            "}\n" +
            */
            "gl_FragColor.w=1.0;\n" +
            "}";
        return $str;
    };
    UishaderShader.UishaderShader = "UishaderShader";
    return UishaderShader;
}(Shader3D));
var UishaderSprite = /** @class */ (function (_super) {
    __extends(UishaderSprite, _super);
    function UishaderSprite() {
        var _this = _super.call(this) || this;
        _this.skipNum = 0;
        return _this;
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
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes && this._nrmTextureRes && this._reflectivity && this._tSkySpecular) {
            Scene_data.context3D.setProgram(this.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
            //Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            //Scene_data.context3D.setVa(1, 3, this.objData.vertexBuffer);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.vertexBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(0);
            Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 0, 0);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.uvBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(1);
            Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.FLOAT, false, 0, 0);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.tangentBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(2);
            Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 0);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.bitangentBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(3);
            Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 0);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.normalsBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(4);
            Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "tAlbedo", this._uvTextureRes.texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "tNormal", this._nrmTextureRes.texture, 1);
            Scene_data.context3D.setRenderTexture(this.shader, "tReflectivity", this._reflectivity.texture, 2);
            Scene_data.context3D.setRenderTexture(this.shader, "tSkySpecular", this._tSkySpecular.texture, 3);
            this.setPrgFc();
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    UishaderSprite.prototype.setPrgFc = function () {
        Scene_data.context3D.setuniform3f(this.shader, "uCameraPosition", Scene_data.cam3D.x, Scene_data.cam3D.y, Scene_data.cam3D.z);
        var $uDiffuseCoefficients = new Float32Array([0.14585700631141663, 0.1095229983329773, 0.11986599862575531, 0, 0.0817933976650238, 0.0785657986998558, 0.10676799714565277, 0, -0.012515299953520298, -0.0038914200849831104, -0.0024973100516945124, 0, 0.1110450029373169, 0.04512010142207146, 0.015141899697482586, 0, 0.03221319988369942, 0.014369400218129158, 0.007112869992852211, -0, -0.008236129768192768, -0.005531259812414646, -0.005950029939413071, -0, -0.00837332010269165, -0.0039273700676858425, -0.0023853699676692486, 0, -0.016801999881863594, -0.0022234099451452494, 0.002148869913071394, -0, 0.040785398334264755, 0.01346640009433031, -0.0013942799996584654, 0]);
        Scene_data.context3D.setVc4fv(this.shader, "uDiffuseCoefficients", $uDiffuseCoefficients);
    };
    UishaderSprite.prototype.pushTBN = function ($arr, $a, $b) {
        $arr.push($a, $b);
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
        this.loadAlphaJpg("pan/marmoset/model/1005.jpg", "pan/marmoset/model/1009.jpg");
        ProdkarenResModel.getInstance().loadSkyTextureByUrl("picsky.txt", function ($texture) {
            _this._tSkySpecular = $texture;
        });
    };
    UishaderSprite.prototype.loadAlphaJpg = function ($rgbUrl, $alphaUrl) {
        var _this = this;
        LoadManager.getInstance().load(Scene_data.fileRoot + $rgbUrl, LoadManager.IMG_TYPE, function ($rgbImg) {
            LoadManager.getInstance().load(Scene_data.fileRoot + $rgbUrl, LoadManager.IMG_TYPE, function ($alphaImg) {
                var ctx = UIManager.getInstance().getContext2D($rgbImg.width, $rgbImg.height, false);
                ctx.drawImage($rgbImg, 0, 0, $rgbImg.width, $rgbImg.height);
                var rgbimgData = ctx.getImageData(0, 0, $rgbImg.width, $rgbImg.height);
                ctx.drawImage($alphaImg, 0, 0, $rgbImg.width, $rgbImg.height);
                var alphaimgData = ctx.getImageData(0, 0, $alphaImg.width, $alphaImg.height);
                for (var i = 0; i < rgbimgData.data.length; i += 4) {
                    var per = alphaimgData.data[i] / 255;
                    rgbimgData.data[i + 3] = alphaimgData.data[i];
                }
                TextureManager.getInstance().addRes(Scene_data.fileRoot + $rgbUrl, rgbimgData);
                TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/marmoset/model/1005.jpg", function ($texture) {
                    _this._reflectivity = $texture;
                });
            });
        });
    };
    UishaderSprite.prototype.loadFileById = function ($id, $baseuv, $nrmuv) {
        var _this = this;
        this.loadUvPic($baseuv, $nrmuv);
        LoadManager.getInstance().load(Scene_data.fileRoot + "pan/marmoset/model/objs" + $id + ".txt", LoadManager.XML_TYPE, function ($objstr) {
            var $dd = $objstr.split("|");
            _this.initModeStr(_this.getArrByStr($dd[0]), _this.getArrByStr($dd[1]));
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
}(BaseDiplay3dSprite));
//# sourceMappingURL=UishaderSprite.js.map