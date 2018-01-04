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
                left.SceneRenderToTextrue.getInstance().renderToTexture([this.gridLineSprite, this.lightSpriteList]);
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
        return ModelShowModel;
    }());
    left.ModelShowModel = ModelShowModel;
})(left || (left = {}));
//# sourceMappingURL=ModelShowModel.js.map