module materialui {

    export class TextureSampleNodeUI extends BaseMaterialNodeUI {
        private  uvItem:ItemMaterialUI;
        private  rgbItem:ItemMaterialUI;
        private  rItem:ItemMaterialUI;
        private  gItem:ItemMaterialUI;
        private  bItem:ItemMaterialUI;
        private  aItem:ItemMaterialUI;
        private rgbaItem: ItemMaterialUI;


        private _wrap: number//0 reapte,1 clamp
        private _mipmap: number;// 0=disable、1=nearest、2=linear
        private _filter: number;// 0=linear1=nearest、
        private _permul: boolean;

        private a_texture_pic_frame: FrameCompenent

        public constructor() {
            super();
            this.name = "TextureSampleNodeUI" + random(9999999);
            this.left = 400
            this.top = 100;

            this.nodeTree = new NodeTreeTex;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.TEX;

            this.width = 162;
            this.height = 140;

            this.initItem();

            this.resetBgSize()
            this.drawTitleToFrame("纹理采样")

            this.a_texture_pic_frame = this.getTexturePicUi();
            this.a_texture_pic_frame.x = 20;
            this.a_texture_pic_frame.y = 55;

      
        }
        private drawFrontToFrame($ui: FrameCompenent, $url: string): void {


            LoadManager.getInstance().load(Scene_data.fileRoot + $url, LoadManager.IMG_TYPE,
                ($img: any) => {
                    var $toRect: Rectangle = $ui.getSkinCtxRect()
                    var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
                    $ctx.drawImage($img, 0, 0, $img.width, $img.height);
                    $ui.drawToCtx(this._topRender.uiAtlas, $ctx)
                });


        }
        private static texture_pic_frame_ID=0
        private getTexturePicUi(): FrameCompenent {
            var $ui: FrameCompenent = <FrameCompenent>this.addEvntBut("a_texture_pic_frame", this._topRender);
            $ui.goToAndStop(TextureSampleNodeUI.texture_pic_frame_ID++);
            return $ui;
        }
        private initItem(): void {

            this.uvItem = new ItemMaterialUI("UV", MaterialItemType.VEC2);
            this.rgbItem = new ItemMaterialUI("rgb", MaterialItemType.VEC3, false);
            this.rItem = new ItemMaterialUI("r", MaterialItemType.FLOAT, false);
            this.gItem = new ItemMaterialUI("g", MaterialItemType.FLOAT, false);
            this.bItem = new ItemMaterialUI("b", MaterialItemType.FLOAT, false);
            this.aItem = new ItemMaterialUI("a", MaterialItemType.FLOAT, false);
            this.rgbaItem = new ItemMaterialUI("rgba", MaterialItemType.VEC4, false);

            this.addItems(this.uvItem);
            this.addItems(this.rgbItem);
            this.addItems(this.rItem);
            this.addItems(this.gItem);
            this.addItems(this.bItem);
            this.addItems(this.aItem);
            this.addItems(this.rgbaItem);
        }
        
        public setData(obj: any): void {
            super.setData(obj);
            obj.url = String(obj.url).replace(Scene_data.fileRoot, "");//兼容原来相对路径
            //addBitmpUrl(obj.url);
            (<NodeTreeTex>this.nodeTree).url = obj.url;
            this.isMain = obj.isMain;
            this.wrap = obj.wrap;
            this.mipmap = obj.mipmap;
            this.filter = obj.filter;
            this.permul = obj.permul;

            this.drawFrontToFrame(this.a_texture_pic_frame, (<NodeTreeTex>this.nodeTree).url)
            this. showDynamic();
        }
        public get wrap(): number {
            return this._wrap;
        }
        public get mipmap(): number {
            return this._mipmap;
        }

        public get filter(): number {
            return this._filter;
        }
        public  get permul(): boolean {
            return this._permul;
        }

        public set permul(value: boolean) {
            this._permul = value;
            (<NodeTreeTex>this.nodeTree).permul = value;
        }
        public set filter(value: number) {
            this._filter = value;
            (<NodeTreeTex>this.nodeTree).filter = value;
        }

        public set mipmap(value: number) {
            this._mipmap = value;
            (<NodeTreeTex>this.nodeTree).mipmap = value;
        }

        public set wrap(value: number) {
            this._wrap = value;
            (<NodeTreeTex>this.nodeTree).wrap = value;
        }
        public  set isMain(value: boolean) {
            (<NodeTreeTex>this.nodeTree).isMain = value;
            if (value) {
              //  _mainTxt.text = "M";
            } else {
              //  _mainTxt.text = "";
            }
        }
         public  showDynamic(): void {
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("纹理采样<" + this.nodeTree.paramName + ">");
            } else {
                this.drawTitleToFrame("纹理采样");
            }
        }
    }
} 