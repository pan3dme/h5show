module materialui {

    export class MathAddNodeUI extends MathDynamicNodeUI{
        public constructor() {
            super();
            this.left = 600
            this.top = 300;

            this.nodeTree = new NodeTreeAdd;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.ADD;
            this.initItem();

            this.drawTitleToFrame("加法(Add+)")
      
        }


    }
}