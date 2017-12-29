
class SceneRenderToTextrue {
    private static _instance: SceneRenderToTextrue;
    public static getInstance(): SceneRenderToTextrue {
        if (!this._instance) {
            this._instance = new SceneRenderToTextrue();
        }
        return this._instance;
    }
    private renderContext: WebGLRenderingContext
    private getFBO(): FBO {

        FBO.fw = 2048
        FBO.fh = 2048
        this.renderContext = Scene_data.context3D.renderContext
        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        var fbo: FBO = new FBO();
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
    }
    private updateDepthTexture(fbo: FBO): void {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);



    }
    public fbo: FBO
    public renderToTexture(): void {
        if (!this.fbo) {
            this.fbo = this.getFBO();  //512*512
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

        for (var i: number = 0; i < SceneManager.getInstance().displayList.length; i++) {
            SceneManager.getInstance().displayList[i].update();
        }



        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        Engine.resetSize();
    }




}