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
        public removeSunNode(nodeitem: NodeTreeInputItem): void {
            for (var i: number=0; i < this.sunNodeItems.length; i++) {
                if (this.sunNodeItems[i] == nodeitem) {
                    this.sunNodeItems.splice(i, 1);
                    break;
                }
            }
        }
    }

}