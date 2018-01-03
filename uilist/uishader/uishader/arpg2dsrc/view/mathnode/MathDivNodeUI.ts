module materialui {

    export class MathDivNodeUI extends MathDynamicNodeUI {
        public constructor() {
            super();
            this.left = 600
            this.top = 300;



            this.nodeTree = new NodeTreeDiv;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.DIV;
            this.initItem();
            this.drawTitleToFrame("除法(Div/)")

        }


    }
}