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
        public setData(obj: any): void {
            super.setData(obj);
            this.constValue = new Vector3D(obj.constValue.x, obj.constValue.y, obj.constValue.z, obj.constValue.w);
            (<NodeTreeVec3>this.nodeTree).constVec3 = this.constValue;
            this.showDynamic();
        }
        public  get constValue(): Vector3D {
            return this._constValue;
        }

        public  set constValue(value: Vector3D) {
            this._constValue = value;
            (<NodeTreeVec3>this.nodeTree).constVec3 = value;
            //_titleLabel.text = _bastTitleStr + "(" + getNumStr(value.x) + "," + getNumStr(value.y) + "," + getNumStr(value.z) + "," + getNumStr(value.w) + ")"
            this.showDynamic();
        }
          public  showDynamic(): void {
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("vec3<" + this.nodeTree.paramName + ">(" + this.getNumStr(this.constValue.x) + "," + this.getNumStr(this.constValue.y) + "," + this.getNumStr(this.constValue.z) + "," + this.getNumStr(this.constValue.w) + ")")
            } else {
                this.drawTitleToFrame("vec3(" + this.getNumStr(this.constValue.x) + "," + this.getNumStr(this.constValue.y) + "," + this.getNumStr(this.constValue.z) + "," + this.getNumStr(this.constValue.w) + ")")
            }
        }
        public getNumStr(num: number): string{
            var n: number = Math.floor(num * 100) / 100;
            return n.toString();
        }
    }
}