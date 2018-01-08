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
        public setData(obj: any): void {
            super.setData(obj);
            this.constValue = obj.constValue;
            (<NodeTreeFloat>this.nodeTree).constValue = this.constValue;
           this. showDynamic();
        }
        public get constValue(): number {
            return this._constValue;
        }
  
        public set constValue(value: number) {
            this._constValue = value;
            (<NodeTreeFloat>this.nodeTree).constValue = value;
           this. showDynamic();
        }
         public  showDynamic(): void {
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("float<" + this.nodeTree.paramName + ">(" +this.getNumStr(this._constValue) + ")");
            } else {
                this.drawTitleToFrame("float(" + this.getNumStr(this._constValue )+ ")");
            }
        }
        public getNumStr(num: number): string {
            var n: number = Math.floor(num * 100) / 100;
            return n.toString();
        }
    }
}