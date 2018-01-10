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
        ModelShowModel.prototype.outShaderStr = function ($treeMater) {
            var $str = $treeMater.shaderStr;
            var $material = this.lightSpriteList.material;
            var $buildMaterialShader = new left.BuildMaterialShader();
            $buildMaterialShader.buildParamAry($treeMater);
            $buildMaterialShader.vertex = $buildMaterialShader.getVertexShaderString();
            $buildMaterialShader.fragment = $str;
            console.log($buildMaterialShader.vertex);
            console.log("-----------");
            console.log($buildMaterialShader.fragment);
            console.log("+++++++++++++");
            $buildMaterialShader.encode();
            this.lightSpriteList.material.shader = $buildMaterialShader;
            this.lightSpriteList.material.program = $buildMaterialShader.program;
            this.lightSpriteList.material.fcData = $treeMater.fcData;
            this.lightSpriteList.material.texList = $treeMater.texList;
            this.lightSpriteList.material.usePbr = $treeMater.usePbr;
            this.lightSpriteList.material.hasTime = $treeMater.hasTime;
            this.lightSpriteList.material.hasVertexColor = $treeMater.hasVertexColor;
            this.lightSpriteList.material.usePbr = $treeMater.usePbr;
            this.lightSpriteList.material.useNormal = $treeMater.useNormal;
            this.lightSpriteList.material.roughness = $treeMater.roughness;
            this.lightSpriteList.material.hasFresnel = $treeMater.hasFresnel;
            this.lightSpriteList.material.useDynamicIBL = $treeMater.useDynamicIBL;
            this.lightSpriteList.material.lightProbe = $treeMater.lightProbe;
            this.lightSpriteList.material.useKill = $treeMater.useKill;
            this.lightSpriteList.material.directLight = $treeMater.directLight;
            this.lightSpriteList.material.noLight = $treeMater.noLight;
            this.lightSpriteList.material.fogMode = $treeMater.fogMode;
            this.lightSpriteList.material.scaleLightMap = $treeMater.scaleLightMap;
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