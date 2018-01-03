module materialui {

    export class ConstVec2NodeUI extends BaseMaterialNodeUI {

        private  outItem: ItemMaterialUI;

        private  _constValue: Vector2D;

        public constructor() {
            super();

            this.gap = 20;
            this.width = 162;
            this.height = 95;

            this.gap = 20;
            this.width = 162;
            this.height = 65;

            this._constValue = new Vector2D;

            this.nodeTree = new NodeTreeVec2;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.VEC2;

            this.outItem = new ItemMaterialUI("out", MaterialItemType.VEC2, false);
            this.addItems(this.outItem);

            this.drawTitleToFrame("vec2")

        }


    }
}