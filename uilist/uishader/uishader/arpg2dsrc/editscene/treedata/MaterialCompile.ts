module materialui {

    export class MaterialCompile {
        private static _instance: MaterialCompile;
        public static getInstance(): MaterialCompile {
            if (!this._instance) {
                this._instance = new MaterialCompile();
            }
            return this._instance;
        }
        public nodeList: Array<NodeTree>;

        public priorityList: Array<Array<NodeTree>>;

        public maxPriority: number=0;

        private fragmentTempList: Array<RegisterItem>;
        private fragmentTexList: Array<RegisterItem>;
        private fragmentConstList: Array<RegisterItem>;


        private _compileGlslServer: CompileTwo 
        public compile($list: Array<NodeTree>, $materialTree: MaterialTree): void {
            this._compileGlslServer=new CompileTwo
           this. nodeList = $list;
            this.resetCompile($list);
            this. resetPriority();
            var opNode: NodeTree = this.getOpNode();
            opNode.priority = 0;
            this.setPriority(opNode);
            this.priorityList = new Array
            for (var i: number = 0; i <= this.maxPriority; i++) {
                this.priorityList.push(new Array);
            }
            for (i = 0; i < this.nodeList.length; i++) {
                if (this.nodeList[i].priority < 0) {
                    continue;
                }
                if (!this.nodeList[i].checkInput()) {
                    console.log(this.nodeList[i])
                    alert("不完整的输入" + this.nodeList[i].type);
                    return;
                }
            }
            for (i = 0; i < this.nodeList.length; i++) {
                if (this.nodeList[i].priority < 0) {
                    continue;
                }
                this.priorityList[this.nodeList[i].priority].push(this.nodeList[i]);
            }

            var resultStr: string = this._compileGlslServer.compile(this.priorityList, $materialTree);

           // console.log(resultStr);

             left.ModelShowModel.getInstance().outShaderStr($materialTree);

        }
        public setPriority($node: NodeTree): void {
            var inputVec: Array<NodeTreeInputItem> = $node.inputVec;
            for (var i: number=0; i < inputVec.length; i++) {
                var parentNodeItem: NodeTreeOutoutItem = inputVec[i].parentNodeItem;
                if (parentNodeItem) {
                    var pNode: NodeTree = parentNodeItem.node;
                    if (pNode.priority < ($node.priority + 1)) {
                        pNode.priority = ($node.priority + 1);
                    }
                    this.maxPriority = Math.max(this.maxPriority, pNode.priority);
                    this.setPriority(pNode);
                }
            }
        }

        public getOpNode(): NodeTree {
            for (var i: number=0; i < this.nodeList.length; i++) {
                if (this.nodeList[i].type == NodeTree.OP) {
                    return this.nodeList[i];
                }
            }
            return null;
        }
        public resetCompile($list: Array<NodeTree>): void {
            for (var i: number = 0; i < $list.length; i++) {
                var inputVec: Array<NodeTreeInputItem> = $list[i].inputVec;
                for (var j: number = 0; j < inputVec.length; j++) {
                    inputVec[j].hasCompiled = false;
                }
            }
        }
        public resetPriority(): void {
            for (var i: number=0; i <this. nodeList.length; i++) {
                if (this.nodeList[i].type != NodeTree.OP) {
                    this.nodeList[i].priority = -1;
                } else {
                    this. nodeList[i].priority = 0;
                }
            }
        }
    }
}