class OutLineShader extends Shader3D {
    static OutLineShader: string = "OutLineShader";
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

            "void main(void)\n" +
            "{\n" +
                "gl_FragColor =vec4(v_texCoord,1.0);\n" +
            "}"
        return $str

    }

}

class OutLineSprite extends Display3DSprite {

    constructor() {
        super();

        ProgrmaManager.getInstance().registe(OutLineShader.OutLineShader, new OutLineShader);
        this.shader = ProgrmaManager.getInstance().getProgram(OutLineShader.OutLineShader);

 
        this._uvscaleData=[2,1]
    }
    public set uvscaleData(value: Array<number>) {
        this._uvscaleData = value;
    }
    private _uvscaleData: Array<number>
    public get uvscaleData(): Array<number> {
        return this._uvscaleData;
    }

    public update(): void {
        if (this.objData && this.objData.indexBuffer ) {
            var tf: boolean = Scene_data.context3D.pushVa(this.objData.vertexBuffer);
            if (tf) {
              //  return;
            }

            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);

            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 3, this.objData.stride, this.objData.normalsOffsets);

            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);

       }

    }
}
