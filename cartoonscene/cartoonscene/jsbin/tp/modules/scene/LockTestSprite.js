var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LockTestSprite = (function (_super) {
    __extends(LockTestSprite, _super);
    function LockTestSprite() {
        _super.call(this);
        this.ccavSkilNum = 0;
        ProgrmaManager.getInstance().registe(Md5MeshShader.Md5MeshShader, new Md5MeshShader);
        this.md5shader = ProgrmaManager.getInstance().getProgram(Md5MeshShader.Md5MeshShader);
        this.loadTexture();
        this.loadBodyMesh();
    }
    LockTestSprite.prototype.loadBodyMesh = function () {
        var _this = this;
        LoadManager.getInstance().load(Scene_data.fileRoot + "lyf/qk.md5mesh", LoadManager.XML_TYPE, function ($str) {
            var $md5Analysis = new Md5Analysis();
            _this._md5MeshData = $md5Analysis.addMesh($str);
            new MeshImportSort().processMesh(_this._md5MeshData);
            _this.md5objData = new MeshToObjUtils().getObj(_this._md5MeshData);
            _this.loadAnimFrame();
        });
    };
    LockTestSprite.prototype.loadAnimFrame = function () {
        var _this = this;
        LoadManager.getInstance().load(Scene_data.fileRoot + "lyf/standqk.md5anim", LoadManager.XML_TYPE, function ($str) {
            var $ddd = new Md5animAnalysis();
            $ddd.addAnim($str);
            _this.matrixAry = $ddd.resultInfo.matrixAry;
            _this.ccavAnimData = new AnimData();
            _this.ccavAnimData.boneQPAry = new Array();
            _this.ccavAnimData.boneQPAry.push(new Array);
            for (var i = 0; i < _this.matrixAry.length; i++) {
                var frameAry = _this.matrixAry[i];
                for (var j = 0; j < frameAry.length; j++) {
                    frameAry[j].prepend(_this.md5objData.invertAry[j]);
                }
                _this.makeQaCopy(_this.matrixAry[i]);
            }
        });
    };
    LockTestSprite.prototype.makeQaCopy = function (frameAry) {
        var newIDBoneArr = this._md5MeshData.boneNewIDAry;
        var baseBone = frameAry;
        var $tempDq = new DualQuatFloat32Array;
        $tempDq.quat = new Float32Array(newIDBoneArr.length * 4);
        $tempDq.pos = new Float32Array(newIDBoneArr.length * 3);
        for (var k = 0; k < newIDBoneArr.length; k++) {
            var $m = baseBone[newIDBoneArr[k]].clone();
            $m.appendScale(-1, 1, 1); //特别标记，因为四元数和矩阵运算结果不一
            var $q = new Quaternion();
            $q.fromMatrix($m);
            var $p = $m.position;
            $tempDq.quat[k * 4 + 0] = $q.x;
            $tempDq.quat[k * 4 + 1] = $q.y;
            $tempDq.quat[k * 4 + 2] = $q.z;
            $tempDq.quat[k * 4 + 3] = $q.w;
            $tempDq.pos[k * 3 + 0] = $p.x;
            $tempDq.pos[k * 3 + 1] = $p.y;
            $tempDq.pos[k * 3 + 2] = $p.z;
        }
        this.ccavAnimData.boneQPAry[0].push($tempDq);
    };
    LockTestSprite.prototype.loadTexture = function () {
        var $ctx = UIManager.getInstance().getContext2D(128, 128, false);
        $ctx.fillStyle = "rgb(255,0,0)";
        $ctx.fillRect(0, 0, 128, 128);
        this._uvTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);
        TextureManager.getInstance().getTexture(Scene_data.fileRoot + "lyf/qkjpg.jpg", function ($textureRes) {
            // this._uvTextureRes = $textureRes
        });
    };
    LockTestSprite.prototype.updateMaterialMesh = function ($mesh) {
        if (!$mesh.material) {
            return;
        }
        this.updateMaterialMeshCopy($mesh);
    };
    LockTestSprite.prototype.updateMaterialMeshCopy = function ($mesh) {
        this.baseShder = this.md5shader;
        Scene_data.context3D.setProgram(this.baseShder.program);
        Scene_data.context3D.setVpMatrix(this.baseShder, Scene_data.vpMatrix.m);
        var $m = this.posMatrix.clone();
        Scene_data.context3D.setVcMatrix4fv(this.baseShder, "posMatrix3D", $m.m);
        Scene_data.context3D.setRenderTexture(this.baseShder, "fc0", this._uvTextureRes.texture, 0);
        Scene_data.context3D.setVa(0, 3, this.md5objData.vertexBuffer);
        Scene_data.context3D.setVa(1, 2, this._md5MeshData.uvBuffer);
        Scene_data.context3D.setVa(2, 4, this._md5MeshData.boneIdBuffer);
        Scene_data.context3D.setVa(3, 4, this._md5MeshData.boneWeightBuffer);
        var $len = this.ccavAnimData.boneQPAry[0].length;
        this.dualQuatFloat32Array = this.ccavAnimData.boneQPAry[0][this.ccavSkilNum++ % $len];
        Scene_data.context3D.setVc4fv(this.baseShder, "boneQ", this.dualQuatFloat32Array.quat); //旋转
        Scene_data.context3D.setVc3fv(this.baseShder, "boneD", this.dualQuatFloat32Array.pos); //所有的位移
        //  this.setMeshVcCopy($mesh)
        Scene_data.context3D.drawCall(this._md5MeshData.indexBuffer, this._md5MeshData.treNum);
    };
    return LockTestSprite;
})(Display3dMovie);
//# sourceMappingURL=LockTestSprite.js.map