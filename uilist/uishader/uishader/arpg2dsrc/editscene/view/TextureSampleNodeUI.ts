module materialui {

    export class TextureSampleNodeUI extends BaseMaterialNodeUI {
        private  uvItem:ItemMaterialUI;
        private  rgbItem:ItemMaterialUI;
        private  rItem:ItemMaterialUI;
        private  gItem:ItemMaterialUI;
        private  bItem:ItemMaterialUI;
        private  aItem:ItemMaterialUI;
        private  rgbaItem:ItemMaterialUI;

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
        
   
    }
} 