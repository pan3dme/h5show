module materialui {

    export class MathSinNodeUI extends MathStaticNodeUI {
        public constructor() {
            super();
            this.left = 600
            this.top = 300;

            this.nodeTree = new NodeTreeSin;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.SIN;
            this.initItem();
            this.drawTitleToFrame("正弦(sin)")



        }


    }
}