module materialui {

    export class ConstFloatNodeUI extends BaseMaterialNodeUI {

        private  outItem: ItemMaterialUI;

        private _constValue: number;


        public constructor() {
            super();

            this.gap = 20;
            this.width = 162;
            this.height = 65;

           this. _constValue = 0;

            this.nodeTree = new NodeTreeFloat;
            this. nodeTree.ui = this;
            this. nodeTree.type = NodeTree.FLOAT;

            this.outItem = new ItemMaterialUI("out", MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);

  

            this.drawTitleToFrame("float")

        }
 

    }
}