var prop;
(function (prop) {
    var BaseReflComponent = /** @class */ (function () {
        function BaseReflComponent() {
            this._width = 1;
            this._height = 1;
            this._x = 0;
            this._y = 0;
            this.KeyStep = 1;
            this.width = 100;
            this.height = 100;
            this.initView();
        }
        Object.defineProperty(BaseReflComponent.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseReflComponent.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseReflComponent.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseReflComponent.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseReflComponent.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseReflComponent.prototype.setTarget = function (obj) {
            this.target = obj;
            this.refreshViewValue();
        };
        BaseReflComponent.prototype.refreshViewValue = function () {
        };
        BaseReflComponent.prototype.initView = function () {
        };
        BaseReflComponent.prototype.destory = function () {
        };
        return BaseReflComponent;
    }());
    prop.BaseReflComponent = BaseReflComponent;
})(prop || (prop = {}));
//# sourceMappingURL=BaseReflComponent.js.map