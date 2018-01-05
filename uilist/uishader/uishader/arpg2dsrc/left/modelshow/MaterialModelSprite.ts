class MaterialModelShader extends Shader3D {
    static MaterialModelShader: string = "MaterialModelShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
            "attribute vec2 v2CubeTexST;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "varying vec2 v_texCoord;" +
            "void main(void)" +
            "{" +
            "   v_texCoord = vec2(v2CubeTexST.x, v2CubeTexST.y);" +
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
            "uniform sampler2D fs0;\n" +
            "varying vec2 v_texCoord;\n" +
            "void main(void)\n" +
            "{\n" +
                "vec4 infoUv = texture2D(fs0, v_texCoord.xy);\n" +
                "gl_FragColor =vec4(1.0,0.0,0.0,1.0);\n" +
            "}"
        return $str

    }

}

module left {

    export class MaterialModelSprite extends Display3DSprite {

        constructor() {
            super();

            GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/cartoontree05.txt", (groupRes: GroupRes) => {
                this.loadPartRes(groupRes)
            })
            this.setLightMapUrl("ui/load/blood.png")


        }
        private buildShader: Shader3D
        public setCamPos($material: Material): void {
            var $scale: number = 1
            $material.updateCam(Scene_data.cam3D.x / $scale, Scene_data.cam3D.y / $scale, Scene_data.cam3D.z / $scale);
        }
        public loadPartRes(groupRes: GroupRes): void {
            for (var i: number = 0; i < groupRes.dataAry.length; i++) {
                var item: GroupItem = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    this.scaleX = this.scaleY = this.scaleZ = 0.2
                    this.setObjUrl(item.objUrl);
                    this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                    return
                }
            }
          
        }
        public setMaterialUrl(value: string, $paramData: Array<any> = null): void {
            value = value.replace("_byte.txt", ".txt")
            value = value.replace(".txt", "_byte.txt")
            this.materialUrl = Scene_data.fileRoot + value;
            MaterialManager.getInstance().getMaterialByte(this.materialUrl, ($material: Material) => {
                this.material = $material;
                if ($paramData) {
                    this.materialParam = new MaterialBaseParam();
                    this.materialParam.setData(this.material, $paramData);
                }
            }, null, true, MaterialShader.MATERIAL_SHADER, MaterialShader);
        }

        public updateMaterial(): void {
            if (!this.material || !this.objData) {
                return;
            }
            var $tempShader: Shader3D = this.material.shader;
    
            Scene_data.context3D._contextSetTest.clear()

            Scene_data.context3D.setProgram($tempShader.program);
            Scene_data.context3D.setVcMatrix4fv($tempShader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($tempShader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setRenderTexture($tempShader, "fs0", this.lightMapTextureRes.texture,0);
            Scene_data.context3D.pushVa(this.objData.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, this.objData.stride, this.objData.uvsOffsets);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    
    }
}