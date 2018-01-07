var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var left;
(function (left) {
    var BaseReflectionView = (function (_super) {
        __extends(BaseReflectionView, _super);
        function BaseReflectionView() {
            _super.call(this);
            this.layer = 100;
            this.left = 0;
            this.top = 0;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this.loadConfigCom();
        }
        BaseReflectionView.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = BaseReflectionView.propUIAtlas;
            this._midRender.uiAtlas = BaseReflectionView.propUIAtlas;
            this._topRender.uiAtlas = BaseReflectionView.propUIAtlas;
            this.addChild(this._bottomRender.getComponent("a_pic"));
            this.addChild(this._bottomRender.getComponent("a_label"));
            this.addChild(this._bottomRender.getComponent("a_select"));
            this.resize();
        };
        return BaseReflectionView;
    })(UIPanel);
    left.BaseReflectionView = BaseReflectionView;
})(left || (left = {}));
//# sourceMappingURL=BasePropView.js.map