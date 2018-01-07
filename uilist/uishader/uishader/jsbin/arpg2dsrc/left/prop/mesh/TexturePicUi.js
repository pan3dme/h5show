var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var TexturePicIMeshVo = (function (_super) {
        __extends(TexturePicIMeshVo, _super);
        function TexturePicIMeshVo() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(TexturePicIMeshVo.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                this._url = value;
                this.needDraw = true;
            },
            enumerable: true,
            configurable: true
        });
        TexturePicIMeshVo.prototype.destory = function () {
            this.pos = null;
            this._url = null;
            this.needDraw = null;
            this.clear = true;
        };
        return TexturePicIMeshVo;
    })(bloodTittle.baseMeshVo);
    var TexturePicUIDisp2D = (function (_super) {
        __extends(TexturePicUIDisp2D, _super);
        function TexturePicUIDisp2D() {
            _super.apply(this, arguments);
            this.tempMatrix = new Matrix3D;
        }
        TexturePicUIDisp2D.prototype.makeData = function () {
            if (this._data) {
                this.labelNameMeshVo = this.data;
                this.ui.width = 64;
                this.ui.height = 64;
                this.lastKey = this.labelNameMeshVo.url;
                if (this.labelNameMeshVo.url) {
                    this.parent.uiAtlas.upDataPicToTexture(this.labelNameMeshVo.url, this.textureStr);
                }
                else {
                    // this.parent.uiAtlas.upDataPicToTexture("assets/base.jpg", this.textureStr);
                    this.parent.uiAtlas.clearCtxTextureBySkilname(this.textureStr);
                }
                this.labelNameMeshVo.needDraw = false;
            }
        };
        TexturePicUIDisp2D.prototype.update = function () {
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
        return TexturePicUIDisp2D;
    })(Disp2DBaseText);
    prop.TexturePicUIDisp2D = TexturePicUIDisp2D;
    var TexturePicUi = (function (_super) {
        __extends(TexturePicUi, _super);
        function TexturePicUi() {
            var _this = this;
            _super.call(this);
            this.$dulbelClikTm = 0;
            this._x = 0;
            this._y = 0;
            if (!TexturePicUi._dis2DUIContianer) {
                TexturePicUi._dis2DUIContianer = new Dis2DUIContianerPanel(TexturePicUIDisp2D, new Rectangle(0, 0, 64, 64), 2);
                TexturePicUi._dis2DUIContianer.left = 0;
                TexturePicUi._dis2DUIContianer.top = 0;
                TexturePicUi._dis2DUIContianer.layer = 999;
                UIManager.getInstance().addUIContainer(TexturePicUi._dis2DUIContianer);
                TimeUtil.addFrameTick(function (t) { _this.upFrame(t); });
            }
            this.textLabelUIMeshVo = this.getCharNameMeshVo();
            this.initView();
            this.resize();
        }
        TexturePicUi.prototype.destory = function () {
            this.textLabelUIMeshVo.clear = true;
        };
        TexturePicUi.prototype.initView = function () {
            this.textLabelUIMeshVo.url = "";
            this.addEvets();
        };
        TexturePicUi.prototype.addEvets = function () {
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
        };
        TexturePicUi.prototype.butClik = function (evt) {
            if (TimeUtil.getTimer() < this.$dulbelClikTm) {
                console.log("打开图片地址");
            }
            this.$dulbelClikTm = TimeUtil.getTimer() + 1000;
        };
        TexturePicUi.prototype.resize = function () {
            this.textLabelUIMeshVo.pos.x = this._x;
            this.textLabelUIMeshVo.pos.y = this._y;
        };
        TexturePicUi.prototype.upFrame = function (t) {
            TexturePicUi._dis2DUIContianer.update(t);
        };
        Object.defineProperty(TexturePicUi.prototype, "url", {
            get: function () {
                return "";
            },
            set: function (value) {
                this.textLabelUIMeshVo.url = value;
                console.log(value);
            },
            enumerable: true,
            configurable: true
        });
        TexturePicUi.prototype.getCharNameMeshVo = function (value) {
            if (value === void 0) { value = "测试名"; }
            var $vo = new TexturePicIMeshVo;
            $vo.pos = new Vector3D(0, 50, 0);
            $vo.textLabelUIDisp2D = TexturePicUi._dis2DUIContianer.showTemp($vo);
            return $vo;
        };
        Object.defineProperty(TexturePicUi.prototype, "x", {
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
        Object.defineProperty(TexturePicUi.prototype, "y", {
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
        return TexturePicUi;
    })(EventDispatcher);
    prop.TexturePicUi = TexturePicUi;
})(prop || (prop = {}));
//# sourceMappingURL=TexturePicUi.js.map