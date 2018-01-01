module materialui {


    export class MaterialNodeLineUI {
        public lineRender: NodeLineLinkComponent

        public  fromNode:ItemMaterialUI;
        public  endNode:ItemMaterialUI;
        public  dragMode:Boolean;

        public  startPoint:Vector2D;
        public  endPoint:Vector2D;
        public  needNodeType:boolean;
        public currentHasNode: ItemMaterialUI;

        public parent: MaterialLineContainer
        public constructor() {
            this.lineRender=new NodeLineLinkComponent
        }
        public  setFromNode($node:ItemMaterialUI):void{
            if($node.inOut) {
                this.endNode = $node;
            }else{
                this.fromNode = $node;
            }
			this.currentHasNode = $node;
            this.needNodeType = !$node.inOut;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
        }
        private mousePos: InteractiveEvent
        private onMove($e: InteractiveEvent): void {
            this.mousePos = $e
            this.draw();
        }
        public  setEndNode($node:ItemMaterialUI):void{
            if($node.inOut) {
                this.endNode = $node;
            }else{
                this.fromNode = $node;
            }
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            this.draw();
			this.setNodeLine();
        }
        public setNodeLine(): void{
            if (this.endNode.inLine) {
                var evt: MEvent_Material_Connect = new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE);
                evt.line = this.endNode.inLine;
                ModuleEventManager.dispatchEvent(evt);
            }
            if (this.endNode.typets == MaterialItemType.UNDEFINE) {
                this.endNode.changeType(this.fromNode.typets);
            }
            this.fromNode.outLineList.push(this);
            this.endNode.inLine = this;
            this.fromNode.setConnect();
            this.endNode.setConnect();

            (<NodeTreeInputItem>this.endNode.nodeTreeItem).parentNodeItem = <NodeTreeOutoutItem>this.fromNode.nodeTreeItem ;
            (<NodeTreeOutoutItem>this.fromNode.nodeTreeItem).pushSunNode(<NodeTreeInputItem>this.endNode.nodeTreeItem  );
          
        }
        public removeStage(): void {
            if (this.parent) {
                if (this.parent) {
                    Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
                }
                this.parent.removeRender(this.lineRender);
                this.parent=null
            }
        }

        public  draw():void{
            if (this.fromNode) {
                this.startPoint = this.parent.globalToLocal(this.fromNode.getStagePoint());
            } else {
                this.startPoint = this.parent.getMouse(this.mousePos)
            }
            if (this.endNode) {
                this.endPoint = this.parent.globalToLocal(this.endNode.getStagePoint());
            } else {
                this.endPoint = this.parent.getMouse(this.mousePos)
            }
            var $arr: Array<Vector2D> = new Array();
            $arr.push(this.startPoint);
            $arr.push(this.endPoint);
            this.lineRender.makeLineUiItem($arr)

      
        }
    }
}