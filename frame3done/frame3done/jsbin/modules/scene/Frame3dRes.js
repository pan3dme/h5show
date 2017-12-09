var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FrameLinePointVo = /** @class */ (function (_super) {
    __extends(FrameLinePointVo, _super);
    function FrameLinePointVo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FrameLinePointVo.prototype.writeObject = function ($obj) {
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
        FrameLinePointVo.maxTime = Math.max(this.time, FrameLinePointVo.maxTime);
    };
    FrameLinePointVo.maxTime = 0;
    return FrameLinePointVo;
}(Object3D));
var FrameNodeVo = /** @class */ (function () {
    function FrameNodeVo() {
    }
    FrameNodeVo.prototype.writeObject = function ($obj) {
        this.id = $obj.id;
        this.name = $obj.name;
        this.url = $obj.url;
        this.pointitem = new Array;
        for (var j = 0; j < $obj.pointitem.length; j++) {
            var $FrameLinePointVo = new FrameLinePointVo();
            $FrameLinePointVo.writeObject($obj.pointitem[j]);
            this.pointitem.push($FrameLinePointVo);
        }
        this.resurl = $obj.resurl;
        if (this.url.search(".prefab") != -1) {
            this.materialInfoArr = new Array;
            for (var i = 0; $obj.materialInfoArr && i < $obj.materialInfoArr.length; i++) {
                this.materialInfoArr.push($obj.materialInfoArr[i]);
            }
            this.noLight = $obj.noLight;
            this.directLight = $obj.directLight;
            this.receiveShadow = $obj.receiveShadow;
            if (this.noLight == false) {
                this.lighturl = $obj.lighturl;
            }
            this.materialurl = $obj.materialurl;
            this.type = 1;
        }
        if (this.url.search(".lyf") != -1) {
            this.type = 2;
        }
        if (this.url.search(".zzw") != -1) {
            this.type = 3;
        }
    };
    return FrameNodeVo;
}());
var Frame3dRes = /** @class */ (function (_super) {
    __extends(Frame3dRes, _super);
    function Frame3dRes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Frame3dRes.prototype.load = function ($url, $completeFun) {
        var _this = this;
        this._completeFun = $completeFun;
        LoadManager.getInstance().load($url, LoadManager.BYTE_TYPE, function ($byte) {
            _this.loadComplete($byte);
        }, null);
    };
    Frame3dRes.prototype.loadComplete = function ($byte) {
        var _this = this;
        this._byte = new ByteArray($byte);
        this._byte.position = 0;
        this.version = this._byte.readInt();
        if (this.version >= 31) {
        }
        var $str = this._byte.readUTF();
        var $itemstr = $str.split("/");
        Frame3dRes.sceneFileroot = $str.replace($itemstr[$itemstr.length - 1], "");
        Frame3dRes.fileName = $itemstr[$itemstr.length - 1];
        Frame3dRes.frameSpeedNum = this._byte.readInt();
        console.log("版本", this.version, "frameSpeedNum", Frame3dRes.frameSpeedNum);
        this.readSceneInfo();
        this.read(function () { _this.readNext(); }); //img
    };
    Frame3dRes.prototype.toVect4 = function ($num) {
        var temp = Math.floor(65536 * $num);
        var a = Math.floor(temp / 256);
        var b = Math.floor(temp - a * 256);
        return new Vector3D(a / 256, b / 256, 0, 1);
    };
    Frame3dRes.prototype.toNum = function (vect) {
        var $a = vect.x * 256;
        var $b = vect.y * 256;
        var $bnum = ($a * 256 + $b) / 65536;
        console.log("$bnum", $bnum);
        return ($a * 256 + $b) / 65536;
    };
    //收获环境参数
    Frame3dRes.prototype.readSceneInfo = function () {
        var size = this._byte.readInt();
        var $obj = JSON.parse(this._byte.readUTFBytes(size));
        this.haveVideo = $obj.haveVideo;
        Scene_data.light.setData($obj.SunNrm, $obj.SunLigth, $obj.AmbientLight);
        LightBmpModel.getInstance().videoLightUvData = $obj.videoLightUvData;
    };
    Frame3dRes.prototype.readNext = function () {
        this.read(); //obj
        this.read(); //material
        this.read(); //particle;
        this.readFrame3dScene();
    };
    Frame3dRes.prototype.readFrame3dScene = function () {
        this.frameItem = new Array;
        var size = this._byte.readInt();
        var $scene = JSON.parse(this._byte.readUTFBytes(size));
        for (var i = 0; i < $scene.length; i++) {
            var $frameNodeVo = new FrameNodeVo();
            $frameNodeVo.writeObject($scene[i]);
            this.frameItem.push($frameNodeVo);
        }
        this._completeFun();
    };
    Frame3dRes.frameNum = 1;
    return Frame3dRes;
}(BaseRes));
var FrameSceneChar = /** @class */ (function (_super) {
    __extends(FrameSceneChar, _super);
    function FrameSceneChar() {
        var _this = _super.call(this) || this;
        ProgrmaManager.getInstance().registe(Md5ShadowShader.Md5ShadowShader, new Md5ShadowShader);
        _this.shadowShadr = ProgrmaManager.getInstance().getProgram(Md5ShadowShader.Md5ShadowShader);
        return _this;
    }
    FrameSceneChar.prototype.upShadow = function () {
        if (this.meshVisible) {
            for (var i = 0; this._skinMesh && this._skinMesh.meshAry && i < this._skinMesh.meshAry.length; i++) {
                this.updateMaterialMeshShadow(this._skinMesh.meshAry[i]);
            }
        }
    };
    FrameSceneChar.prototype.updateMaterialMeshShadow = function ($mesh) {
        if (!$mesh.material) {
            return;
        }
        var $shader = this.shadowShadr;
        Scene_data.context3D.setProgram($shader.program);
        Scene_data.context3D.setVpMatrix($shader, Scene_data.vpMatrix.m);
        Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", this.posMatrix.m);
        Scene_data.context3D.setRenderTexture($shader, "fs0", $mesh.material.texList[0].texture, 1);
        this.setMeshVcShadow($mesh);
        this.setVaCompressShadow($mesh);
        Scene_data.context3D.drawCall($mesh.indexBuffer, $mesh.treNum);
    };
    FrameSceneChar.prototype.setVaCompressShadow = function ($mesh) {
        Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $mesh.vertexBuffer);
        Scene_data.context3D.setVaOffset(0, 3, $mesh.stride, 0);
        Scene_data.context3D.setVaOffset(1, 2, $mesh.stride, $mesh.uvsOffsets);
        Scene_data.context3D.setVaOffset(2, 4, $mesh.stride, $mesh.boneIDOffsets);
        Scene_data.context3D.setVaOffset(3, 4, $mesh.stride, $mesh.boneWeightOffsets);
    };
    FrameSceneChar.prototype.setMeshVcShadow = function ($mesh) {
        var animData;
        if (this._animDic[this.curentAction]) {
            animData = this._animDic[this.curentAction];
        }
        else if (this._animDic[this._defaultAction]) {
            animData = this._animDic[this._defaultAction];
        }
        else {
            return;
        }
        var $dualQuatFrame = animData.boneQPAry[$mesh.uid][this._curentFrame];
        var $shader = this.shadowShadr;
        Scene_data.context3D.setVc4fv($shader, "boneQ", $dualQuatFrame.quat); //旋转
        Scene_data.context3D.setVc3fv($shader, "boneD", $dualQuatFrame.pos); //所有的位移
    };
    return FrameSceneChar;
}(SceneChar));
var FrameFileNode = /** @class */ (function (_super) {
    __extends(FrameFileNode, _super);
    function FrameFileNode() {
        return _super.call(this) || this;
    }
    FrameFileNode.prototype.setFrameNodeVo = function ($vo) {
        this.frameNodeVo = $vo;
        if (this.frameNodeVo.type == 1) {
            if (this.frameNodeVo.directLight) {
                this._frameBuildSprite = new FrameBuildSprite;
                this._frameBuildSprite.setFrameNodeUrl(this.frameNodeVo);
                SceneManager.getInstance().addDisplay(this._frameBuildSprite);
                this.sprite = this._frameBuildSprite;
            }
            else {
                if (this.frameNodeVo.receiveShadow) {
                    this._shadowDisplay3DSprite = new ShadowDisplay3DSprite();
                    this._shadowDisplay3DSprite.setFrameNodeUrl(this.frameNodeVo);
                    SceneManager.getInstance().addDisplay(this._shadowDisplay3DSprite);
                    this.sprite = this._shadowDisplay3DSprite;
                }
                else {
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
            this._particle.sceneVisible = false;
            ParticleManager.getInstance().addParticle(this._particle);
            this.sprite = this._particle;
        }
        if (this.frameNodeVo.type == 3) {
            this._sceneChar = new FrameSceneChar();
            this._sceneChar.shadow = false;
            this._sceneChar.setRoleUrl(this.frameNodeVo.resurl);
            SceneManager.getInstance().addMovieDisplay(this._sceneChar);
            this.sprite = this._sceneChar;
        }
    };
    FrameFileNode.prototype.update = function () {
        this.sceneVisible = this.isVisible(Frame3dRes.frameNum);
        if (this.sceneVisible) {
            this.setModelSprite(this.playFrameVoByTime(Frame3dRes.frameNum));
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
    };
    FrameFileNode.prototype.playFrameVoByTime = function ($time) {
        var $keyC;
        var $a = this.getPreFrameLinePointVoByTime($time);
        var $b = this.getNextFrameLinePointVoByTime($time);
        for (var i = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time == $time) {
                $keyC = this.frameNodeVo.pointitem[i];
            }
        }
        if ($keyC) {
            if ($keyC.iskeyFrame) {
                return $keyC;
            }
        }
        else {
            if ($a && !$a.isAnimation) {
                return $a;
            }
            else if ($a && $b) {
                return this.setModelData($a, $b, $time);
            }
        }
        return null;
    };
    FrameFileNode.prototype.getNextFrameLinePointVoByTime = function ($time) {
        var $next;
        for (var i = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time >= $time) {
                if (!$next || $next.time > this.frameNodeVo.pointitem[i].time) {
                    $next = this.frameNodeVo.pointitem[i];
                }
            }
        }
        return $next;
    };
    FrameFileNode.prototype.isVisible = function ($num) {
        var $min = this.frameNodeVo.pointitem[0].time;
        var $max = this.frameNodeVo.pointitem[this.frameNodeVo.pointitem.length - 1].time;
        var dd = this.getPreFrameLinePointVoByTime($num);
        if ($num >= $min && $num <= $max && dd) {
            return dd.iskeyFrame;
        }
        else {
            return false;
        }
    };
    FrameFileNode.prototype.getPreFrameLinePointVoByTime = function ($time) {
        var $pre;
        for (var i = 0; i < this.frameNodeVo.pointitem.length; i++) {
            if (this.frameNodeVo.pointitem[i].time <= $time) {
                if (!$pre || $pre.time < this.frameNodeVo.pointitem[i].time) {
                    $pre = this.frameNodeVo.pointitem[i];
                }
            }
        }
        return $pre;
    };
    FrameFileNode.prototype.setModelData = function ($a, $b, $time) {
        var $num = ($time - $a.time) / ($b.time - $a.time);
        var $obj = new FrameLinePointVo;
        $obj.x = $a.x + ($b.x - $a.x) * $num;
        $obj.y = $a.y + ($b.y - $a.y) * $num;
        $obj.z = $a.z + ($b.z - $a.z) * $num;
        $obj.scaleX = $a.scaleX + ($b.scaleX - $a.scaleX) * $num;
        $obj.scaleY = $a.scaleY + ($b.scaleY - $a.scaleY) * $num;
        $obj.scaleZ = $a.scaleZ + ($b.scaleZ - $a.scaleZ) * $num;
        var $eulerAngle = this.qtoq($a, $b, $num);
        $obj.rotationX = $eulerAngle.x;
        $obj.rotationY = $eulerAngle.y;
        $obj.rotationZ = $eulerAngle.z;
        $obj.data = $a.data; //存前面一个的数所有 
        if (!$b.iskeyFrame) {
            return $a;
        }
        else {
            return $obj;
        }
    };
    FrameFileNode.prototype.setModelSprite = function ($obj) {
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
                    this._sceneChar.play($obj.data.action);
                }
            }
        }
    };
    FrameFileNode.prototype.qtoq = function ($a, $b, $time) {
        var $m0 = new Matrix3D();
        $m0.appendRotation($a.rotationX, Vector3D.X_AXIS);
        $m0.appendRotation($a.rotationY, Vector3D.Y_AXIS);
        $m0.appendRotation($a.rotationZ, Vector3D.Z_AXIS);
        var q0 = new Quaternion();
        q0.fromMatrix($m0);
        var $m1 = new Matrix3D();
        $m1.appendRotation($b.rotationX, Vector3D.X_AXIS);
        $m1.appendRotation($b.rotationY, Vector3D.Y_AXIS);
        $m1.appendRotation($b.rotationZ, Vector3D.Z_AXIS);
        var q1 = new Quaternion();
        q1.fromMatrix($m1);
        var resultQ = new Quaternion;
        resultQ.slerp(q0, q1, $time);
        var $ve = resultQ.toEulerAngles();
        $ve.scaleBy(180 / Math.PI);
        if (isNaN($ve.x) || isNaN($ve.y) || isNaN($ve.z)) {
            $ve.x = $a.rotationX;
            $ve.y = $a.rotationY;
            $ve.z = $a.rotationZ;
        }
        return $ve;
    };
    return FrameFileNode;
}(Vector3D));
//# sourceMappingURL=Frame3dRes.js.map