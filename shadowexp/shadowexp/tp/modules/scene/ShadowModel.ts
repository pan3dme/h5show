
class BaseShadowShader extends Shader3D {
    static BaseShadowShader: string = "BaseShadowShader";
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
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "uniform sampler2D s_texture;\n" +
            "varying vec2 v_texCoord;\n" +

            "void main(void)\n" +
            "{\n" +
                "vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +

               "gl_FragColor = vec4(gl_FragCoord.z,gl_FragCoord.z,0.1236,1);\n" +
            "}"
        return $str

    }

}
class ShadowModel {
    private static _instance: ShadowModel;
    public static getInstance(): ShadowModel {
        if (!this._instance) {
            this._instance = new ShadowModel();
        }
        return this._instance;
    }
    public static shadowViewMatx3D: Matrix3D;
    private renderContext: WebGLRenderingContext
    public getFBO(): FBO {
        FBO.fw = 1024
        FBO.fh = 1024
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

    private _uvTextureRes:TextureRes

    public updateDepthTexture(fbo: FBO): void {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
       

   
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.frameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture , 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo.depthBuffer);  
      
      
       
    
    }
    private sunRotationX: number = -45
    public sunRotationY: number = 45
    private sunDistens100: number = 200
    //创建可引用的阴影贴图  （-1~+1）=》（0~1）;
    private makeUseShadowView(): void {
        // Scene_data.viewMatrx3D.identity();
        // Scene_data.viewMatrx3D.appendScale(1 / 250, 1 / 250, 1 / (this.sunDistens100 * 2));
        Scene_data.viewMatrx3D.appendTranslation(1, 1, 1); //+1
        Scene_data.viewMatrx3D.appendScale(0.5, 0.5, 0.5);//*0.5
        MathClass.updateVp();
        ShadowModel.shadowViewMatx3D = Scene_data.vpMatrix.clone();
    }
    public updateDepth(): void {
        if (!Scene_data.fbo) {
            Scene_data.fbo = this.getFBO();  //512*512
        }
       this.updateDepthTexture(Scene_data.fbo);
   
       this.renderContext.viewport(0, 0, FBO.fw, FBO.fh);
       this.renderContext.clearColor(1, 1, 1, 1);
       this.renderContext.clearDepth(1.0);
  
       this.renderContext.enable(this.renderContext.DEPTH_TEST);
       this.renderContext.depthMask(true);
       //this.renderContext.enable(this.renderContext.BLEND);
       this.renderContext.frontFace(this.renderContext.CW);

       this.renderContext.clear(this.renderContext.COLOR_BUFFER_BIT | this.renderContext.DEPTH_BUFFER_BIT );

        Scene_data.viewMatrx3D.identity();
        Scene_data.viewMatrx3D.appendScale(1 / 200, 1 / 200, 1 / this.sunDistens100);
        Scene_data.cam3D.cameraMatrix.identity()
        Scene_data.cam3D.cameraMatrix.prependTranslation(0, 0, 0);
        Scene_data.cam3D.cameraMatrix.prependRotation(this.sunRotationX, Vector3D.X_AXIS);
        Scene_data.cam3D.cameraMatrix.prependRotation(this.sunRotationY, Vector3D.Y_AXIS);

        var $sunNrm: Vector3D = new Vector3D(0, 0, -1)
        var $m:Matrix3D=new Matrix3D
        $m.appendRotation(-this.sunRotationX, Vector3D.X_AXIS);
        $m.appendRotation(-this.sunRotationY, Vector3D.Y_AXIS);
        $sunNrm = $m.transformVector($sunNrm)
        $sunNrm.normalize()
       // console.log("$sunNrm",$sunNrm)
       
        Scene_data.light.setData($sunNrm, new Vector3D(1, 1, 1), new Vector3D(0.0, 0.0, 0.0));
        Scene_data.light.setData($sunNrm, new Vector3D(0.7, 0.7, 0.7), new Vector3D(0.3, 0.3, 0.3));
        Scene_data.light.setData($sunNrm, new Vector3D(0.5, 0.5, 0.5), new Vector3D(0.5, 0.5, 0.5));

        MathClass.updateVp();
        ShadowModel.shadowViewMatx3D = Scene_data.vpMatrix.clone();
        Scene_data.context3D.setProgram(null);
  
 
        for (var i: number = 0; i < SceneManager.getInstance().displaySpriteList.length; i++) {
            var $a: Display3DSprite = SceneManager.getInstance().displaySpriteList[i]
            this.drawTempSprite($a.objData, $a.posMatrix)
            console.log(i)
        }

        for (var j: number = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $b: DirectShadowDisplay3DSprite = <DirectShadowDisplay3DSprite>SceneManager.getInstance().displayList[j];
            if ($b instanceof DirectShadowDisplay3DSprite) {
                for (var k: number = 0; k < $b.groupItem.length; k++) {
                    this.drawTempSprite($b.groupItem[k].objData, $b.posMatrix)
                }
            }
        }

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);  
      //  console.log("扫描深度")
        this.makeUseShadowView();
        Engine.resetSize();
    }
    private drawTempSprite($objdata: ObjData, $posMatrix: Matrix3D): void {
        ProgrmaManager.getInstance().registe(BaseShadowShader.BaseShadowShader, new BaseShadowShader);
        var $shader: Shader3D = ProgrmaManager.getInstance().getProgram(BaseShadowShader.BaseShadowShader);
        if (!this._uvTextureRes) {
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(128, 128, false);
            $ctx.fillStyle = "rgb(255,0,255)";
            $ctx.fillRect(0, 0, 128, 128);
            this._uvTextureRes = TextureManager.getInstance().getCanvasTexture($ctx)
        }
        Scene_data.context3D.setProgram($shader.program);
        Scene_data.context3D.setVcMatrix4fv($shader, "vpMatrix3D", Scene_data.vpMatrix.m);
        Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", $posMatrix.m);
        var tf: boolean = Scene_data.context3D.pushVa($objdata.vertexBuffer);

        Scene_data.context3D.setVaOffset(0, 3, $objdata.stride, 0);
        Scene_data.context3D.setVaOffset(1, 2, $objdata.stride, $objdata.uvsOffsets);

        Scene_data.context3D.setRenderTexture($shader, "s_texture", this._uvTextureRes.texture, 0);

        Scene_data.context3D.drawCall($objdata.indexBuffer, $objdata.treNum);

    }

}

