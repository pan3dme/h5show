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
            this.creat(this.getView());
        }
        BaseReflectionView.prototype.getView = function () {
            var ary = [
                { Type: left.ReflectionData.NumberInput, Label: "环境光强:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: left.ReflectionData.NumberInput, Label: "发现方向:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: left.ReflectionData.NumberInput, Label: "透明强度:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: left.ReflectionData.NumberInput, Label: "贴图:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" }
            ];
            return ary;
        };
        BaseReflectionView.prototype.creat = function (data) {
            this.ui = new Array;
            for (var i = 0; i < data.length; i++) {
                this.ui.push(this.creatComponent(data[i]));
            }
            this.addComponentView();
        };
        BaseReflectionView.prototype.addComponentView = function () {
            var ty = 350;
            for (var i = 0; i < this.ui.length; i++) {
                this.ui[i].y = ty;
                this.ui[i].x = 20;
                ty += this.ui[i].height;
            }
        };
        BaseReflectionView.prototype.creatComponent = function (obj) {
            var type = obj[left.ReflectionData.Key_Type];
            if (type == left.ReflectionData.NumberInput) {
                return this.getNumComponent(obj);
            }
            return null;
        };
        BaseReflectionView.prototype.getValue = function () {
            return 199;
        };
        BaseReflectionView.prototype.setValue = function (value) {
        };
        BaseReflectionView.prototype.getNumComponent = function ($obj) {
            var $textCtrlInput = new left.TextCtrlInput();
            $textCtrlInput.label = $obj[left.ReflectionData.Key_Label];
            $textCtrlInput.target = this;
            return $textCtrlInput;
        };
        return BaseReflectionView;
    })(UIPanel);
    left.BaseReflectionView = BaseReflectionView;
})(left || (left = {}));
//# sourceMappingURL=BaseReflectionView.js.map