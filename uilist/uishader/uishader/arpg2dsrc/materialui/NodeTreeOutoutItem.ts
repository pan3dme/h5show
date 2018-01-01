module materialui {

    export class NodeTreeOutoutItem extends NodeTreeItem {
        public constructor() {
            super();
            this.sunNodeItems = new Array
            this.inoutType = NodeTreeItem.OUT;
        }
        public  sunNodeItems:Array<NodeTreeInputItem>;
        public  pushSunNode(nodeitem:NodeTreeInputItem):void{
            this.sunNodeItems.push(nodeitem);
        }
    }

}