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
var BaseShadowShader = /** @class */ (function (_super) {
    __extends(BaseShadowShader, _super);
    function BaseShadowShader() {
        return _super.call(this) || this;
    }
    BaseShadowShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    BaseShadowShader.prototype.getVertexShaderString = function () {
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
    /*
            private toVect4($num:number): Vector3D
        {
            var temp: number = Math.floor(65536 * $num);
            var a: number = Math.floor(temp / 256);
            var b: number = Math.floor(temp - a * 256);
            return new Vector3D(a / 256, b / 256,0,1);
    
        }
        */
    BaseShadowShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "varying vec2 v_texCoord;\n" +
            "vec4 tovect4(float num){\n" +
            "float temp=floor(num*255.0*255.0);\n" +
            "float a=floor(temp / 255.0);\n" +
            "float b=floor(temp - a * 255.0);\n" +
            "return  vec4(a / 255.0, b / 255.0,0.0,1.0);\n" +
            // "return  vec4(1.0,1.0,1.0,1.0);\n" +
            " }\n" +
            "void main(void)\n" +
            "{\n" +
            "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            //  "gl_FragColor = vec4(gl_FragCoord.z,0,0,1);\n" +
            "gl_FragColor = tovect4(gl_FragCoord.z);\n" +
            "}";
        return $str;
    };
    BaseShadowShader.BaseShadowShader = "BaseShadowShader";
    return BaseShadowShader;
}(Shader3D));
var Md5ShadowShader = /** @class */ (function (_super) {
    __extends(Md5ShadowShader, _super);
    function Md5ShadowShader() {
        return _super.call(this) || this;
    }
    Md5ShadowShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "pos");
        $context.bindAttribLocation(this.program, 1, "v2Uv");
        $context.bindAttribLocation(this.program, 2, "boneID");
        $context.bindAttribLocation(this.program, 3, "boneWeight");
    };
    Md5ShadowShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec4 pos;\n" +
            "attribute vec2 v2Uv;\n" +
            "attribute vec4 boneID;\n" +
            "attribute vec4 boneWeight;\n" +
            "varying vec2 v0;\n" +
            "uniform vec4 boneQ[54];\n" +
            "uniform vec3 boneD[54];\n" +
            "uniform mat4 vpMatrix3D;\n" +
            "uniform mat4 posMatrix3D; \n" +
            "vec4 qdv(vec4 q, vec3 d, vec3 v ){\n" +
            "vec3 t = 2.0 * cross(q.xyz, v); \n" +
            "vec3 f = v + q.w * t + cross(q.xyz, t); \n" +
            " return vec4(f.x + d.x, f.y + d.y, f.z + d.z, 1.0); \n" +
            " } \n" +
            " vec4 getQDdata(vec3 vdata){\n" +
            "  vec4 tempnum = qdv(boneQ[int(boneID.x)], boneD[int(boneID.x)], vdata) * boneWeight.x; \n" +
            " tempnum += qdv(boneQ[int(boneID.y)], boneD[int(boneID.y)], vdata) * boneWeight.y; \n" +
            "  tempnum += qdv(boneQ[int(boneID.z)], boneD[int(boneID.z)], vdata) * boneWeight.z; \n" +
            " tempnum += qdv(boneQ[int(boneID.w)], boneD[int(boneID.w)], vdata) * boneWeight.w; \n" +
            " tempnum.x = tempnum.x * -1.0; \n" +
            " return tempnum; \n" +
            " } \n" +
            "  vec4 qdvNrm(vec4 q, vec3 v ){\n" +
            " vec3 t = 2.0 * cross(q.xyz, v); \n" +
            "  vec3 f = v + q.w * t + cross(q.xyz, t); \n" +
            "  return vec4(f.x, f.y, f.z, 1.0); \n" +
            "  } \n" +
            "  vec4 getQDdataNrm(vec3 vdata){\n" +
            "  vec4 tempnum = qdvNrm(boneQ[int(boneID.x)], vdata) * boneWeight.x; \n" +
            "  tempnum += qdvNrm(boneQ[int(boneID.y)], vdata) * boneWeight.y; \n" +
            "  tempnum += qdvNrm(boneQ[int(boneID.z)], vdata) * boneWeight.z; \n" +
            " tempnum += qdvNrm(boneQ[int(boneID.w)], vdata) * boneWeight.w; \n" +
            " tempnum.x = tempnum.x * -1.0; \n" +
            "  tempnum.xyz = normalize(tempnum.xyz); \n" +
            "   return tempnum; \n" +
            "    } \n" +
            "  void main(void){\n" +
            "   v0 = v2Uv; \n" +
            "   vec4 vt0 = getQDdata(vec3(pos.x, pos.y, pos.z)); \n" +
            "   vt0.xyz = vt0.xyz * 1.0; \n" +
            "  vt0 = posMatrix3D * vt0; \n" +
            "  vt0 = vpMatrix3D * vt0; \n" +
            "  gl_Position = vt0; \n" +
            "  } ";
        return $str;
    };
    Md5ShadowShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            " uniform sampler2D fs0;\n" +
            "varying vec2 v0; \n" +
            "vec4 tovect4(float num){\n" +
            "float temp=floor(num*255.0*255.0);\n" +
            "float a=floor(temp / 255.0);\n" +
            "float b=floor(temp - a * 255.0);\n" +
            "return  vec4(a / 255.0, b / 255.0,0.0,1.0);\n" +
            // "return  vec4(1.0,1.0,1.0,1.0);\n" +
            " }\n" +
            " void main(void)\n" +
            " {\n" +
            "    vec4 infoUv = texture2D(fs0, v0.xy);\n" +
            "   gl_FragColor = tovect4(gl_FragCoord.z);\n" +
            " }";
        return $str;
    };
    Md5ShadowShader.Md5ShadowShader = "Md5ShadowShader";
    return Md5ShadowShader;
}(Shader3D));
var ShadowModel = /** @class */ (function () {
    function ShadowModel() {
        this.sunRotationX = -45;
        this.sunRotationY = +0;
        this.sunDistens100 = 200;
    }
    ShadowModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new ShadowModel();
        }
        return this._instance;
    };
    ShadowModel.prototype.getFBO = function () {
        FBO.fw = 1024;
        FBO.fh = 1024;
        FBO.fw = 2048;
        FBO.fh = 2048;
        FBO.fw = 1024;
        FBO.fh = 1024;
        this.renderContext = Scene_data.context3D.renderContext;
        var gl = Scene_data.context3D.renderContext;
        var fbo = new FBO();
        fbo.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FBO.fw, FBO.fh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        fbo.frameBuffer = gl.createFramebuffer();
        fbo.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, FBO.fw, FBO.fh);
        return fbo;
    };
    ShadowModel.prototype.updateDepthTexture = function (fbo) {
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    };
    //创建可引用的阴影贴图  （-1~+1）=》（0~1）;
    ShadowModel.prototype.makeUseShadowView = function () {
        Scene_data.viewMatrx3D.appendTranslation(1, 1, 1); //+1
        Scene_data.viewMatrx3D.appendScale(0.5, 0.5, 0.5); //*0.5
        MathClass.updateVp();
        ShadowModel.shadowViewMatx3D = Scene_data.vpMatrix.clone();
    };
    ShadowModel.prototype.updateDepth = function () {
        if (!Scene_data.fbo) {
            Scene_data.fbo = this.getFBO(); //512*512
        }
        this.updateDepthTexture(Scene_data.fbo);
        this.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
        this.renderContext.clearColor(1, 1, 1, 1);
        this.renderContext.clearDepth(1.0);
        this.renderContext.enable(this.renderContext.DEPTH_TEST);
        this.renderContext.depthMask(true);
        this.renderContext.frontFace(this.renderContext.CW);
        this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT);
        this.sunDistens100 = Scene_data.cam3D.distance * 0.7;
        this.sunDistens100 = Math.max(this.sunDistens100, 50);
        Scene_data.viewMatrx3D.identity();
        Scene_data.viewMatrx3D.appendScale(1 / this.sunDistens100, 1 / this.sunDistens100, 1 / 1000);
        Scene_data.cam3D.cameraMatrix.identity();
        Scene_data.cam3D.cameraMatrix.prependTranslation(0, 0, 0);
        var $eyem = MathUtil.lookAt(new Vector3D(Scene_data.light.sunDirect[0], Scene_data.light.sunDirect[1], Scene_data.light.sunDirect[2]), new Vector3D());
        Scene_data.cam3D.cameraMatrix.prepend($eyem);
        MathClass.updateVp();
        ShadowModel.shadowViewMatx3D = Scene_data.vpMatrix.clone();
        Scene_data.context3D.setProgram(null);
        for (var j = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof DirectShadowDisplay3DSprite) {
                    var $oso = $display3d;
                    for (var k = 0; k < $oso.groupItem.length; k++) {
                        this.drawTempSprite($oso.groupItem[k], $oso.posMatrix);
                    }
                }
            }
        }
        this.drawRoleList();
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        this.makeUseShadowView();
        Engine.resetSize();
    };
    ShadowModel.prototype.drawRoleList = function () {
        for (var i = 0; i < SceneManager.getInstance().displayRoleList.length; i++) {
            var $display3d = SceneManager.getInstance().displayRoleList[i];
            $display3d.upShadow();
        }
    };
    ShadowModel.prototype.drawTempSprite = function ($dis, $posMatrix) {
        ProgrmaManager.getInstance().registe(BaseShadowShader.BaseShadowShader, new BaseShadowShader);
        var $shader = ProgrmaManager.getInstance().getProgram(BaseShadowShader.BaseShadowShader);
        if (!this._uvTextureRes) {
            var $ctx = UIManager.getInstance().getContext2D(128, 128, false);
            $ctx.fillStyle = "rgb(255,0,255)";
            $ctx.fillRect(0, 0, 128, 128);
            this._uvTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);
        }
        Scene_data.context3D.setProgram($shader.program);
        Scene_data.context3D.setVcMatrix4fv($shader, "vpMatrix3D", Scene_data.vpMatrix.m);
        Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", $posMatrix.m);
        var tf = Scene_data.context3D.pushVa($dis.objData.vertexBuffer);
        Scene_data.context3D.setVaOffset(0, 3, $dis.objData.stride, 0);
        Scene_data.context3D.setVaOffset(1, 2, $dis.objData.stride, $dis.objData.uvsOffsets);
        Scene_data.context3D.setRenderTexture($shader, "s_texture", $dis.baseTexture.texture, 0);
        Scene_data.context3D.drawCall($dis.objData.indexBuffer, $dis.objData.treNum);
    };
    return ShadowModel;
}());
//# sourceMappingURL=ShadowModel.js.map