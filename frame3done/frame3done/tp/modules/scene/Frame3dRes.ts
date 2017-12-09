class FrameLinePointVo extends Object3D {

    public time: number;
    public id: number;
    public iskeyFrame: boolean;
    public isAnimation: boolean;
    public data: any

    public static maxTime: number = 0
    public writeObject($obj: any): void {

        this.time = $obj.time;
        this.id = $obj.id;
        this.iskeyFrame = $obj.iskeyFrame;
        this.isAnimation = $obj.isAnimation;



        this.x = $obj.x / 10;
        this.y = $obj.y / 10;
        this.z = $obj.z / 10;

        this.scaleX = $obj.scaleX / 10;
        this.scaleY = $obj.scaleY / 10;
        this.scaleZ = $obj.scaleZ / 10;

        this.rotationX = $obj.rotationX;
        this.rotationY = $obj.rotationY;
        this.rotationZ = $obj.rotationZ;

        this.data = $obj.data;

        FrameLinePointVo.maxTime = Math.max(this.time, FrameLinePointVo.maxTime)

    }
}

class FrameNodeVo {
    constructor() {
    }
    public type: number;
    public id: number;
    public name: number;
    public url: string;
    public resurl: string;

    public noLight: boolean;
    public directLight: boolean;
    public receiveShadow: boolean;
    public lighturl: string

    public pointitem: Array<FrameLinePointVo>;
    public materialInfoArr: Array<any>;

    public materialurl: string

    public writeObject($obj: any): void {

        this.id = $obj.id;
        this.name = $obj.name;
        this.url = $obj.url;


        this.pointitem = new Array
        for (var j: number = 0; j < $obj.pointitem.length; j++) {
            var $FrameLinePointVo: FrameLinePointVo = new FrameLinePointVo();
            $FrameLinePointVo.writeObject($obj.pointitem[j])
            this.pointitem.push($FrameLinePointVo)
        }
        this.resurl = $obj.resurl
        if (this.url.search(".prefab") != -1) {
            this.materialInfoArr = new Array
            for (var i: number = 0; $obj.materialInfoArr && i < $obj.materialInfoArr.length; i++) {
                this.materialInfoArr.push($obj.materialInfoArr[i])
            }
            this.noLight = $obj.noLight;
            this.directLight = $obj.directLight;
            this.receiveShadow = $obj.receiveShadow;

            if (this.noLight == false) {
                this.lighturl = $obj.lighturl

            }
            this.materialurl = $obj.materialurl
            this.type = 1;
        }
        if (this.url.search(".lyf") != -1) {
            this.type = 2;
        }
        if (this.url.search(".zzw") != -1) {
            this.type = 3;
        }



    }



}
class Frame3dRes extends BaseRes {
    private _completeFun: Function;
    public load($url: string, $completeFun: Function): void {
        this._completeFun = $completeFun;
        LoadManager.getInstance().load($url, LoadManager.BYTE_TYPE, ($byte: ArrayBuffer) => {
            this.loadComplete($byte);
        }, null);
    }
    public static frameSpeedNum: number;
    public static sceneFileroot: string;
    public static fileName: string;
    public haveVideo: boolean
    public loadComplete($byte: ArrayBuffer): void {

        this._byte = new ByteArray($byte);
        this._byte.position = 0;
        this.version = this._byte.readInt();
        if (this.version >= 31) {

        }
        var $str = this._byte.readUTF();
        var $itemstr: Array<string> = $str.split("/")
        Frame3dRes.sceneFileroot = $str.replace($itemstr[$itemstr.length - 1], "")
        Frame3dRes.fileName = $itemstr[$itemstr.length - 1]

    
        Frame3dRes.frameSpeedNum = this._byte.readInt();
        console.log("版本", this.version, "frameSpeedNum", Frame3dRes.frameSpeedNum)


        this.readSceneInfo();


        this.read(() => { this.readNext() });//img
    }
    private toVect4($num: number): Vector3D {
        var temp: number = Math.floor(65536 * $num);
        var a: number = Math.floor(temp / 256);
        var b: number = Math.floor(temp - a * 256);
        return new Vector3D(a / 256, b / 256, 0, 1);

    }
    private toNum(vect: Vector3D): number {
        var $a: number = vect.x * 256;
        var $b: number = vect.y * 256;
        var $bnum: number = ($a * 256 + $b) / 65536
        console.log("$bnum", $bnum)
        return ($a * 256 + $b) / 65536
    }
    //收获环境参数
    private readSceneInfo(): void {
        var size: number = this._byte.readInt();
        var $obj: any = JSON.parse(this._byte.readUTFBytes(size));

        this.haveVideo = $obj.haveVideo;
        Scene_data.light.setData($obj.SunNrm, $obj.SunLigth, $obj.AmbientLight);
        LightBmpModel.getInstance().videoLightUvData = $obj.videoLightUvData;

    }
    public static frameNum: number = 1
    public readNext(): void {
        this.read();//obj
        this.read();//material
        this.read();//particle;
        this.readFrame3dScene()

    }
    public frameItem: Array<FrameNodeVo>
    public readFrame3dScene(): void {
        this.frameItem = new Array;
        var size: number = this._byte.readInt();
        var $scene = JSON.parse(this._byte.readUTFBytes(size));
        for (var i: number = 0; i < $scene.length; i++) {
            var $frameNodeVo: FrameNodeVo = new FrameNodeVo()
            $frameNodeVo.writeObject($scene[i])
            this.frameItem.push($frameNodeVo)
        }
        this._completeFun();
    }
}

