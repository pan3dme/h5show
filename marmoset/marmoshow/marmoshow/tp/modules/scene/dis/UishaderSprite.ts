class UishaderShader extends Shader3D {
    static UishaderShader: string = "UishaderShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
       // $context.bindAttribLocation(this.program, 1, "u2Texture");
        //$context.bindAttribLocation(this.program, 2, "vTangent");
        //$context.bindAttribLocation(this.program, 3, "vBitangent");
        //$context.bindAttribLocation(this.program, 4, "vNormal");
    }
    getVertexShaderString(): string {
        var $str: string =
            "precision highp float;\n" +
            "attribute vec3 v3Position;" +


            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +




            "void main(void)" +
            "{" +

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

 
    
      
            "void main(void)\n" +
            "{\n" +
   
                "gl_FragColor =vec4(1.0,1.0,1.0,1.0);\n" +
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
        renderContext.bufferData(renderContext.ARRAY_BUFFER, new Float32Array($jsData), renderContext.STATIC_DRAW);
        return $buffData;
    }
    public update(): void {
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes && this._nrmTextureRes && this.modelBuff) {
            Scene_data.context3D.setProgram(this.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);



            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.modelBuff);
            Scene_data.context3D.renderContext.enableVertexAttribArray(0);
            Scene_data.context3D.renderContext.enableVertexAttribArray(1);
            Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 32, 0);


           // Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);

     
       
         
             /*
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);

            Scene_data.context3D.renderContext.enableVertexAttribArray(2);
            Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 2);
            Scene_data.context3D.renderContext.enableVertexAttribArray(3);
            Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 2);
            Scene_data.context3D.renderContext.enableVertexAttribArray(4);
            Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 0, 2);

          
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.modelBuff);
            Scene_data.context3D.renderContext.enableVertexAttribArray(0);
            Scene_data.context3D.renderContext.enableVertexAttribArray(1);
            Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 32, 0);
            Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.FLOAT, false, 32, 12);
         
            Scene_data.context3D.renderContext.enableVertexAttribArray(2);
            Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 20);
            Scene_data.context3D.renderContext.enableVertexAttribArray(3);
            Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 24);
            Scene_data.context3D.renderContext.enableVertexAttribArray(4);
            Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, true, 32, 28);
           

            Scene_data.context3D.setRenderTexture(this.shader, "s_baseTexture", this._uvTextureRes.texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "s_nrmTexture", this._nrmTextureRes.texture, 1);
             */
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    }

    private pushTBN($arr: Array<number>, $a: number, $b: number): void {
        $arr.push($a,$b);
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
