class ExpBakedModelShader extends Shader3D {
    static ExpBakedModelShader: string = "ExpBakedModelShader";
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
            "attribute vec2 u2Position;" +

            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform vec2 uvscale;\n" +//当前时间x,自身加速度y,粒子生命z,是否循环w

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
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
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
            "}"
        return $str

    }

}
class ExpBakedModel {
    private static _instance: ExpBakedModel;
    public static getInstance(): ExpBakedModel {
        if (!this._instance) {
            this._instance = new ExpBakedModel();
        }
        return this._instance;
    }
    constructor() {
        this.loadHatchRes0();
        this.loadHatchRes1();
        this.loadHatchRes2();
        this.loadBakedshadowRes();
    }
    private hatchRes0: TextureRes
    private hatchRes1: TextureRes
    private hatchRes2: TextureRes
    private bakedshadowRes: TextureRes
    protected loadHatchRes0(): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_0.jpg", ($texture: TextureRes) => {
            this.hatchRes0 = $texture;
        });
    }
    protected loadHatchRes1(): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_1.jpg", ($texture: TextureRes) => {
            this.hatchRes1 = $texture;
        });
    }
    protected loadHatchRes2(): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/hatch_2.jpg", ($texture: TextureRes) => {
            this.hatchRes2 = $texture;
        });
    }
    protected loadBakedshadowRes(): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "pan/pic/room_baked.jpg", ($texture: TextureRes) => {
            this.bakedshadowRes = $texture;
        });
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
    public renderBacked(): void {
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
        if ($display.objData && $display.objData.indexBuffer && this.bakedshadowRes && this.hatchRes0 && this.hatchRes1 && this.hatchRes2 && $display.lightMapTextureRes) {
            var tf: boolean = Scene_data.context3D.pushVa($display.objData.vertexBuffer);
            ProgrmaManager.getInstance().registe(ExpBakedModelShader.ExpBakedModelShader, new ExpBakedModelShader);
            var $shader: Shader3D = ProgrmaManager.getInstance().getProgram(ExpBakedModelShader.ExpBakedModelShader);

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

    }
}