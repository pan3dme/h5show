
module md5list {

    export class Md5MeshShader extends Shader3D {
        static Md5MeshShader: string = "Md5MeshShader";
        constructor() {
            super();
        }
        binLocation($context: WebGLRenderingContext): void {
            $context.bindAttribLocation(this.program, 0, "pos");
            $context.bindAttribLocation(this.program, 1, "v2Uv");
            $context.bindAttribLocation(this.program, 2, "boneID");
            $context.bindAttribLocation(this.program, 3, "boneWeight");
        }
        getVertexShaderString(): string {
            var $str: string =
                "attribute vec3 pos;" +
                "attribute vec2 v2Uv;" +
                "attribute vec4 boneID;" +
                "attribute vec4 boneWeight;" +
                "varying vec2 v0;" +
                "uniform vec4 boneQ[70];" +
                "uniform vec3 boneD[70];" +
                "uniform mat4 vpMatrix3D;" +
                "uniform mat4 posMatrix3D;" +
                "vec4 qdv(vec4 q, vec3 d, vec3 v ){" +
                "   vec3 t = 2.0 * cross(q.xyz, v);" +
                "   vec3 f = v + q.w * t + cross(q.xyz, t);" +
                "   return vec4(f.x + d.x, f.y + d.y, f.z + d.z, 1.0);" +
                " }" +
                "vec4 getQDdata(vec3 vdata){" +
                "   vec4 tempnum = qdv(boneQ[int(boneID.x)], boneD[int(boneID.x)], vdata) * boneWeight.x;" +
                "   tempnum += qdv(boneQ[int(boneID.y)], boneD[int(boneID.y)], vdata) * boneWeight.y;" +
                "   tempnum += qdv(boneQ[int(boneID.z)], boneD[int(boneID.z)], vdata) * boneWeight.z;" +
                "   tempnum += qdv(boneQ[int(boneID.w)], boneD[int(boneID.w)], vdata) * boneWeight.w;" +
                "   tempnum.x = tempnum.x * -1.0;" +
                "   return tempnum;" +
                " }" +
                "vec4 qdvNrm(vec4 q, vec3 v ){" +
                "      vec3 t = 2.0 * cross(q.xyz, v);" +
                "      vec3 f = v + q.w * t + cross(q.xyz, t);" +
                "      return vec4(f.x, f.y, f.z, 1.0);\n" +
                "}" +
                " vec4 getQDdataNrm(vec3 vdata){" +
                "    vec4 tempnum = qdvNrm(boneQ[int(boneID.x)], vdata) * boneWeight.x;" +
                "    tempnum += qdvNrm(boneQ[int(boneID.y)], vdata) * boneWeight.y;" +
                "    tempnum += qdvNrm(boneQ[int(boneID.z)], vdata) * boneWeight.z;" +
                "    tempnum += qdvNrm(boneQ[int(boneID.w)], vdata) * boneWeight.w;" +
                "    tempnum.x = tempnum.x * -1.0;" +
                "    tempnum.xyz = normalize(tempnum.xyz);" +
                "    return tempnum;" +
                "}" +
                " void main(void){" +
                "    v0 = v2Uv;" +
                "    vec4 vt0 = getQDdata(vec3(pos.x, pos.y, pos.z));" +
                "    vt0.xyz = vt0.xyz * 1.0;" +
                "    vt0 = posMatrix3D * vt0;" +
                "    vt0 = vpMatrix3D * vt0;" +
                "    gl_Position = vt0;\n" +
                "  }";

            return $str

        }
        getFragmentShaderString(): string {
            var $str: string =
                "precision mediump float;\n" +
                "uniform sampler2D fs0;\n" +
                "varying vec2 v0;\n" +
                "void main(void)\n" +
                "{\n" +
                "vec4 infoUv = texture2D(fs0, v0.xy);\n" +
                "gl_FragColor =infoUv;\n" +
                "}"
            return $str

        }

    }


