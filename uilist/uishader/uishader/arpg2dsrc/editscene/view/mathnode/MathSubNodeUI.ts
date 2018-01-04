module materialui {

    export class MathSubNodeUI extends MathDynamicNodeUI {
        public constructor() {
            super();
            this.left = 600
            this.top = 300;



            this.nodeTree = new NodeTreeSub;
            this. nodeTree.ui = this;
            this. nodeTree.type = NodeTree.SUB;
            this.initItem();
            this.drawTitleToFrame("减法(Sub-)")

        }


    }
}