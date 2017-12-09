class DirectLightDiplay3dShader extends Shader3D {
    static DirectLightDiplay3dShader: string = "DirectLightDiplay3dShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
        $context.bindAttribLocation(this.program, 2, "v3Normal");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
            "attribute vec2 v2CubeTexST;" +
            "varying vec2 v0;" +
            "varying vec3 v2;" +
            "attribute vec3 v3Normal;" +
            "uniform vec3 sunDirect;" +
            "uniform vec3 sunColor;" +
            "uniform vec3 ambientColor;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat3 rotationMatrix3D;" +
            "void main(void){;" +
            "v0 = vec2(v2CubeTexST.x, v2CubeTexST.y); " +
            "vec4 vt0= vec4(v3Position, 1.0);" +
            "vt0 = posMatrix3D * vt0;" +
            "vt0 = vpMatrix3D * vt0;" +
            "vec3 n = rotationMatrix3D * v3Normal;" +
            "float suncos = dot(n.xyz,sunDirect.xyz);" +
            "suncos = clamp(suncos,0.0,1.0);" +
            "v2 = sunColor * suncos + ambientColor;" +
            "gl_Position = vt0;" +
            "}"
        return $str;
    }

    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v2;" +
            "void main(void)\n" +
            "{\n" +
            "vec4 ft0 = texture2D(fs0, v0); " +
            "vec4 ft1 = vec4(v2, 1.0); " +
            "vec4 ft2 = vec4(0, 0, 0, 1); " +
            "ft2.xyz = ft1.xyz*ft0.xyz; " +
            "ft2.w = 1.0; " +
            "gl_FragColor = ft2; " +
            "}"
        return $str

    }

}

class DirectLightDiplay3dSprite extends Display3D {

    constructor() {
        super();
        this.initData()
    }
    protected initData(): void {
        ProgrmaManager.getInstance().registe(DirectLightDiplay3dShader.DirectLightDiplay3dShader, new DirectLightDiplay3dShader);
        this.modelShder = ProgrmaManager.getInstance().getProgram(DirectLightDiplay3dShader.DirectLightDiplay3dShader);
    }
    private modelShder: Shader3D
    public setObjUrl(value: string): void {
        ObjDataManager.getInstance().getObjData(Scene_data.fileRoot + value, ($obj: ObjData) => {
            this.objData = $obj
        });
    }

    private nrmFlag: number = 0
    private getRotationMatrixM(): Float32Array {
        var $Matrix3D: Matrix3D = new Matrix3D;
        var rotationData = new Float32Array(9);
        $Matrix3D.getRotaion(rotationData)
        return rotationData
    }
    protected _uvTextureRes: TextureRes
    public update(): void {

        for (var i: number = 0; i < this.groupItem.length; i++) {
            this.drawTemp(this.groupItem[i]);
        }

    }
    private drawTemp($dis: Display3DSprite): void {

        var $objdata: ObjData = $dis.objData;
        var $shader: Shader3D = this.modelShder;
        if ($objdata && $objdata.indexBuffer && this._uvTextureRes) {
            Scene_data.context3D.setProgram($shader.program);


            Scene_data.context3D.setVc3fv($shader, "sunDirect", Scene_data.light.sunDirect);
            Scene_data.context3D.setVc3fv($shader, "sunColor", Scene_data.light.sunColor);
            Scene_data.context3D.setVc3fv($shader, "ambientColor", Scene_data.light.ambientColor);

            Scene_data.context3D.setVcMatrix3fv($shader, "rotationMatrix3D", this.getRotationMatrixM());
            Scene_data.context3D.setVcMatrix4fv($shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", this.posMatrix.m);

            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $objdata.vertexBuffer);


            Scene_data.context3D.setVaOffset(0, 3, $objdata.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, $objdata.stride, $objdata.uvsOffsets);
            Scene_data.context3D.setVaOffset(2, 3, $objdata.stride, $objdata.normalsOffsets);

            Scene_data.context3D.setRenderTexture($shader, "fs0", this._uvTextureRes.texture, 0);
            Scene_data.context3D.drawCall($objdata.indexBuffer, $objdata.treNum);



        }
    }

    private setPicUrl($str: string): void {
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + $str, ($texture: TextureRes) => {
            this._uvTextureRes = $texture
        });
    }
    private groupItem: Array<Display3DSprite>
    public setModelById($str: string): void {

        this.groupItem = new Array()
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), (groupRes: GroupRes) => {
            for (var i: number = 0; i < groupRes.dataAry.length; i++) {
                var item: GroupItem = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    var $dis: Display3DSprite = new Display3DSprite();
                    $dis.setObjUrl(item.objUrl)
                    this.groupItem.push($dis);
                    if (item.materialInfoArr && item.materialInfoArr.length) {
                        this.setPicUrl(item.materialInfoArr[0].url);
                    } else {
                        console.log("没有指定贴图")
                    }
                }
            }
        })


    }

}