    export  class Md5MeshSprite extends Display3DSprite {
        private md5shader: Shader3D
        constructor() {
            super();

            ProgrmaManager.getInstance().registe(Md5MeshShader.Md5MeshShader, new Md5MeshShader);
            this.md5shader = ProgrmaManager.getInstance().getProgram(Md5MeshShader.Md5MeshShader);
            this.loadTexture();

        }
        public setMd5BodyUrl($url: string): void {
            this.loadBodyMesh($url);
        }
        private _md5MeshData: Md5MeshData
        private loadBodyMesh($url: string): void {
            LoadManager.getInstance().load(Scene_data.fileRoot + $url, LoadManager.XML_TYPE, ($str: any) => {
                var $md5Analysis: Md5Analysis = new Md5Analysis()
                this._md5MeshData = $md5Analysis.addMesh($str);
                new MeshImportSort().processMesh(this._md5MeshData);
                this.md5objData = new MeshToObjUtils().getObj(this._md5MeshData);
            });
        }
        private md5objData: ObjData;
        protected loadTexture(): void {
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(128, 128, false);
            $ctx.fillStyle = "rgb(255,0,0)";
            $ctx.fillRect(0, 0, 128, 128);
            this._uvTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);

            TextureManager.getInstance().getTexture(Scene_data.fileRoot + "x_f_武当_01.jpg", ($texture: TextureRes) => {
                this._uvTextureRes = $texture;
            });

            //   shuangdaonv.jpg

        }
        protected _uvTextureRes: TextureRes
        private baseShder: Shader3D;
        public updateMaterialMesh($mesh: MeshData): void {


        }
        public update(): void {
            if (this.md5objData) {
                this.updateMaterialMeshCopy();

            }

        }
        public updateMaterialMeshCopy(): void {

            this.baseShder = this.md5shader
            Scene_data.context3D.setProgram(this.baseShder.program);
            Scene_data.context3D.setVpMatrix(this.baseShder, Scene_data.vpMatrix.m);

            Scene_data.context3D.setVcMatrix4fv(this.baseShder, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.setRenderTexture(this.baseShder, "fc0", this._uvTextureRes.texture, 0);
            Scene_data.context3D.setVa(0, 3, this.md5objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 2, this._md5MeshData.uvBuffer);
            Scene_data.context3D.setVa(2, 4, this._md5MeshData.boneIdBuffer);
            Scene_data.context3D.setVa(3, 4, this._md5MeshData.boneWeightBuffer);


            var newIDBoneArr: Array<number> = this._md5MeshData.boneNewIDAry
            var baseBone: Array<Matrix3D> = this.md5objData.bindPosAry;
            var $dualQuatFloat32Array: DualQuatFloat32Array = new DualQuatFloat32Array;
            $dualQuatFloat32Array.quat = new Float32Array(newIDBoneArr.length * 4);
            $dualQuatFloat32Array.pos = new Float32Array(newIDBoneArr.length * 3);
            for (var k: number = 0; k < newIDBoneArr.length; k++) {
                var $m: Matrix3D = baseBone[newIDBoneArr[k]].clone();
                var $minverM: Matrix3D = this.md5objData.invertAry[newIDBoneArr[k]].clone();
                $m.prepend($minverM);
                $m.appendScale(-1, 1, 1)  //特别标记，因为四元数和矩阵运算结果不一
                var $q: Quaternion = new Quaternion();
                $q.fromMatrix($m)
                var $p: Vector3D = $m.position;
                $dualQuatFloat32Array.quat[k * 4 + 0] = $q.x
                $dualQuatFloat32Array.quat[k * 4 + 1] = $q.y
                $dualQuatFloat32Array.quat[k * 4 + 2] = $q.z
                $dualQuatFloat32Array.quat[k * 4 + 3] = $q.w

                $dualQuatFloat32Array.pos[k * 3 + 0] = $p.x;
                $dualQuatFloat32Array.pos[k * 3 + 1] = $p.y;
                $dualQuatFloat32Array.pos[k * 3 + 2] = $p.z;
            }

            Scene_data.context3D.setVc4fv(this.baseShder, "boneQ", $dualQuatFloat32Array.quat); //旋转
            Scene_data.context3D.setVc3fv(this.baseShder, "boneD", $dualQuatFloat32Array.pos);  //所有的位移

            Scene_data.context3D.drawCall(this._md5MeshData.indexBuffer, this._md5MeshData.treNum);

            console.log(this._md5MeshData.treNum / 3, "boid=>", newIDBoneArr.length)


        }

    }
}