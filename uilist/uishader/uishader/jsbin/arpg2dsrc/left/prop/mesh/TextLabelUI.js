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
var prop;
(function (prop) {
    var TextLabelUIMeshVo = /** @class */ (function (_super) {
        __extends(TextLabelUIMeshVo, _super);
        function TextLabelUIMeshVo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(TextLabelUIMeshVo.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
                this.needDraw = true;
            },
            enumerable: true,
            configurable: true
        });
        TextLabelUIMeshVo.prototype.destory = function () {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true;
        };
        return TextLabelUIMeshVo;
    }(bloodTittle.baseMeshVo));
    var TextLabelUIDisp2D = /** @class */ (function (_super) {
        __extends(TextLabelUIDisp2D, _super);
        function TextLabelUIDisp2D() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tempMatrix = new Matrix3D;
            return _this;
        }
        TextLabelUIDisp2D.prototype.makeData = function () {
            if (this._data) {
                this.labelNameMeshVo = this.data;
                if (this.lastKey != this.labelNameMeshVo.name) {
                    this.ui.width = 128 * 0.7;
                    this.ui.height = 22 * 0.7;
                    this.lastKey = this.labelNameMeshVo.name;
                    LabelTextFont.writeSingleLabel(this.parent.uiAtlas, this.textureStr, this.labelNameMeshVo.name, 20, TextAlign.LEFT, "#ffffff", "#27262e");
                }
                this.labelNameMeshVo.needDraw = false;
            }
        };
        TextLabelUIDisp2D.prototype.update = function () {
            if (this.labelNameMeshVo) {
                if (this.labelNameMeshVo.needDraw) {
                    this.makeData();
                }
                if (this.labelNameMeshVo.pos) {
                    if (this.labelNameMeshVo.visible) {
                        if (this.needUpData(this.labelNameMeshVo.pos) || this.labelNameMeshVo.visibleChange) {
                            this.ui.x = this.labelNameMeshVo.pos.x;
                            this.ui.y = this.labelNameMeshVo.pos.y;
                            this.oldPos.x = this.labelNameMeshVo.pos.x;
                            this.oldPos.y = this.labelNameMeshVo.pos.y;
                            this.labelNameMeshVo.visibleChange = false;
                        }
                    }
                    else {
                        this.ui.x = 10000;
                    }
                }
                if (this.labelNameMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        };
        return TextLabelUIDisp2D;
    }(Disp2DBaseText));
    prop.TextLabelUIDisp2D = TextLabelUIDisp2D;
    var TextLabelUI = /** @class */ (function (_super) {
        __extends(TextLabelUI, _super);
        function TextLabelUI() {
            var _this = _super.call(this) || this;
            _this._x = 0;
            _this._y = 0;
            if (!TextLabelUI._dis2DUIContianer) {
                TextLabelUI._dis2DUIContianer = new Dis2DUIContianerPanel(TextLabelUIDisp2D, new Rectangle(0, 0, 128, 24), 50);
                TextLabelUI._dis2DUIContianer.left = 0;
                TextLabelUI._dis2DUIContianer.top = 0;
                TextLabelUI._dis2DUIContianer.layer = 999;
                UIManager.getInstance().addUIContainer(TextLabelUI._dis2DUIContianer);
                TimeUtil.addFrameTick(function (t) { _this.upFrame(t); });
            }
            _this.textLabelUIMeshVo = _this.getCharNameMeshVo();
            _this.initView();
            _this.resize();
            return _this;
        }
        TextLabelUI.prototype.destory = function () {
            this.textLabelUIMeshVo.clear = true;
        };
        TextLabelUI.prototype.initView = function () {
            this.textLabelUIMeshVo.name = "Vec3:";
        };
        TextLabelUI.prototype.resize = function () {
            this.textLabelUIMeshVo.pos.x = this._x;
            this.textLabelUIMeshVo.pos.y = this._y;
        };
        TextLabelUI.prototype.upFrame = function (t) {
            TextLabelUI._dis2DUIContianer.update(t);
        };
        Object.defineProperty(TextLabelUI.prototype, "label", {
            get: function () {
                return "";
            },
            set: function (value) {
                this.textLabelUIMeshVo.name = value;
            },
            enumerable: true,
            configurable: true
        });
        TextLabelUI.prototype.getCharNameMeshVo = function (value) {
            if (value === void 0) { value = "测试名"; }
            var $vo = new TextLabelUIMeshVo;
            $vo.name = value;
            $vo.pos = new Vector3D(0, 50, 0);
            $vo.textLabelUIDisp2D = TextLabelUI._dis2DUIContianer.showTemp($vo);
            return $vo;
        };
        Object.defineProperty(TextLabelUI.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.resize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextLabelUI.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.resize();
            },
            enumerable: true,
            configurable: true
        });
        return TextLabelUI;
    }(EventDispatcher));
    prop.TextLabelUI = TextLabelUI;
})(prop || (prop = {}));
//# sourceMappingURL=TextLabelUI.js.map