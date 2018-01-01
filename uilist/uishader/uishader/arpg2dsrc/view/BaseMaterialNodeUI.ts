module materialui {

    export class BaseMaterialNodeUI extends UIPanel {


        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;

        protected inPutItemVec:Array<ItemMaterialUI>;
        protected outPutItemVec: Array<ItemMaterialUI>;
        protected _container: PanelContainer;
        public  nodeTree:NodeTree;
   
        protected  gap:number = 20;
        public static baseUIAtlas: UIAtlas;

        public constructor() {
            super();

            this.width = 200;
            this.height = 200;

            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this._bottomRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._midRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._topRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;


            this._container = new PanelContainer(this,this._topRender);
    

            this.loadConfigCom();
        }
        protected resetBgSize(): void
        {
            this.a_cell_base_bg.height = this.height;
        }
        protected loadConfigCom(): void {


            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._bottomRender)
            this.a_cell_base_bg = this.addEvntBut("a_cell_base_bg", this._bottomRender)

            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
  


            this.inPutItemVec = new Array;
            this.outPutItemVec = new Array;

            this.resetBgSize()
    
        }
        public addItems($nodeUI: ItemMaterialUI): void{
            
            if($nodeUI.inOut) {
                if (this.inPutItemVec.indexOf($nodeUI) == -1) {
                    this.inPutItemVec.push($nodeUI);
                    this.nodeTree.addInput($nodeUI.nodeTreeItem);
                }
            }else{
                if (this.outPutItemVec.indexOf($nodeUI) == -1) {
                    this.outPutItemVec.push($nodeUI);
                    this.nodeTree.addOutput($nodeUI.nodeTreeItem);
                }
            }
            $nodeUI.parent = this
            this._container.addChild($nodeUI);

            this.refreshNodePos();
        }
        public removeItem($nodeUI: ItemMaterialUI): void {
            for (var i: number=0; i < this.inPutItemVec.length; i++) {
                if (this.inPutItemVec[i] == $nodeUI) {
                    this.inPutItemVec.splice(i, 1);
                }
            }
            this.nodeTree.removeInput($nodeUI.nodeTreeItem);
            for (i = 0; i < this.outPutItemVec.length; i++) {
                if (this.outPutItemVec[i] == $nodeUI) {
                    this.outPutItemVec.splice(i, 1);
                }
            }
            this.nodeTree.removeOutput($nodeUI.nodeTreeItem);
            if ($nodeUI.parent) {
                this._container.removeChild($nodeUI);
            }
            this. refreshNodePos();
        }
        public refreshNodePos(): void{
            for (var i: number=0; i < this.inPutItemVec.length; i++) {
                this.inPutItemVec[i].y = this.gap * i + 30;
                this.inPutItemVec[i].x=10
            }

            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].y = this.gap * i + 30;
                this.outPutItemVec[i].x=130
            }
        }


        protected a_tittle_bg: FrameCompenent;
        protected a_cell_base_bg: UICompenent;
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.a_tittle_bg:
                    this.addStageMoveEvets(evt)
                    break;
                default:
                    this.clikUiEvent(evt)
                    break;
            }
        }
        public clikUiEvent($mouseEvt: InteractiveEvent): void {

            var $itemMaterialUI: ItemMaterialUI = this.getPointFrameTagetFoItemVec($mouseEvt.target);
       
            if (Arpg2dGameStart.altKey) {
                $itemMaterialUI.removeAllLine();
                return;
            }

            if ($itemMaterialUI) {
                 var $MEvent_Material_Connect: MEvent_Material_Connect = new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG);
                $MEvent_Material_Connect.itemNode = $itemMaterialUI;
                ModuleEventManager.dispatchEvent($MEvent_Material_Connect);
            }


        }
        private getPointFrameTagetFoItemVec($targer: any): ItemMaterialUI
        {
            for (var i: number = 0; i < this.inPutItemVec.length; i++) {
                if (this.inPutItemVec[i].pointframe == $targer) {
                    return this.inPutItemVec[i]
                }
            }

            for (i = 0; i < this.outPutItemVec.length; i++) {
                if (this.outPutItemVec[i].pointframe == $targer) {
                    return this.outPutItemVec[i]
                }
            }
            return null

        }


        private lastPanelPos: Vector2D;
        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x) / UIData.Scale;
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y) / UIData.Scale;
            this.resize();
            this.drawLine();
        }
        public drawLine(): void {
            for (var i: number=0; i < this.inPutItemVec.length; i++) {
                this.inPutItemVec[i].drawLine()
            }

            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].drawLine()
            }
        }

        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }

    

    }
}  