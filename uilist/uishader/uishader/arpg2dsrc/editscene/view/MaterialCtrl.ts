module materialui {

    export class MaterialCtrl {
        private static _instance: MaterialCtrl;
        public static getInstance(): MaterialCtrl {
            if (!this._instance) {
                this._instance = new MaterialCtrl();
            }
            return this._instance;
        }
        public constructor() {
            this.initData();
        }
        public initData(): void {

            this.nodeList = new Array;
            this.uiList = new Array;
            this._materialTree = new MaterialTree;
        }
        private  _materialTree: MaterialTree;
        private uiList: Array<BaseMaterialNodeUI>;
        public  nodeList: Array<NodeTree>;
        public  addNodeUI(ui: BaseMaterialNodeUI):void {
            var node: NodeTree = ui.nodeTree;
            if(node.id == -1) {
                if (this.nodeList.length) {
                    node.id = this.nodeList[this.nodeList.length - 1].id + 1;
                } else {
                    node.id = 0;
                }
            }
			this.nodeList.push(node);
            this.uiList.push(ui);
            UIManager.getInstance().addUIContainer(ui);
        }
        public getObj(): Object {
            var ary: Array<any> = new Array;
            for (var i: number = 0; i < this.uiList.length; i++) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>this.uiList[i];
                if ($temp) {
                    var obj: Object = $temp.getObj();
                    ary.push(obj);
                }
            }
            return ary;
        }
    }
}