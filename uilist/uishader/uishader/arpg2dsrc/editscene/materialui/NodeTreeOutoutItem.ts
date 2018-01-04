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
        public getObj(): Object {
            var obj: any = super.getObj();
            var ary: Array<any> = new Array;
            for (var i: number=0; i < this.sunNodeItems.length; i++) {
                ary.push(this.sunNodeItems[i].otherNeedObj());
            }
            obj.sunObj = ary;
            return obj;
        }
    }

}