module materialui {

    export class MathMulNodeUI extends MathDynamicNodeUI {
        public constructor() {
            super();
            this.left = 600
            this.top = 300;



            this.nodeTree = new NodeTreeMul;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.MUL;
            this.initItem();
            this.drawTitleToFrame("乘法(Mul*)")

        }


    }
}