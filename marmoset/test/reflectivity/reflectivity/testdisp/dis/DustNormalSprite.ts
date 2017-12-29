


class DustNormalShader extends Shader3D {
    static DustNormalShader: string = "DustNormalShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");


    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 vPosition;" +
            "attribute vec2 vTexCoord;" +
            "attribute vec2 vTangent;" +
            "attribute vec2 vBitangent;" +
            "attribute vec2 vNormal;" +

            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat3 rotMatrix3d;" +


            "varying vec2 v_texCoord;\n" +

            "varying mat3 v4;\n" +

            "vec3 ic(vec2 id){\n" +
                "bool ie = (id.y > (32767.1 / 65535.0)); \n" +
                "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
                "vec3 r;\n" +
                "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
                "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
                "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}\n" +

            "void main(void)" +
            "{" +
                "v4 = mat3(ic(vTangent/ 65535.0)*rotMatrix3d,ic(vBitangent/ 65535.0)*rotMatrix3d,ic(vNormal/ 65535.0)*rotMatrix3d);\n" +
                "v_texCoord = vec2(vTexCoord.x, vTexCoord.y);" +
                "vec4 vt0= vec4(vPosition, 1.0);" +
                "vt0 = posMatrix3D * vt0;" +
                "vt0 = camMatrix3D * vt0;" +
                "vt0 = viewMatrix3D * vt0;" +
                "gl_Position = vt0;" +
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +

            "uniform sampler2D s_texture;\n" +
            "uniform vec4 uDiffuseCoefficients[9];\n" +

            "varying vec2 v_texCoord;\n" +
            "varying mat3 v4;\n" +

            "vec3 du(vec3 eN){\n" +
                "#define c(n) uDiffuseCoefficients[n].xyz\n" +
                "vec3 C=(c(0)+eN.y*((c(1)+c(4)*eN.x)+c(5)*eN.z))+eN.x*(c(3)+c(7)*eN.z)+c(2)*eN.z;\n" +
                "#undef c\n" +
                "vec3 sqr=eN*eN;\n" +
                "C+=uDiffuseCoefficients[6].xyz*(3.0*sqr.z-1.0);\n" +
                "C+=uDiffuseCoefficients[8].xyz*(sqr.x-sqr.y);\n" +
                "return C;\n" +
            "}\n" +
            "void main(void)\n" +
            "{\n" +

                "vec4 normap = texture2D(s_texture, v_texCoord.xy);\n" +

                "vec4 ft3 = vec4(0, 0, 0, 1);\n" +
                "ft3.xyz = normap.xyz * 2.0 - 1.0;\n" +
                "ft3.xyz = v4 * ft3.xyz;\n" +
                "gl_FragColor =vec4(du(ft3.xyz), 1.0);\n" +
            "}"

        return $str
        

        
    }

}

class DustNormalSprite extends BaseDiplay3dSprite {

    constructor() {
        super();
        this.scaleX = 10
        this.scaleY = 10
        this.scaleZ = 10

        ProgrmaManager.getInstance().registe(DustNormalShader.DustNormalShader, new DustNormalShader);
        this.shader = ProgrmaManager.getInstance().getProgram(DustNormalShader.DustNormalShader);
        this.program = this.shader.program;

        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", ($buff: WebGLBuffer) => {
            this.modelBuff = $buff;
        });
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", (groupRes: GroupRes) => {
            this.loadPartRes(groupRes)
        })

    }

    private kkkDisplay3DSprite: Display3DSprite
    public loadPartRes(groupRes: GroupRes): void {
        for (var i: number = 0; i < groupRes.dataAry.length; i++) {
            var item: GroupItem = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.kkkDisplay3DSprite = new Display3DSprite
                this.kkkDisplay3DSprite.setObjUrl(item.objUrl);
                return
            }
        }


    }

    private modelBuff: WebGLBuffer
    protected loadTexture(): void {

        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic535317.txt", ($texture: TextureRes) => {
            this._uvTextureRes = $texture
        });

    }
    private skipNum: number=0
    public update(): void {
        if (this.kkkDisplay3DSprite && this.kkkDisplay3DSprite.objData) {
            if (this._uvTextureRes && this.modelBuff) {


                Scene_data.context3D.setProgram(this.program);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);

                var rotMatrix3d: Matrix3D = new Matrix3D();
                var _rotationData: Float32Array = new Float32Array(9)
                rotMatrix3d.getRotaion(_rotationData);
                Scene_data.context3D.setVcMatrix3fv(this.shader, "rotMatrix3d", _rotationData);

               Scene_data.context3D.setVc4fv(this.shader, "uDiffuseCoefficients", [0.14585700631141663, 0.1095229983329773, 0.11986599862575531, 0, 0.0817933976650238, 0.0785657986998558, 0.10676799714565277, 0, -0.012515299953520298, -0.0038914200849831104, -0.0024973100516945124, 0, 0.1110450029373169, 0.04512010142207146, 0.015141899697482586, 0, 0.03221319988369942, 0.014369400218129158, 0.007112869992852211, -0, -0.008236129768192768, -0.005531259812414646, -0.005950029939413071, -0, -0.00837332010269165, -0.0039273700676858425, -0.0023853699676692486, 0, -0.016801999881863594, -0.0022234099451452494, 0.002148869913071394, -0, 0.040785398334264755, 0.01346640009433031, -0.0013942799996584654, 0]);
    
                Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, this.modelBuff);
                Scene_data.context3D.renderContext.enableVertexAttribArray(0);
                Scene_data.context3D.renderContext.enableVertexAttribArray(1);
                Scene_data.context3D.renderContext.vertexAttribPointer(0, 3, Scene_data.context3D.renderContext.FLOAT, false, 32, 0);
                Scene_data.context3D.renderContext.vertexAttribPointer(1, 2, Scene_data.context3D.renderContext.FLOAT, false, 32, 12);

                Scene_data.context3D.renderContext.enableVertexAttribArray(2);
                Scene_data.context3D.renderContext.vertexAttribPointer(2, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 20);
                Scene_data.context3D.renderContext.enableVertexAttribArray(3);
                Scene_data.context3D.renderContext.vertexAttribPointer(3, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 24);
                Scene_data.context3D.renderContext.enableVertexAttribArray(4);
                Scene_data.context3D.renderContext.vertexAttribPointer(4, 2, Scene_data.context3D.renderContext.UNSIGNED_SHORT, false, 32, 28);


                Scene_data.context3D.cullFaceBack(true);
                Scene_data.context3D.setRenderTexture(this.shader, "s_texture", this._uvTextureRes.texture, 0);
                Scene_data.context3D.drawCall(this.kkkDisplay3DSprite.objData.indexBuffer, this.kkkDisplay3DSprite.objData.treNum);

            }

        }


    }


}