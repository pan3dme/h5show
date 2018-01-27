class BloomRenderModelShader extends Shader3D {
    static BloomRenderModelShader: string = "BloomRenderModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "vCoord");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
            "attribute vec2 vCoord;" +
            "varying vec2 d;" +
            "void main(void)" +
            "{" +
            "d = vec2(vCoord.x, 1.0-vCoord.y);" +
            "vec4 vt0= vec4(v3Position, 1.0);" +
            "gl_Position = vt0;" +

            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =

            "precision mediump float;\n" +
            "uniform sampler2D tInput;\n" +
            "uniform vec3 uScale;\n" +
            "uniform vec3 uBias;\n" +
            "varying vec2 d;\n" +
            "vec3 ii(vec3 c){vec3 ij=sqrt(c);\n" +
            "return(ij-ij*c)+c*(0.4672*c+vec3(0.5328));\n" +
            "}void main(void){\n" +
            "vec4 ik=texture2D(tInput,d);\n" +
            "vec3 c=ik.xyz;\n" +
            "c=c*uScale+uBias;\n" +
            "gl_FragColor.xyz=ii(c);\n" +
            "gl_FragColor.w=1.0;\n" +
            //  "gl_FragColor.xyz=ik.xyz;\n" +
            "}"
        return $str

    }

}


class BloomRenderModel extends BaseDiplay3dSprite {

    constructor() {
        super();
    }
    private static _instance: BloomRenderModel;
    public static getInstance(): BloomRenderModel {
        if (!this._instance) {
            this._instance = new BloomRenderModel();
        }
        return this._instance;
    }

    protected initData(): void {
        ProgrmaManager.getInstance().registe(BloomRenderModelShader.BloomRenderModelShader, new BloomRenderModelShader);
        this.shader = ProgrmaManager.getInstance().getProgram(BloomRenderModelShader.BloomRenderModelShader);
        this.program = this.shader.program;

        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.vertices.push(-1, 1, 0.5);
        this.objData.vertices.push(1, 1, 0.5);
        this.objData.vertices.push(1, -1, 0.5);
        this.objData.vertices.push(-1, -1, 0.5);

        this.objData.uvs = new Array()
        this.objData.uvs.push(0, 0);
        this.objData.uvs.push(1, 0);
        this.objData.uvs.push(1, 1);
        this.objData.uvs.push(0, 1);


        this.objData.indexs = new Array();
        this.objData.indexs.push(0, 1, 2);
        this.objData.indexs.push(0, 2, 3);


        this.upToGpu();

    }
    public showTexture($texture: WebGLRenderbuffer): void {
        Scene_data.context3D.update();
        Scene_data.context3D.setDepthTest(true);
        MathClass.getCamView(Scene_data.cam3D, Scene_data.focus3D); //一定要角色帧渲染后再重置镜头矩阵


        this.drawModel($texture)
    }
    public drawModel($texture: WebGLRenderbuffer): void {

        if (this.objData && this.objData.indexBuffer) {
            Scene_data.context3D.setProgram(this.shader.program);


            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);

            Scene_data.context3D.setRenderTexture(this.shader, "tInput", $texture, 0);

            Scene_data.context3D.setVc3fv(this.shader, "uScale", [3.51284, 3.51284, 3.51284]);
            Scene_data.context3D.setVc3fv(this.shader, "uBias", [0, 0, 0]);

            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    }

}
