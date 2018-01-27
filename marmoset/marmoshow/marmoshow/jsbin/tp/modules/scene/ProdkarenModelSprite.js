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
var ProdkarenModelShader = /** @class */ (function (_super) {
    __extends(ProdkarenModelShader, _super);
    function ProdkarenModelShader() {
        return _super.call(this) || this;
    }
    ProdkarenModelShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "vPosition");
        $context.bindAttribLocation(this.program, 1, "vTexCoord");
        $context.bindAttribLocation(this.program, 2, "vTangent");
        $context.bindAttribLocation(this.program, 3, "vBitangent");
        $context.bindAttribLocation(this.program, 4, "vNormal");
    };
    ProdkarenModelShader.prototype.getVertexShaderString = function () {
        var $str = "precision highp float;\n" +
            //"uniform mat4 uModelViewProjectionMatrix;\n" +
            //"uniform mat4 uSkyMatrix;\n" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "attribute vec3 vPosition;\n" +
            "attribute vec2 vTexCoord;\n" +
            "attribute vec2 vTangent;\n" +
            "attribute vec2 vBitangent;\n" +
            "attribute vec2 vNormal;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
            "vec3 r;\n" +
            "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
            "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
            "r.z=ie?-r.z:r.z;\n" +
            "return r;\n" +
            "}void main(void){" +
            "   vec4 vt0= vec4(vPosition, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "j=vTexCoord;\n" +
            "E=ic(vTangent);\n" +
            "F=ic(vBitangent);\n" +
            "G=ic(vNormal);\n" +
            "}\n";
        return $str;
    };
    ProdkarenModelShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying highp vec3 D;\n" +
            "varying  vec2 j;\n" +
            "varying  vec3 E;\n" +
            "varying  vec3 F;\n" +
            "varying  vec3 G;\n" +
            "void main(void){\n" +
            "gl_FragColor=vec4(G.xyz,1.0);\n" +
            "}\n";
        return $str;
    };
    ProdkarenModelShader.ProdkarenModelShader = "ProdkarenModelShader";
    return ProdkarenModelShader;
}(Shader3D));
var ProdkarenModelSprite = /** @class */ (function (_super) {
    __extends(ProdkarenModelSprite, _super);
    function ProdkarenModelSprite() {
        var _this = _super.call(this) || this;
        /*
        private parseFile(): void {
            if (this.reflectivityRes && this.reflectivityalphaRes) {
                console.log("ccav")
                var $textureRes: TextureRes = ProdkarenResModel.getInstance().fromFilesMergeAlpha(this.reflectivityRes, this.reflectivityalphaRes)
                this.reflectivityRes = $textureRes;
            }
        }
        */
        _this.skipNum = 0;
        _this.scaleX = 1;
        _this.scaleY = 1;
        _this.scaleZ = 1;
        ProgrmaManager.getInstance().registe(ProdkarenModelShader.ProdkarenModelShader, new ProdkarenModelShader);
        _this.shader = ProgrmaManager.getInstance().getProgram(ProdkarenModelShader.ProdkarenModelShader);
        _this.program = _this.shader.program;
        ProdkarenResModel.getInstance().loadBuffByTxtUrl("model.txt", function ($buff) {
            _this.modelBuff = $buff;
        });
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", function (groupRes) {
            _this.loadPartRes(groupRes);
        });
        return _this;
    }
    ProdkarenModelSprite.prototype.loadPartRes = function (groupRes) {
        for (var i = 0; i < groupRes.dataAry.length; i++) {
            var item = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                this.kkkDisplay3DSprite = new Display3DSprite;
                this.kkkDisplay3DSprite.setObjUrl(item.objUrl);
                return;
            }
        }
    };
    ProdkarenModelSprite.prototype.loadTexture = function () {
        var _this = this;
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic703432.txt", function ($texture) {
            _this._uvTextureRes = $texture;
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic598211.txt", function ($texture) {
            _this.reflectivityRes = $texture;
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("reflectivityalpha.txt", function ($texture) {
            _this.reflectivityalphaRes = $texture;
        });
        ProdkarenResModel.getInstance().loadTexturelByBoldUrl("pic535317.txt", function ($texture) {
            _this.normalTextRes = $texture;
        });
        ProdkarenResModel.getInstance().loadSkyTextureByUrl("picsky.txt", function ($texture) {
            _this.tSkySpecular = $texture;
        });
        ProdkarenResModel.getInstance().flectAlphaByUrl("pic598211.txt", "reflectivityalpha.txt", function ($texture) {
            _this.imageDataReflecRes = $texture;
        });
    };
    ProdkarenModelSprite.prototype.mathCamPos = function ($mouseM) {
        var $m = $mouseM.clone();
        $m.invert();
        var $kpos = new Vector3D(11.002893447875977, -1.5622071027755737, 14.670757293701172);
        $kpos = $m.transformVector($kpos);
        return $kpos;
    };
    ProdkarenModelSprite.prototype.update = function () {
        if (this.kkkDisplay3DSprite && this.kkkDisplay3DSprite.objData) {
            if (this.tSkySpecular && this._uvTextureRes && this.reflectivityRes && this.normalTextRes && this.imageDataReflecRes && this.modelBuff) {
                Scene_data.context3D.setProgram(this.program);
                /*
                var $uModelViewProjectionMatrix: Matrix3D = Scene_data.viewMatrx3D.clone();
                $uModelViewProjectionMatrix.prepend(Scene_data.cam3D.cameraMatrix);
                $uModelViewProjectionMatrix.prepend(this.posMatrix);
                */
                /*
                var $view: Matrix3D = new Matrix3D
                $view.m = new Float32Array([0.8084872961044312, 0.07859973609447479, 0.5832412242889404, 0, 5.799292157604441e-9, 0.9910411834716797, -0.13355635106563568, 0, -0.5885136127471924, 0.10797861963510513, 0.8012441992759705, -0, -0.2617589235305786, -0.9007410407066345, -18.380844116210938, 1])

                var $mouseM: Matrix3D = new Matrix3D
                $mouseM.appendRotation(-(Scene_data.focus3D.rotationX + 45) / 10, Vector3D.X_AXIS);
                $mouseM.appendRotation(-Scene_data.focus3D.rotationY / 5, Vector3D.Y_AXIS);

                $view.prepend($mouseM);
                var $pos: Matrix3D = new Matrix3D
                $pos.m = new Float32Array([1.6897958517074585, 0, 0, 0, 0, 2.999999761581421, 0, 0, -0.0006377550889737904, 0.00045289855916053057, -1, -1, 0, 0, -0.6000000238418579, 0])
                var empteyM: Matrix3D = new Matrix3D()
                Matrix3D.mul(empteyM.m, $pos.m, $view.m)
                var $uModelViewProjectionMatrix: Matrix3D = empteyM.clone();
                var $disScale: number = Scene_data.cam3D.distance / 250
                $uModelViewProjectionMatrix.appendScale($disScale, $disScale, 1)
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uModelViewProjectionMatrix", $uModelViewProjectionMatrix.m);


                var $uSkyMatrix: Matrix3D = new Matrix3D();
                $uSkyMatrix.m = new Float32Array([-0.05148190259933472, 0, 0.9986739158630371, 0, 0, 1, 0, 0, -0.9986739158630371, 0, -0.05148190259933472, 0, 0, 0, 0, 1])
                Scene_data.context3D.setVcMatrix4fv(this.shader, "uSkyMatrix", $uSkyMatrix.m);

                var qv3d: Vector3D = this.mathCamPos($mouseM);
                qv3d = $uSkyMatrix.transformVector(qv3d)
                Scene_data.context3D.setuniform3f(this.shader, "uCameraPosition", qv3d.x, qv3d.y, qv3d.z);

                var $uDiffuseCoefficients: Float32Array = new Float32Array([0.14585700631141663, 0.1095229983329773, 0.11986599862575531, 0, 0.0817933976650238, 0.0785657986998558, 0.10676799714565277, 0, -0.012515299953520298, -0.0038914200849831104, -0.0024973100516945124, 0, 0.1110450029373169, 0.04512010142207146, 0.015141899697482586, 0, 0.03221319988369942, 0.014369400218129158, 0.007112869992852211, -0, -0.008236129768192768, -0.005531259812414646, -0.005950029939413071, -0, -0.00837332010269165, -0.0039273700676858425, -0.0023853699676692486, 0, -0.016801999881863594, -0.0022234099451452494, 0.002148869913071394, -0, 0.040785398334264755, 0.01346640009433031, -0.0013942799996584654, 0])
                Scene_data.context3D.setVc4fv(this.shader, "uDiffuseCoefficients", $uDiffuseCoefficients);

                this.setpointLineVf()

                */
                this.scale = 5;
                Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);
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
                Scene_data.context3D.drawCall(this.kkkDisplay3DSprite.objData.indexBuffer, this.kkkDisplay3DSprite.objData.treNum);
            }
        }
    };
    ProdkarenModelSprite.prototype.setpointLineVf = function () {
        var $positionBuffer = new Float32Array([24.273332595825195, 7.322669982910156, 8.924601554870605, 1, -15.372467041015625, 12.019000053405762, -7.449572563171387, 1, 20.754880905151367, 2.124569892883301, -0.09240173548460007, 1]);
        var $directionBuffer = new Float32Array([0.95980304479599, -0.020759006962180138, 0.2799057364463806, -0.5655789971351624, 0.5836562514305115, -0.5826369524002075, 0.9903820753097534, 5.353198773150325e-9, -0.1383596807718277]);
        var $colors = new Float32Array([12.207, 2.43907, 0.0734498, 3.04943, 2.27338, 3.54387, 1.03332, 3.84414, 4.25882]);
        var $parameters = new Float32Array([-1, 0, 0.0225928, -1, 0, 0.0225928, -1, 0, 0.0225928]);
        var $spot = new Float32Array([76.0396, 1, 2.63592, 96.8317, 1, 1.78738, 96.8317, 1, 1.78738]);
        Scene_data.context3D.setVc4fv(this.shader, "uLightPositions", $positionBuffer);
        Scene_data.context3D.setVc3fv(this.shader, "uLightDirections", $directionBuffer);
        Scene_data.context3D.setVc3fv(this.shader, "uLightColors", $colors);
        Scene_data.context3D.setVc3fv(this.shader, "uLightParams", $parameters);
        Scene_data.context3D.setVc3fv(this.shader, "uLightSpot", $spot);
        Scene_data.context3D.setVc2f(this.shader, "uShadowKernelRotation", 0.5, 0.5);
    };
    return ProdkarenModelSprite;
}(BaseDiplay3dSprite));
//# sourceMappingURL=ProdkarenModelSprite.js.map