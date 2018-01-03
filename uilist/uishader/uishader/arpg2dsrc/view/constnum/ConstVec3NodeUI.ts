module materialui {

    export class ConstVec3NodeUI extends BaseMaterialNodeUI {

        private  outItem: ItemMaterialUI;

        private  outAItem: ItemMaterialUI;

        private  outRGBAItem: ItemMaterialUI;

        private  _constValue: Vector3D;

        protected  _bastTitleStr: String = "vec3"

        public constructor() {
            super();
       
            this.gap = 20;
            this.width = 162;
            this.height = 95;

            this._constValue = new Vector3D;

            this.initNodeTree();

            this.outItem = new ItemMaterialUI("out", MaterialItemType.VEC3, false);
            this.addItems(this.outItem);

            this. outAItem = new ItemMaterialUI("alpha", MaterialItemType.FLOAT, false);
            this.addItems(this.outAItem);

            this. outRGBAItem = new ItemMaterialUI("rgba", MaterialItemType.VEC4, false);
            this.addItems(this.outRGBAItem);


            this.drawTitleToFrame("vec3")
      
        }
        public  initNodeTree():void {
            this.nodeTree = new NodeTreeVec3;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.VEC3;
        }


    }
}