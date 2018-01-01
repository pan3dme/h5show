module materialui {

    export class NodeTreeInputItem extends NodeTreeItem {
        private  _parentNodeItem:NodeTreeOutoutItem;
        public  hasCompiled:boolean;
        public constructor() {
            super();
        }
        public  set parentNodeItem(value: NodeTreeOutoutItem) {
           this. _parentNodeItem = value;
        }
        public  get parentNodeItem(): NodeTreeOutoutItem {
            return this._parentNodeItem;
        }

   
    }

}