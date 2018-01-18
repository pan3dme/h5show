class MarmosetModelShader extends Shader3D {
    static MarmosetModelShader: string = "MarmosetModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "u2Texture");
        $context.bindAttribLocation(this.program, 2, "tangent");
        $context.bindAttribLocation(this.program, 3, "bitangent");
        $context.bindAttribLocation(this.program, 4, "normals");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
            "attribute vec2 u2Texture;" +
            "attribute vec3 tangent;" +
            "attribute vec3 bitangent;" +
            "attribute vec3 normals;" +


            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +

            "varying vec2 v_texCoord;" +

            "varying vec3 v_tangent;" +
            "varying vec3 v_bitangent;" +
            "varying vec3 v_normals;" +

            "void main(void)" +
            "{" +

            "   v_tangent = tangent;" +
            "   v_bitangent = bitangent;" +
            "   v_normals = normals;" +

            "   v_texCoord = vec2(u2Texture.x, u2Texture.y);" +
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
            "uniform sampler2D s_baseTexture;\n" +
            "uniform sampler2D s_nrmTexture;\n" +
            "varying vec2 v_texCoord;\n" +

            "varying vec3 v_tangent;" +
            "varying vec3 v_bitangent;" +
            "varying vec3 v_normals;" +

            "void main(void)\n" +
            "{\n" +
                "vec4 infoUv = texture2D(s_nrmTexture, v_texCoord.xy);\n" +
                "gl_FragColor =vec4(infoUv.xyz,1.0);\n" +
            "}"
        return $str

    }

}

class MarmosetModelSprite extends BaseDiplay3dSprite {

    constructor() {
        super();

    }
    protected initModeStr($vec: Array<number>, $index: Array<number>): void {

        ProgrmaManager.getInstance().registe(MarmosetModelShader.MarmosetModelShader, new MarmosetModelShader);
        this.shader = ProgrmaManager.getInstance().getProgram(MarmosetModelShader.MarmosetModelShader);
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

    private skipNum: number=0
    public upToGpu(): void {
        if (this.objData.indexs.length) {
            this.objData.treNum = this.objData.indexs.length
            this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
            this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);

            this.objData.tangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.tangents);
            this.objData.bitangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.bitangents);
            this.objData.normalsBuffer = Scene_data.context3D.uploadBuff3D(this.objData.normals);

            this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
        }
    }
    public update(): void {
        if (this.objData && this.objData.indexBuffer && this._uvTextureRes && this._nrmTextureRes) {
            Scene_data.context3D.setProgram(this.program);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);

            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this.objData.uvBuffer);
            Scene_data.context3D.setVa(2, 3, this.objData.tangentBuffer);
            Scene_data.context3D.setVa(3, 3, this.objData.bitangentBuffer);
            Scene_data.context3D.setVa(4, 3, this.objData.normalsBuffer);

            Scene_data.context3D.setRenderTexture(this.shader, "s_baseTexture", this._uvTextureRes.texture, 0);
            Scene_data.context3D.setRenderTexture(this.shader, "s_nrmTexture", this._nrmTextureRes.texture, 1);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    }

    private pushTBN($arr: Array<number>, $a: number, $b: number): void {
        var id: Vector3D = new Vector3D()
        id.x = $a / 65535;
        id.y = $b / 65535;
        var ie: Boolean = (id.y > (32767.1 / 65535.0));
        id.y = ie ? (id.y - (32768.0 / 65535.0)) : id.y;
        var r: Vector3D = new Vector3D()
        r.x = (2.0 * 65535.0 / 32767.0) * id.x - 1;
        r.y = (2.0 * 65535.0 / 32767.0) * id.y - 1;
        r.z = Math.sqrt(r.x * r.x + r.y * r.y);
        r.z = ie ? -r.z : r.z;
        $arr.push(r.x, r.y, r.z);
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
    }
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
