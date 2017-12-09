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
var ExpBakedModelShader = /** @class */ (function (_super) {
    __extends(ExpBakedModelShader, _super);
    function ExpBakedModelShader() {
        return _super.call(this) || this;
    }
    ExpBakedModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    };
    ExpBakedModelShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 u2Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform vec2 uvscale;\n" + //当前时间x,自身加速度y,粒子生命z,是否循环w
            "varying vec2 vUv;" +
            "varying vec2 vUvscale;" +
            "void main(void)" +
            "{" +
            "   vUv = u2Position;" +
            "   vUvscale = uvscale;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    ExpBakedModelShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D bakedshadow;\n" +
            "uniform sampler2D hatch0;\n" +
            "uniform sampler2D hatch1;\n" +
            "uniform sampler2D hatch2;\n" +
            "varying vec2 vUv;\n" +
            "varying vec2 vUvscale;" +
            "float shade(const in float shading, const in vec2 uv) {" +
            "float shadingFactor;" +
            "float stepSize = 1.0 / 3.0;" +
            "float alpha = 0.0;" +
            "float scaleWhite = 0.0;" +
            "float scaleHatch0 = 0.0;" +
            "float scaleHatch1 = 0.0;" +
            "float scaleHatch2 = 0.0;" +
            "if (shading <= stepSize) {" +
            "alpha = 3.0 * shading;" +
            "scaleHatch1 = alpha;" +
            "scaleHatch2 = 1.0 - alpha;" +
            "}" +
            "else if (shading > stepSize && shading <= 2.0 * stepSize) {" +
            "alpha = 3.0 * (shading - stepSize);" +
            "scaleHatch0 = alpha;" +
            "scaleHatch1 = 1.0 - alpha;" +
            "}" +
            "else if (shading > 2.0 * stepSize) {" +
            "alpha = 3.0 * (shading - stepSize * 2.0);" +
            "scaleWhite = alpha;" +
            "scaleHatch0 = 1.0 - alpha;" +
            "}" +
            "shadingFactor = scaleWhite +" +
            "scaleHatch0 * texture2D(hatch0, uv).r +" +
            "scaleHatch1 * texture2D(hatch1, uv).r +" +
            "scaleHatch2 * texture2D(hatch2, uv).r;" +
            "return shadingFactor;" +
            "}" +
            "void main(void)\n" +
            "{\n" +
            "vec2 uv = vUv * vUvscale.x;\n" +
            "vec2 uv2 = vUv.yx * vUvscale.y;\n" +
            "float shading = texture2D(bakedshadow, vUv).r*1.7+0.1;\n" +
            "shading  = shading;\n" +
            "float crossedShading = shade(shading, uv) * shade(shading, uv2) * 0.6 + 0.4;\n" +
            "gl_FragColor = vec4(vec3(crossedShading), 1.0);\n" +
            // "vec4 infoUv = texture2D(bakedshadow, vUv.xy);\n" +
            // "gl_FragColor = infoUv;\n" +
            "}";
        return $str;
    };
    ExpBakedModelShader.ExpBakedModelShader = "ExpBakedModelShader";
    return ExpBakedModelShader;
}(Shader3D));
var ExpBakedModel = /** @class */ (function () {
    function ExpBakedModel() {
        this.loadHatchRes0();
        this.loadHatchRes1();
        this.loadHatchRes2();
        this.loadBakedshadowRes();
    }
    ExpBakedModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new ExpBakedModel();
        }
        return this._instance;
    };
    ExpBakedModel.prototype.loadHatchRes0 = function () {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_0.jpg", function ($texture) {
            _this.hatchRes0 = $texture;
        });
    };
    ExpBakedModel.prototype.loadHatchRes1 = function () {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_1.jpg", function ($texture) {
            _this.hatchRes1 = $texture;
        });
    };
    ExpBakedModel.prototype.loadHatchRes2 = function () {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_2.jpg", function ($texture) {
            _this.hatchRes2 = $texture;
        });
    };
    ExpBakedModel.prototype.loadBakedshadowRes = function () {
        var _this = this;
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/room_baked.jpg", function ($texture) {
            _this.bakedshadowRes = $texture;
        });
    };
    ExpBakedModel.prototype.getFBO = function () {
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
    ExpBakedModel.prototype.updateDepthTexture = function (fbo) {
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    };
    ExpBakedModel.prototype.renderBacked = function () {
        if (!this.fbo) {
            this.fbo = this.getFBO(); //512*512
        }
        this.updateDepthTexture(this.fbo);
        this.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
        this.renderContext.clearColor(0, 0, 0, 1);
        this.renderContext.clearDepth(1.0);
        this.renderContext.enable(this.renderContext.DEPTH_TEST);
        this.renderContext.depthMask(true);
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        this.renderContext.frontFace(this.renderContext.CW);
        this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT);
        for (var j = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof OutLineSprite) {
                    var $oso = $display3d;
                    this.updateDic($oso);
                }
            }
        }
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        Engine.resetSize();
    };
    ExpBakedModel.prototype.updateDic = function ($display) {
        if ($display.objData && $display.objData.indexBuffer && this.bakedshadowRes && this.hatchRes0 && this.hatchRes1 && this.hatchRes2 && $display.lightMapTextureRes) {
            var tf = Scene_data.context3D.pushVa($display.objData.vertexBuffer);
            ProgrmaManager.getInstance().registe(ExpBakedModelShader.ExpBakedModelShader, new ExpBakedModelShader);
            var $shader = ProgrmaManager.getInstance().getProgram(ExpBakedModelShader.ExpBakedModelShader);
            Scene_data.context3D.setProgram($shader.program);
            Scene_data.context3D.setVcMatrix4fv($shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", $display.posMatrix.m);
            Scene_data.context3D.setVc2fv($shader, "uvscale", $display.uvscaleData);
            Scene_data.context3D.setVaOffset(0, 3, $display.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, $display.objData.stride, $display.objData.lightuvsOffsets);
            // 
            Scene_data.context3D.setRenderTexture($shader, "bakedshadow", $display.lightMapTextureRes.texture, 0);
            Scene_data.context3D.setRenderTexture($shader, "hatch0", this.hatchRes0.texture, 1);
            Scene_data.context3D.setRenderTexture($shader, "hatch1", this.hatchRes1.texture, 2);
            Scene_data.context3D.setRenderTexture($shader, "hatch2", this.hatchRes2.texture, 3);
            Scene_data.context3D.drawCall($display.objData.indexBuffer, $display.objData.treNum);
        }
    };
    return ExpBakedModel;
}());
//# sourceMappingURL=ExpBakedModel.js.map