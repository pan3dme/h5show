var prop;
(function (prop) {
    var BaseReflectionView = (function () {
        function BaseReflectionView() {
            this.creat(this.getView());
        }
        BaseReflectionView.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "环境光强:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: prop.ReflectionData.NumberInput, Label: "发现方向:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: prop.ReflectionData.NumberInput, Label: "透明强度:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
                { Type: prop.ReflectionData.NumberInput, Label: "贴图:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" }
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
            var type = obj[prop.ReflectionData.Key_Type];
            if (type == prop.ReflectionData.NumberInput) {
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
            var $textCtrlInput = new prop.TextCtrlInput();
            $textCtrlInput.label = $obj[prop.ReflectionData.Key_Label];
            $textCtrlInput.target = this;
            return $textCtrlInput;
        };
        return BaseReflectionView;
    })();
    prop.BaseReflectionView = BaseReflectionView;
})(prop || (prop = {}));
//# sourceMappingURL=BaseReflectionView.js.map