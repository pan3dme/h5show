var prop;
(function (prop) {
    var MetaDataView = /** @class */ (function () {
        function MetaDataView() {
            this._top = 350;
            this.creat(this.getView());
        }
        Object.defineProperty(MetaDataView.prototype, "top", {
            get: function () {
                return this._top;
            },
            set: function (value) {
                this._top = value;
                this.resize();
            },
            enumerable: true,
            configurable: true
        });
        MetaDataView.prototype.getView = function () {
            var ary = [];
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
            this.resize();
        };
        MetaDataView.prototype.resize = function () {
            var ty = this._top;
            for (var i = 0; this.ui && i < this.ui.length; i++) {
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
            if (type == prop.ReflectionData.Texturue2DUI) {
                return this.getTexturue2DUI(obj);
            }
            if (type == prop.ReflectionData.ComboBox) {
                return this.getComboBox(obj);
            }
            return null;
        };
        MetaDataView.prototype.getComboBox = function ($obj) {
            var $ComBoBoxCtrl2D = new prop.ComBoBoxCtrl2D();
            $ComBoBoxCtrl2D.label = $obj[prop.ReflectionData.Key_Label];
            $ComBoBoxCtrl2D.FunKey = $obj[prop.ReflectionData.FunKey];
            $ComBoBoxCtrl2D.data = $obj[prop.ReflectionData.Key_Data];
            $ComBoBoxCtrl2D.target = this;
            return $ComBoBoxCtrl2D;
        };
        MetaDataView.prototype.getTexturue2DUI = function ($obj) {
            var $texturue2DUI = new prop.Texturue2DUI();
            $texturue2DUI.label = $obj[prop.ReflectionData.Key_Label];
            $texturue2DUI.FunKey = $obj[prop.ReflectionData.FunKey];
            $texturue2DUI.target = this;
            return $texturue2DUI;
        };
        MetaDataView.prototype.getNumComponent = function ($obj) {
            var $textCtrlInput = new prop.TextCtrlInput();
            $textCtrlInput.label = $obj[prop.ReflectionData.Key_Label];
            $textCtrlInput.FunKey = $obj[prop.ReflectionData.FunKey];
            $textCtrlInput.KeyStep = $obj[prop.ReflectionData.Key_Step];
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
    }());
    prop.MetaDataView = MetaDataView;
})(prop || (prop = {}));
//# sourceMappingURL=MetaDataView.js.map