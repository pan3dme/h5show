module prop {
    class TexturePicIMeshVo extends bloodTittle.baseMeshVo {
        private _url: string;
        public needDraw: boolean;
        public set url(value: string) {
            this._url = value;
            this.needDraw = true;
        }
        public get url(): string {
            return this._url;
        }
        public set imagepic(img: any) {
            var rec: UIRectangle = this.textLabelUIDisp2D.parent.uiAtlas.getRec(this.textLabelUIDisp2D.ui.skinName);
            var $ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            $ctx.clearRect(0, 0, rec.pixelWitdh, rec.pixelHeight)
            $ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, rec.pixelWitdh, rec.pixelHeight)
            TextureManager.getInstance().updateTexture(this.textLabelUIDisp2D.parent.uiAtlas.texture, rec.pixelX, rec.pixelY, $ctx);
        }
        public destory(): void {
            this.pos = null;
            this._url = null;
            this.needDraw = null;
            this.clear = true
        }
        public textLabelUIDisp2D: TexturePicUIDisp2D
    }
    export class TexturePicUIDisp2D extends Disp2DBaseText {
        private labelNameMeshVo: TexturePicIMeshVo
        public makeData(): void {
            if (this._data) {
                this.labelNameMeshVo = <TexturePicIMeshVo>this.data;
                this.ui.width = 64;
                this.ui.height = 64
                this.lastKey = this.labelNameMeshVo.url
                if (this.labelNameMeshVo.url) {
                    var $img: any = TextureManager.getInstance().getImgResByurl(Scene_data.fileRoot + this.labelNameMeshVo.url)
                    if ($img) {
                        var rec: UIRectangle = this.parent.uiAtlas.getRec(this.textureStr);
                        this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
                        this.parent.uiAtlas.ctx.drawImage($img, 0, 0, rec.pixelWitdh, rec.pixelHeight);
                        TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, rec.pixelX, rec.pixelY, this.parent.uiAtlas.ctx);
                    } else {
                        this.parent.uiAtlas.upDataPicToTexture(this.labelNameMeshVo.url, this.textureStr);
                    }
                } else {
                    this.parent.uiAtlas.clearCtxTextureBySkilname(this.textureStr)
                }
                this.labelNameMeshVo.needDraw = false;
            }
        }
        private tempMatrix: Matrix3D = new Matrix3D;
        public update(): void {
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
                    } else {
                        this.ui.x = 10000
                    }
                }
                if (this.labelNameMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        }
    }


    export class TexturePicUi extends EventDispatcher {
        private static _dis2DUIContianer: Dis2DUIContianerPanel
        public constructor() {
            super();
            if (!TexturePicUi._dis2DUIContianer) {
                TexturePicUi._dis2DUIContianer = new Dis2DUIContianerPanel(TexturePicUIDisp2D, new Rectangle(0, 0, 64, 64), 2);
                TexturePicUi._dis2DUIContianer.left = 0;
                TexturePicUi._dis2DUIContianer.top = 0;
                TexturePicUi._dis2DUIContianer.layer = 999;
                UIManager.getInstance().addUIContainer(TexturePicUi._dis2DUIContianer);
                TimeUtil.addFrameTick((t: number) => { this.upFrame(t) });

            }
            this.textLabelUIMeshVo = this.getCharNameMeshVo();

            this.initView();
            this.resize();
        }
        public destory(): void {
            this.textLabelUIMeshVo.clear = true

            var $ui: UICompenent = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.removeEventListener(InteractiveEvent.Down, this.butClik, this);
        }
        protected initView(): void {
            this.textLabelUIMeshVo.url = "";
            this.addEvets()
        }
        private addEvets(): void {
            var $ui: UICompenent = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
        }
        private $dulbelClikTm: number = 0;
        private _inputHtmlSprite: HTMLInputElement
        protected butClik(evt: InteractiveEvent): void {
            console.log(TimeUtil.getTimer() , this.$dulbelClikTm)
            if (TimeUtil.getTimer() < this.$dulbelClikTm) {
                this._inputHtmlSprite = <HTMLInputElement>document.createElement('input');
                this._inputHtmlSprite.setAttribute('id', '_ef');
                this._inputHtmlSprite.setAttribute('type', 'file');
                this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
                this._inputHtmlSprite.click();
                this._inputHtmlSprite.value;
                this._inputHtmlSprite.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
            }
            this.$dulbelClikTm = TimeUtil.getTimer() + 1000
         
        }
        private changeFile(evt: any): void {
            for (var i: number = 0; i < this._inputHtmlSprite.files.length&&i<1; i++) {
                var simpleFile = this._inputHtmlSprite.files[i]
                if (!/image\/\w+/.test(simpleFile.type)) {
                    alert("请确保文件类型为图像类型");
                }
                var $reflectionEvet: ReflectionEvet = new ReflectionEvet(ReflectionEvet.CHANGE_DATA)
                $reflectionEvet.data = simpleFile
                this.dispatchEvent($reflectionEvet);
            }
            this._inputHtmlSprite = null;
        }
        private resize(): void {
            this.textLabelUIMeshVo.pos.x = this._x;
            this.textLabelUIMeshVo.pos.y = this._y;
        }
        private upFrame(t: number): void {
            TexturePicUi._dis2DUIContianer.update(t);
        }
        public get url(): string {
            return this.textLabelUIMeshVo.url;
        }
        public set url(value: string) {
            this.textLabelUIMeshVo.url = value;
        }
        protected textLabelUIMeshVo: TexturePicIMeshVo
        public getCharNameMeshVo(value: string = "测试名"): TexturePicIMeshVo {
            var $vo: TexturePicIMeshVo = new TexturePicIMeshVo;
            $vo.pos = new Vector3D(0, 50, 0);
            $vo.textLabelUIDisp2D = <TexturePicUIDisp2D>TexturePicUi._dis2DUIContianer.showTemp($vo);
            return $vo;
        }
        private _x: number = 0
        private _y: number = 0;
        public set x(value: number) {
            this._x = value;
            this.resize()
        }
        public get x(): number {
            return this._x
        }

        public set y(value: number) {
            this._y = value;
            this.resize()
        }
        public get y(): number {
            return this._y
        }

    }
} 