class FrameSceneChar extends SceneChar {
    private shadowShadr: Shader3D
    constructor() {
        super();
        ProgrmaManager.getInstance().registe(Md5ShadowShader.Md5ShadowShader, new Md5ShadowShader);
        this.shadowShadr = ProgrmaManager.getInstance().getProgram(Md5ShadowShader.Md5ShadowShader);
    }
    public upShadow(): void {
        if (this.meshVisible) {
            for (var i: number = 0; this._skinMesh && this._skinMesh.meshAry && i < this._skinMesh.meshAry.length; i++) {
                this.updateMaterialMeshShadow(this._skinMesh.meshAry[i]);
            }
        }
    }
    public updateMaterialMeshShadow($mesh: MeshData): void {
        if (!$mesh.material) {
            return;

        }
        var $shader: Shader3D = this.shadowShadr
        Scene_data.context3D.setProgram($shader.program);
        Scene_data.context3D.setVpMatrix($shader, Scene_data.vpMatrix.m);
        Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", this.posMatrix.m);
        Scene_data.context3D.setRenderTexture($shader, "fs0", $mesh.material.texList[0].texture, 1);
        this.setMeshVcShadow($mesh);
        this.setVaCompressShadow($mesh);
        Scene_data.context3D.drawCall($mesh.indexBuffer, $mesh.treNum);
    }

    public setVaCompressShadow($mesh: MeshData): void {
        Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $mesh.vertexBuffer);
        Scene_data.context3D.setVaOffset(0, 3, $mesh.stride, 0);
        Scene_data.context3D.setVaOffset(1, 2, $mesh.stride, $mesh.uvsOffsets);
        Scene_data.context3D.setVaOffset(2, 4, $mesh.stride, $mesh.boneIDOffsets);
        Scene_data.context3D.setVaOffset(3, 4, $mesh.stride, $mesh.boneWeightOffsets);

    }

    public setMeshVcShadow($mesh: MeshData): void {
        var animData: AnimData
        if (this._animDic[this.curentAction]) {
            animData = this._animDic[this.curentAction];
        } else if (this._animDic[this._defaultAction]) {
            animData = this._animDic[this._defaultAction];
        } else {
            return;
        }
        var $dualQuatFrame: DualQuatFloat32Array = animData.boneQPAry[$mesh.uid][this._curentFrame];
        var $shader: Shader3D = this.shadowShadr
        Scene_data.context3D.setVc4fv($shader, "boneQ", $dualQuatFrame.quat); //旋转
        Scene_data.context3D.setVc3fv($shader, "boneD", $dualQuatFrame.pos);  //所有的位移
    }
}


