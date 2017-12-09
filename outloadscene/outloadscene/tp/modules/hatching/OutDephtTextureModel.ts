class OutDephtTextureModelShader extends Shader3D {
    static OutDephtTextureModelShader: string = "OutDephtTextureModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
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
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "varying vec3 v_texCoord;\n" +

            "vec4 tovect4(float num){\n" +
                "float temp=floor(num*255.0*255.0);\n" +
                "float a=floor(temp / 255.0);\n" +
                "float b=floor(temp - a * 255.0);\n" +
                "return  vec4(a / 255.0, b / 255.0,0.0,1.0);\n" +

            " }\n" +
            "void main(void)\n" +
            "{\n" +
            "   gl_FragColor = tovect4(1.0-gl_FragCoord.z);\n" +
            "}"
        return $str

    }

}
class OutDephtTextureModel {
    private static _instance: OutDephtTextureModel;
    public static getInstance(): OutDephtTextureModel {
        if (!this._instance) {
            this._instance = new OutDephtTextureModel();
        }
        return this._instance;
    }
    private renderContext: WebGLRenderingContext
    public getFBO(): FBO {

  
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
    public updateDepthTexture(fbo: FBO): void {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);


    }
    public fbo: FBO
    public renderNrm(): void {
        if (!this.fbo) {
            this.fbo = this.getFBO();  //512*512
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

        for (var j: number = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d: Display3D = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof OutLineSprite) {
                    var $oso: OutLineSprite = <OutLineSprite>$display3d
                    this.updateDic($oso);
                }
            }
        }

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        Engine.resetSize();
    }

    public updateDic($display: OutLineSprite): void {
        if ($display.objData && $display.objData.indexBuffer) {
            var tf: boolean = Scene_data.context3D.pushVa($display.objData.vertexBuffer);
            ProgrmaManager.getInstance().registe(OutDephtTextureModelShader.OutDephtTextureModelShader, new OutDephtTextureModelShader);
            var $shader: Shader3D = ProgrmaManager.getInstance().getProgram(OutDephtTextureModelShader.OutDephtTextureModelShader);

            Scene_data.context3D.setProgram($shader.program);
            Scene_data.context3D.setVcMatrix4fv($shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", $display.posMatrix.m);

            Scene_data.context3D.setVaOffset(0, 3, $display.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 3, $display.objData.stride, $display.objData.normalsOffsets);

            Scene_data.context3D.drawCall($display.objData.indexBuffer, $display.objData.treNum);

        }

    }
}