module materialui {

    export class MathStaticNodeUI extends BaseMaterialNodeUI {
        private  intItem: ItemMaterialUI;
        private  outItem: ItemMaterialUI;
        public constructor() {
            super();
            this.left = 600
            this.top = 300;


            this.gap = 20;
            this.width = 162;
            this.height = 80;

            this.resetBgSize()
        }
        protected initItem(): void {
            this.intItem = new ItemMaterialUI("in", MaterialItemType.FLOAT);
            this.outItem = new ItemMaterialUI("out", MaterialItemType.FLOAT, false);

            this.addItems(this.intItem);
            this.addItems(this.outItem);
        }


    }
}