class FrameFileNode extends Vector3D {
    constructor() {
        super();
    }
    public frameNodeVo: FrameNodeVo;
    private _particle: CombineParticle;
    private _sceneChar: FrameSceneChar;
    private _lightSprite: LightDisplay3DSprite;
    private _frameBuildSprite: FrameBuildSprite;
    private _shadowDisplay3DSprite: ShadowDisplay3DSprite;
    public sprite: any;

    public setFrameNodeVo($vo: FrameNodeVo): void {
        this.frameNodeVo = $vo
        if (this.frameNodeVo.type == 1) {

            if (this.frameNodeVo.directLight) {  //有法线的对象
                this._frameBuildSprite = new FrameBuildSprite;
                this._frameBuildSprite.setFrameNodeUrl(this.frameNodeVo);
                SceneManager.getInstance().addDisplay(this._frameBuildSprite);
                this.sprite = this._frameBuildSprite;
            } else {
                if (this.frameNodeVo.receiveShadow) {
                    this._shadowDisplay3DSprite = new ShadowDisplay3DSprite();
                    this._shadowDisplay3DSprite.setFrameNodeUrl(this.frameNodeVo);
                    SceneManager.getInstance().addDisplay(this._shadowDisplay3DSprite);
                    this.sprite = this._shadowDisplay3DSprite;
                } else {
                    this._lightSprite = new LightDisplay3DSprite();
                    this._lightSprite.setFrameNodeUrl(this.frameNodeVo);
                    SceneManager.getInstance().addDisplay(this._lightSprite);
                    this.sprite = this._lightSprite;

                    //this._lightSprite.setObjUrl($vo.resurl);
                    //this._lightSprite.setMaterialUrl($vo.materialurl, $vo.materialInfoArr);
                    //this._lightSprite.materialInfoArr = $vo.materialInfoArr
                    //this._lightSprite.setLightMapUrl($vo.lighturl);
                }


            }

        }
        if (this.frameNodeVo.type == 2) {
            this._particle = ParticleManager.getInstance().getParticleByte(Scene_data.fileRoot + $vo.resurl);
            this._particle.dynamic = true;
            this._particle.sceneVisible = false
            ParticleManager.getInstance().addParticle(this._particle);
            this.sprite = this._particle

        }
        if (this.frameNodeVo.type == 3) {
            this._sceneChar = new FrameSceneChar()
            this._sceneChar.shadow = false
            this._sceneChar.setRoleUrl(this.frameNodeVo.resurl);
            SceneManager.getInstance().addMovieDisplay(this._sceneChar);

            this.sprite = this._sceneChar
        }
    }
    public sceneVisible: boolean
    public update(): void {
        this.sceneVisible = this.isVisible(Frame3dRes.frameNum)
        
        if (this.sceneVisible) {
            this.setModelSprite(this.playFrameVoByTime(Frame3dRes.frameNum))
        }
        if (this._particle) {
            this._particle.sceneVisible = this.sceneVisible;
        }
        if (this._frameBuildSprite) {
            this._frameBuildSprite.sceneVisible = this.sceneVisible;
        }
        if (this._lightSprite) {
            this._lightSprite.sceneVisible = this.sceneVisible;
        }
    }
    public playFrameVoByTime($time: number): FrameLinePointVo {
        var $keyC: FrameLinePointVo;
        var $a: FrameLinePointVo = this.getPreFrameLinePointVoByTime($time)
        var $b: FrameLinePointVo = this.getNextFrameLinePointVoByTime($time)
        for (var i: number = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time == $time) {
                $keyC = this.frameNodeVo.pointitem[i];
            }
        }
        if ($keyC) {
            if ($keyC.iskeyFrame) {
                return $keyC
            }
        } else {
            if ($a && !$a.isAnimation) {
                return $a
            } else if ($a && $b) {
                return this.setModelData($a, $b, $time)
            }
        }
        return null
    }
    public getNextFrameLinePointVoByTime($time: number): FrameLinePointVo  //包含当前
    {
        var $next: FrameLinePointVo;
        for (var i: number = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time >= $time) {
                if (!$next || $next.time > this.frameNodeVo.pointitem[i].time) {
                    $next = this.frameNodeVo.pointitem[i]
                }
            }
        }
        return $next
    }
    public isVisible($num: number): boolean {
        var $min: number = this.frameNodeVo.pointitem[0].time;
        var $max: number = this.frameNodeVo.pointitem[this.frameNodeVo.pointitem.length - 1].time
        var dd: FrameLinePointVo = this.getPreFrameLinePointVoByTime($num);
        if ($num >= $min && $num <= $max && dd) {
            return dd.iskeyFrame;
        } else {
            return false;
        }
    }
    public getPreFrameLinePointVoByTime($time: number): FrameLinePointVo  //包含当前
    {
        var $pre: FrameLinePointVo;
        for (var i: number = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time <= $time) {
                if (!$pre || $pre.time < this.frameNodeVo.pointitem[i].time) {
                    $pre = this.frameNodeVo.pointitem[i]
                }
            }
        }
        return $pre
    }


    private setModelData($a: FrameLinePointVo, $b: FrameLinePointVo, $time: number): FrameLinePointVo {
        var $num: number = ($time - $a.time) / ($b.time - $a.time);

        var $obj: FrameLinePointVo = new FrameLinePointVo
        $obj.x = $a.x + ($b.x - $a.x) * $num;
        $obj.y = $a.y + ($b.y - $a.y) * $num;
        $obj.z = $a.z + ($b.z - $a.z) * $num;

        $obj.scaleX = $a.scaleX + ($b.scaleX - $a.scaleX) * $num;
        $obj.scaleY = $a.scaleY + ($b.scaleY - $a.scaleY) * $num;
        $obj.scaleZ = $a.scaleZ + ($b.scaleZ - $a.scaleZ) * $num;

        var $eulerAngle: Vector3D = this.qtoq($a, $b, $num)
        $obj.rotationX = $eulerAngle.x
        $obj.rotationY = $eulerAngle.y
        $obj.rotationZ = $eulerAngle.z
        $obj.data = $a.data //存前面一个的数所有 
				
        if (!$b.iskeyFrame) {
            return $a
        } else {
            return $obj
        }

    }
    private setModelSprite($obj: FrameLinePointVo): void {

        if (this.sprite) {
            this.sprite.x = $obj.x;
            this.sprite.y = $obj.y;
            this.sprite.z = $obj.z;
            this.sprite.scaleX = $obj.scaleX;
            this.sprite.scaleY = $obj.scaleY;
            this.sprite.scaleZ = $obj.scaleZ;
            this.sprite.rotationX = $obj.rotationX;
            this.sprite.rotationY = $obj.rotationY;
            this.sprite.rotationZ = $obj.rotationZ;
        }
        if (this._sceneChar) {
            if ($obj.data && $obj.data.action) {
                if (this._sceneChar.curentAction != $obj.data.action) {
                    this._sceneChar.play($obj.data.action)
                }
            }

        }

    }
    private qtoq($a: FrameLinePointVo, $b: FrameLinePointVo, $time: number): Vector3D {

        var $m0: Matrix3D = new Matrix3D();
        $m0.appendRotation($a.rotationX, Vector3D.X_AXIS)
        $m0.appendRotation($a.rotationY, Vector3D.Y_AXIS)
        $m0.appendRotation($a.rotationZ, Vector3D.Z_AXIS)
        var q0: Quaternion = new Quaternion()
        q0.fromMatrix($m0)

        var $m1: Matrix3D = new Matrix3D();
        $m1.appendRotation($b.rotationX, Vector3D.X_AXIS)
        $m1.appendRotation($b.rotationY, Vector3D.Y_AXIS)
        $m1.appendRotation($b.rotationZ, Vector3D.Z_AXIS)
        var q1: Quaternion = new Quaternion()
        q1.fromMatrix($m1)

        var resultQ: Quaternion = new Quaternion;
        resultQ.slerp(q0, q1, $time);
        var $ve: Vector3D = resultQ.toEulerAngles();
        $ve.scaleBy(180 / Math.PI)

        if (isNaN($ve.x) || isNaN($ve.y) || isNaN($ve.z)) {
            $ve.x = $a.rotationX;
            $ve.y = $a.rotationY;
            $ve.z = $a.rotationZ;
        }

        return $ve
    }


}
