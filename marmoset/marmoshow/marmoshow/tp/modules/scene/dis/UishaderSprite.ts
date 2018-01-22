class UishaderShader extends Shader3D {
    static UishaderShader: string = "UishaderShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vNormal");

    }
    getVertexShaderString(): string {
        var $str: string =
            "precision highp float;\n" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vNormal;\n" +


            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +

            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +

            "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +

            "}void main(void){" +

            "   vec4 vt0= vec4(vPosition, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +

            "G=ic(vNormal);\n" +
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +

            "void main(void)\n" +
            "{\n" +
   
                "gl_FragColor =vec4(G.xyz,1.0);\n" +
            "}"
        return $str

    }

}

class UishaderSprite extends BaseDiplay3dSprite {

    constructor() {
        super();

    }
    protected initModeStr($vec: Array<number>, $index: Array<number>): void {

        ProgrmaManager.getInstance().registe(UishaderShader.UishaderShader, new UishaderShader);
        this.shader = ProgrmaManager.getInstance().getProgram(UishaderShader.UishaderShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.indexs = new Array();
        this.objData.uvs = new Array();
        this.objData.tangents = new Array();
        this.objData.bitangents = new Array();
        this.objData.normals = new Array();
        
        for (var i: number = 0; i < $index.length; i++) {
            var $fcnum: number = 11;
            var $ind: number = $index[i]
            var a1: number = $vec[$fcnum * $ind + 0] * 5;
            var a2: number = $vec[$fcnum * $ind + 1] * 5;
            var a3: number = $vec[$fcnum * $ind + 2] * 5;

            var u1: number = $vec[$fcnum * $ind + 3];
            var u2: number = $vec[$fcnum * $ind + 4];

            var T1: number = $vec[$fcnum * $ind + 5];
            var T2: number = $vec[$fcnum * $ind + 6];
            var B1: number = $vec[$fcnum * $ind + 7];
            var B2: number = $vec[$fcnum * $ind + 8];
            var N1: number = $vec[$fcnum * $ind + 9];
            var N2: number = $vec[$fcnum * $ind + 10];


            this.objData.vertices.push(a1, a2, a3);
            this.objData.uvs.push(u1, u2);

            this.pushTBN(this.objData.tangents, T1, T2);
            this.pushTBN(this.objData.bitangents, B1, B2);
            this.pushTBN(this.objData.normals, N1, N2);

            this.objData.indexs.push(i);
        }
        this.loadTexture();
        this.upToGpu();

    }

    private skipNum: number = 0
    public upToGpu(): void {
        if (this.objData.indexs.length) {
            this.objData.treNum = this.objData.indexs.length
            this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
            this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);

            this.objData.tangentBuffer = this.uploadBuff3D(this.objData.tangents);
            this.objData.bitangentBuffer = this.uploadBuff3D(this.objData.bitangents);
            this.objData.normalsBuffer = this.uploadBuff3D(this.objData.normals);

           
            this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
        }
    }
    public uploadBuff3D($jsData: any): WebGLBuffer {
        var renderContext = Scene_data.context3D.renderContext
        var $buffData: WebGLBuffer = renderContext.createBuffer();
        renderContext.bindBuffer(renderContext.ARRAY_BUFFER, $buffData);
        renderContext.bufferData(renderContext.ARRAY_BUFFER, new Uint16Array($jsData), renderContext.STATIC_DRAW);
        return $buffData;
    }
    public update(): void {
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes && this._nrmTextureRes && this.modelBuff) {
            Scene_data.context3D.setProgram(this.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);




            //Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            //Scene_data.context3D.setVa(1, 3, this.objData.vertexBuffer);

            console.log("ccav")


            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.vertexBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(0);
            Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 0, 0);

            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.objData.normalsBuffer);
            Scene_data.context3D.renderContext.enableVertexAttribArray(1);
            Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 0);



            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);

  

           
        }
    }

    private pushTBN($arr: Array<number>, $a: number, $b: number): void {
         $arr.push($a, $b);
       // $arr.push(1, 1);
    }
    protected loadTexture(): void {

    }
    private _nrmTextureRes
    private loadUvPic($baseuv: string, $nrmuv: string): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $baseuv, ($texture: TextureRes) => {
            this._uvTextureRes = $texture;
        });
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $nrmuv, ($texture: TextureRes) => {
            this._nrmTextureRes = $texture;
        });

    }
    public loadFileById($id: number, $baseuv: string, $nrmuv: string): void {
        this.loadUvPic($baseuv, $nrmuv);
        LoadManager.getInstance().load(Scene_data.fileRoot + "pan/marmoset/model/objs" + $id + ".txt", LoadManager.XML_TYPE,
            ($objstr: string) => {
                var $dd = $objstr.split("|")
                this.initModeStr(this.getArrByStr($dd[0]), this.getArrByStr($dd[1]));
            });

        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", ($buff: WebGLBuffer) => {
            this.modelBuff = $buff;
        });
    }
    private modelBuff: WebGLBuffer

    protected initData(): void {

    }
    private getArrByStr($dtstr: string): Array<number> {
        var configText: Array<string> = $dtstr.split(",");
        var $dataArr: Array<number> = new Array()
        for (var i: number = 0; i < configText.length; i++) {
            $dataArr.push(Number(configText[i]))
        }
        return $dataArr
    }


}
