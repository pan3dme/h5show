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
    var TexturePicIMeshVo = /** @class */ (function (_super) {
        __extends(TexturePicIMeshVo, _super);
        function TexturePicIMeshVo() {
            return _super !== null && _super.apply(this, arguments) || this;
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
        Object.defineProperty(TexturePicIMeshVo.prototype, "imagepic", {
            set: function (img) {
                var rec = this.textLabelUIDisp2D.parent.uiAtlas.getRec(this.textLabelUIDisp2D.ui.skinName);
                var $ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
                $ctx.clearRect(0, 0, rec.pixelWitdh, rec.pixelHeight);
                $ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, rec.pixelWitdh, rec.pixelHeight);
                TextureManager.getInstance().updateTexture(this.textLabelUIDisp2D.parent.uiAtlas.texture, rec.pixelX, rec.pixelY, $ctx);
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
    }(bloodTittle.baseMeshVo));
    var TexturePicUIDisp2D = /** @class */ (function (_super) {
        __extends(TexturePicUIDisp2D, _super);
        function TexturePicUIDisp2D() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tempMatrix = new Matrix3D;
            return _this;
        }
        TexturePicUIDisp2D.prototype.makeData = function () {
            if (this._data) {
                this.labelNameMeshVo = this.data;
                this.ui.width = 64;
                this.ui.height = 64;
                this.lastKey = this.labelNameMeshVo.url;
                if (this.labelNameMeshVo.url) {
                    var $img = TextureManager.getInstance().getImgResByurl(Scene_data.fileRoot + this.labelNameMeshVo.url);
                    if ($img) {
                        var rec = this.parent.uiAtlas.getRec(this.textureStr);
                        this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
                        this.parent.uiAtlas.ctx.drawImage($img, 0, 0, rec.pixelWitdh, rec.pixelHeight);
                        TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, rec.pixelX, rec.pixelY, this.parent.uiAtlas.ctx);
                    }
                    else {
                        this.parent.uiAtlas.upDataPicToTexture(this.labelNameMeshVo.url, this.textureStr);
                    }
                }
                else {
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
    }(Disp2DBaseText));
    prop.TexturePicUIDisp2D = TexturePicUIDisp2D;
    var TexturePicUi = /** @class */ (function (_super) {
        __extends(TexturePicUi, _super);
        function TexturePicUi() {
            var _this = _super.call(this) || this;
            _this.$dulbelClikTm = 0;
            _this._x = 0;
            _this._y = 0;
            if (!TexturePicUi._dis2DUIContianer) {
                TexturePicUi._dis2DUIContianer = new Dis2DUIContianerPanel(TexturePicUIDisp2D, new Rectangle(0, 0, 64, 64), 2);
                TexturePicUi._dis2DUIContianer.left = 0;
                TexturePicUi._dis2DUIContianer.top = 0;
                TexturePicUi._dis2DUIContianer.layer = 999;
                UIManager.getInstance().addUIContainer(TexturePicUi._dis2DUIContianer);
                TimeUtil.addFrameTick(function (t) { _this.upFrame(t); });
            }
            _this.textLabelUIMeshVo = _this.getCharNameMeshVo();
            _this.initView();
            _this.resize();
            return _this;
        }
        TexturePicUi.prototype.destory = function () {
            this.textLabelUIMeshVo.clear = true;
            var $ui = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.removeEventListener(InteractiveEvent.Down, this.butClik, this);
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
            var _this = this;
            console.log(TimeUtil.getTimer(), this.$dulbelClikTm);
            if (TimeUtil.getTimer() < this.$dulbelClikTm) {
                this._inputHtmlSprite = document.createElement('input');
                this._inputHtmlSprite.setAttribute('id', '_ef');
                this._inputHtmlSprite.setAttribute('type', 'file');
                this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
                this._inputHtmlSprite.click();
                this._inputHtmlSprite.value;
                this._inputHtmlSprite.addEventListener("change", function (cevt) { _this.changeFile(cevt); });
            }
            this.$dulbelClikTm = TimeUtil.getTimer() + 1000;
        };
        TexturePicUi.prototype.changeFile = function (evt) {
            for (var i = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile = this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    alert("请确保文件类型为图像类型");
                }
                var $reflectionEvet = new prop.ReflectionEvet(prop.ReflectionEvet.CHANGE_DATA);
                $reflectionEvet.data = simpleFile;
                this.dispatchEvent($reflectionEvet);
            }
            this._inputHtmlSprite = null;
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
                return this.textLabelUIMeshVo.url;
            },
            set: function (value) {
                this.textLabelUIMeshVo.url = value;
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
    }(EventDispatcher));
    prop.TexturePicUi = TexturePicUi;
})(prop || (prop = {}));
//# sourceMappingURL=TexturePicUi.js.map