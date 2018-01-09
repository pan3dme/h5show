var left;
(function (left) {
    var ModelShowModel = /** @class */ (function () {
        function ModelShowModel() {
        }
        ModelShowModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new ModelShowModel();
            }
            return this._instance;
        };
        ModelShowModel.prototype.addBaseModel = function () {
            var _this = this;
            Scene_data.cam3D.distance = 150;
            this.addGridLineSprite();
            TimeUtil.addFrameTick(function (t) { _this.update(t); });
        };
        ModelShowModel.prototype.update = function (t) {
            if (this._bigPic && this._bigPic.textureRes) {
                left.SceneRenderToTextrue.getInstance().renderToTexture([this.lightSpriteList]);
                if (left.SceneRenderToTextrue.getInstance().fbo) {
                    this._bigPic.textureRes.texture = left.SceneRenderToTextrue.getInstance().fbo.texture;
                }
            }
        };
        ModelShowModel.prototype.addGridLineSprite = function () {
            ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
            this.gridLineSprite = new GridLineSprite();
            this.lightSpriteList = new left.MaterialModelSprite();
        };
        ModelShowModel.prototype.outShaderStr = function ($materialTree) {
            var $str = $materialTree.shaderStr;
            //  console.log($materialTree.constList)
            //  console.log($materialTree.texList)
            var $material = this.lightSpriteList.material;
            var $buildMaterialShader = new left.BuildMaterialShader();
            console.log(this.lightSpriteList.material.shader.fragment);
            console.log("-----------");
            console.log($str);
            console.log("+++++++++++++");
            $buildMaterialShader.buildParamAry($materialTree);
            $buildMaterialShader.vertex = $buildMaterialShader.getVertexShaderString();
            $buildMaterialShader.fragment = $str;
            $buildMaterialShader.encode();
            this.lightSpriteList.material.shader = $buildMaterialShader;
            $material.program = $material.shader.program;
            this.lightSpriteList.material.fcData = $materialTree.fcData;
            /*
            $material.shader.fragment = $str;
            this.lightSpriteList.material.shader.encode();
            $material.program = $material.shader.program;
   */
        };
        ModelShowModel.prototype.getMaterialProgram = function (key, shaderCls, $material, paramAry, parmaByFragmet) {
            if (paramAry === void 0) { paramAry = null; }
            if (parmaByFragmet === void 0) { parmaByFragmet = false; }
            var keyStr = key + "_" + $material.url;
            if (paramAry) {
                for (var i = 0; i < paramAry.length; i++) {
                    keyStr += "_" + paramAry[i];
                }
                if (parmaByFragmet) {
                    keyStr += "true_";
                }
                else {
                    keyStr += "false_";
                }
            }
            if (parmaByFragmet) {
                paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                    $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                    $material.noLight, $material.fogMode];
            }
            var shader = new MaterialShader();
            shader.paramAry = paramAry;
            shader.fragment = $material.shaderStr;
            var encodetf = shader.encode();
            shader.useNum++;
            return shader;
        };
        return ModelShowModel;
    }());
    left.ModelShowModel = ModelShowModel;
})(left || (left = {}));
//# sourceMappingURL=ModelShowModel.js.map