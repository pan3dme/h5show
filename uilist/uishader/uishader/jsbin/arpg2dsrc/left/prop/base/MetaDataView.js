var prop;
(function (prop) {
    var MetaDataView = (function () {
        function MetaDataView() {
            this.creat(this.getView());
        }
        MetaDataView.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "环境光强:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
            ];
            return ary;
        };
        Object.defineProperty(MetaDataView.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        MetaDataView.prototype.creat = function (data) {
            this.ui = new Array;
            for (var i = 0; i < data.length; i++) {
                this.ui.push(this.creatComponent(data[i]));
            }
            this.addComponentView();
        };
        MetaDataView.prototype.addComponentView = function () {
            var ty = 350;
            for (var i = 0; i < this.ui.length; i++) {
                this.ui[i].y = ty;
                this.ui[i].x = 20;
                ty += this.ui[i].height;
            }
        };
        MetaDataView.prototype.creatComponent = function (obj) {
            var type = obj[prop.ReflectionData.Key_Type];
            if (type == prop.ReflectionData.NumberInput) {
                return this.getNumComponent(obj);
            }
            return null;
        };
        MetaDataView.prototype.getValue = function () {
            return 123;
        };
        MetaDataView.prototype.setValue = function (value) {
        };
        MetaDataView.prototype.getNumComponent = function ($obj) {
            var $textCtrlInput = new prop.TextCtrlInput();
            $textCtrlInput.label = $obj[prop.ReflectionData.Key_Label];
            $textCtrlInput.FunKey = $obj[prop.ReflectionData.FunKey];
            $textCtrlInput.target = this;
            return $textCtrlInput;
        };
        MetaDataView.prototype.refreshViewValue = function () {
            for (var i = 0; i < this.ui.length; i++) {
                this.ui[i].refreshViewValue();
            }
        };
        MetaDataView.prototype.destory = function () {
            while (this.ui.length) {
                var $ui = this.ui.pop();
                $ui.destory();
            }
        };
        return MetaDataView;
    })();
    prop.MetaDataView = MetaDataView;
})(prop || (prop = {}));
//# sourceMappingURL=MetaDataView.js.map