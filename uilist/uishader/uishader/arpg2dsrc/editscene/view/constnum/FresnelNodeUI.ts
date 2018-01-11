module materialui {

    export class FresnelNodeUI extends BaseMaterialNodeUI {

        private  inItem: ItemMaterialUI;
        private  inAItem: ItemMaterialUI;
        private  inBItem: ItemMaterialUI;
        private  outItem: ItemMaterialUI;


        public constructor() {
            super();

            this.gap = 20;
            this.width = 162;
            this.height = 65;


            this.nodeTree = new NodeTreeFresnel;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.FRESNEL;


            this. outItem = new ItemMaterialUI("out", MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);

            this.inAItem = new ItemMaterialUI("scale", MaterialItemType.FLOAT, true);
            this.addItems(this.inAItem);

            this.inBItem = new ItemMaterialUI("add", MaterialItemType.FLOAT, true);
            this.addItems(this.inBItem);

            this.drawTitleToFrame("Fresnel")

        }
   

    }
}