class PointListShader extends Shader3D {
    static PointListShader: string = "PointListShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "n3Position");

    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
            "attribute vec4 n3Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform vec4 scalesizenum;" +
            "varying vec4 v_colorvec;" +

            "void main(void)" +
            "{" +
            "   v_colorvec = n3Position;" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "   gl_PointSize     = scalesizenum.x;" +
          
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "varying vec4 v_colorvec;" +
            "void main(void)\n" +
            "{\n" +
                  "gl_FragColor =v_colorvec;\n" +
            "}"
        return $str

    }

}

class PointListSpriter extends BaseDiplay3dSprite {

    constructor() {
        super();

    }
    protected initData(): void {
        ProgrmaManager.getInstance().registe(PointListShader.PointListShader, new PointListShader);
        this.shader = ProgrmaManager.getInstance().getProgram(PointListShader.PointListShader);
        this.program = this.shader.program;

        this.objData = new ObjData;
        var $point: Array<number> = new Array();
        var $color: Array<number> = new Array();

        for (var i: number = 0; i < 1000; i++) {
            $point.push(random(100) - 50, random(100) - 50, random(100) - 50);
            $color.push(Math.random(), Math.random(), Math.random(), Math.random());

        }


        this.setNewItemData($point, $color);
    }
    public setNewItemData($point: Array<number>, $color: Array<number> = null): void {
    
        this.objData.vertices = new Array();
        this.objData.normals = new Array();
        for (var i: number = 0; i < $point.length / 3; i++) {
       
            this.objData.vertices.push($point[i * 3 + 0], $point[i * 3 + 1], $point[i * 3 + 2]);
            if ($color) {
                if ($point.length == $color.length) {
                    this.objData.normals.push($color[i * 3 + 0], $color[i * 3 + 1], $color[i * 3 + 2]);
                } else {
                    this.objData.normals.push($color[i * 3 + 0], $color[i * 3 + 1], $color[i * 3 + 2],  $color[i * 3 + 3]);
                }
            } else {
                this.objData.normals.push(1,0, 0, 1);
            }

        }
        this.upToGpu();

    }

    public upToGpu(): void {
 
        this.objData.treNum = this.objData.vertices.length/3
        this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
        this.objData.normalsBuffer = Scene_data.context3D.uploadBuff3D(this.objData.normals);


    }
    public static PointSize: number=1
    public update(): void {
        if (this.objData && this.objData.vertexBuffer ) {
            Scene_data.context3D.setProgram(this.shader.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);

            Scene_data.context3D.setVc4fv(this.shader, "scalesizenum", [PointListSpriter.PointSize, 1, 1, 1]);

            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 4, this.objData.normalsBuffer);
            Scene_data.context3D.renderContext.drawArrays(Scene_data.context3D.renderContext.POINTS, 0, this.objData.treNum)

    
        }
 

    }


}