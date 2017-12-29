var SceneRenderToTextrue = /** @class */ (function () {
    function SceneRenderToTextrue() {
    }
    SceneRenderToTextrue.getInstance = function () {
        if (!this._instance) {
            this._instance = new SceneRenderToTextrue();
        }
        return this._instance;
    };
    SceneRenderToTextrue.prototype.getFBO = function () {
        FBO.fw = 2048;
        FBO.fh = 2048;
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
    SceneRenderToTextrue.prototype.updateDepthTexture = function (fbo) {
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);
    };
    SceneRenderToTextrue.prototype.renderToTexture = function () {
        if (!this.fbo) {
            this.fbo = this.getFBO(); //512*512
        }
        this.updateDepthTexture(this.fbo);
        this.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
        this.renderContext.clearColor(20 / 255, 20 / 255, 20 / 255, 1.0);
        this.renderContext.clearDepth(1.0);
        this.renderContext.clearStencil(0.0);
        this.renderContext.enable(this.renderContext.DEPTH_TEST);
        this.renderContext.depthMask(true);
        this.renderContext.enable(this.renderContext.BLEND);
        this.renderContext.frontFace(this.renderContext.CW);
        this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT | this.renderContext.STENCIL_BUFFER_BIT);
        for (var i = 0; i < SceneManager.getInstance().displayList.length; i++) {
            SceneManager.getInstance().displayList[i].update();
        }
        var gl = Scene_data.context3D.renderContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        Engine.resetSize();
    };
    return SceneRenderToTextrue;
}());
//# sourceMappingURL=SceneRenderToTextrue.js.map