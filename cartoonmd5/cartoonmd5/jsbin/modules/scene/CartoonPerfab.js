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
var CartoonDisplay3dSprite = /** @class */ (function (_super) {
    __extends(CartoonDisplay3dSprite, _super);
    function CartoonDisplay3dSprite() {
        var _this = _super.call(this) || this;
        _this.Factor = 0.5;
        _this.Outline = 0.5;
        return _this;
    }
    CartoonDisplay3dSprite.prototype.update = function () {
        this.updateOutLine();
    };
    CartoonDisplay3dSprite.prototype.setMaztion = function () {
        var tf = Scene_data.context3D.pushVa(this.objData.vertexBuffer);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
        Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
        Scene_data.context3D.setVaOffset(1, 3, this.objData.stride, this.objData.normalsOffsets);
        if (!this._rotationData) {
            this._rotationData = new Float32Array(9);
        }
    };
    CartoonDisplay3dSprite.prototype.updateOutLine = function () {
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(true);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CCW);
        ProgrmaManager.getInstance().registe(OurLineRoundShader.OurLineRoundShader, new OurLineRoundShader);
        this.shader = ProgrmaManager.getInstance().getProgram(OurLineRoundShader.OurLineRoundShader);
        Scene_data.context3D.setProgram(this.shader.program);
        this.setMaztion();
        var $rotationM = Scene_data.cam3D.cameraMatrix.clone();
        $rotationM.prepend(this.posMatrix);
        $rotationM.getRotaion(this._rotationData);
        Scene_data.context3D.setVcMatrix3fv(this.shader, "rotationMatrix3D", this._rotationData);
        var nt = 1 / ((this.scaleX + this.scaleZ + this.scaleZ) / 3);
        //this.Factor= nt
        //this.Outline = nt*2
        Scene_data.context3D.setVc4fv(this.shader, "datainfo", [this.Factor, this.Outline, 1, 1]);
        Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
    };
    CartoonDisplay3dSprite.prototype.updateCortoon = function () {
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(false);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CW);
        if (this.objData && this.objData.indexBuffer) {
            ProgrmaManager.getInstance().registe(OutCortoonShader.OutCortoonShader, new OutCortoonShader);
            this.shader = ProgrmaManager.getInstance().getProgram(OutCortoonShader.OutCortoonShader);
            Scene_data.context3D.setProgram(this.shader.program);
            this.setMaztion();
            var $m = this.posMatrix.clone();
            // $m.appendTranslation(30,0,0)
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", $m.m);
            this.posMatrix.getRotaion(this._rotationData);
            Scene_data.context3D.setVcMatrix3fv(this.shader, "rotationMatrix3D", this._rotationData);
            // Scene_data.context3D.setVc3fv(this.shader, "lightNrm", [1, 2, 3]);
            Scene_data.context3D.setVc3fv(this.shader, "lightNrm", Scene_data.light.sunDirect);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
        }
    };
    return CartoonDisplay3dSprite;
}(Display3DSprite));
var CartoonPerfab = /** @class */ (function (_super) {
    __extends(CartoonPerfab, _super);
    function CartoonPerfab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._Factor = 0.5;
        _this._Outline = 0.5;
        return _this;
    }
    CartoonPerfab.prototype.loadPartRes = function ($bindSocket, groupRes, ary) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                var display = new CartoonDisplay3dSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                display.dynamic = true;
                ary.push(display);
                display.setBind(this, $bindSocket);
                SceneManager.getInstance().addDisplay(display);
            }
        }
        this.updateRotationMatrix();
        this.changeCartoonData();
        /*
       var _Factor: number = nt
        var _Outline: number = nt*2
        */
    };
    CartoonPerfab.prototype.changeCartoonData = function () {
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            $dis.Factor = this._Factor;
            $dis.Outline = this._Outline;
        }
    };
    Object.defineProperty(CartoonPerfab.prototype, "Factor", {
        set: function (value) {
            this._Factor = value;
            this.changeCartoonData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CartoonPerfab.prototype, "Outline", {
        set: function (value) {
            this._Outline = value;
            this.changeCartoonData();
        },
        enumerable: true,
        configurable: true
    });
    CartoonPerfab.prototype.updateRotationMatrix = function () {
        _super.prototype.updateRotationMatrix.call(this);
        for (var i = 0; i < this.item.length; i++) {
            var $dis = this.item[i];
            $dis.posMatrix = this.posMatrix;
        }
    };
    CartoonPerfab.prototype.setPerfabName = function ($str) {
        var _this = this;
        this.item = new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            _this.loadPartRes("", groupRes, _this.item);
        });
    };
    return CartoonPerfab;
}(ScenePerfab));
//# sourceMappingURL=CartoonPerfab.js.map