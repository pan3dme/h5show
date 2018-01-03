module materialui {

    export class BaseMaterialNodeUI extends UIPanel {


        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;

        protected inPutItemVec:Array<ItemMaterialUI>;
        protected outPutItemVec: Array<ItemMaterialUI>;
        protected _container: PanelContainer;
        public  nodeTree:NodeTree;
   
        protected gap: number = 20;
        public name: string
        public static baseUIAtlas: UIAtlas;

        public constructor() {
            super();
            this.name = "BaseMaterialNodeUI" + random(9999999);
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
        public setInItemByData(ary: Array<any>): void {

        }

        public setOutItemByData(ary: Array<any>): void {

        }
        public setData(obj: any): void {
            this.left = obj.x+500;
            this.top = obj.y+300;
            this.nodeTree.isDynamic = obj.isDynamic;
            this.nodeTree.paramName = obj.paramName;
        }
        public getData(): Object{
            var obj: any = new Object;
            obj.x = this.left;
            obj.y = this.top;
            obj.name = this.name;
            obj.isDynamic = this.nodeTree.isDynamic;
            obj.paramName = this.nodeTree.paramName;
            return obj;
        }
        public getObj(): Object {
            return this.nodeTree.getObj();
        }
   
        protected resetBgSize(): void
        {
            this.a_cell_base_bg.height = this.height;

            this.a_select_line.x = 0;
            this.a_select_line.y = 0;
            this.a_select_line.width = this.width;
            this.a_select_line.height = this.height+25;
        }
        private a_select_line: UICompenent;
        private a_panel_title_frame: FrameCompenent;
        private static titleFrameId: number=0

        protected loadConfigCom(): void {

            this.a_cell_base_bg = this._bottomRender.getComponent("a_cell_base_bg");
            this.addChild(this.a_cell_base_bg);

            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._bottomRender)
            this.a_select_line = this._topRender.getComponent("a_select_line");
            
           
            this.a_panel_title_frame = <FrameCompenent> this._topRender.getComponent("a_panel_title_frame");
            this.a_panel_title_frame.goToAndStop(BaseMaterialNodeUI.titleFrameId++);
            this.a_panel_title_frame.x=20
            this.addChild(this.a_panel_title_frame);
         


            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
  


            this.inPutItemVec = new Array;
            this.outPutItemVec = new Array;

            this.resetBgSize();

            this.drawTitleToFrame("材质")
    
        }
        protected drawTitleToFrame($str:string): void
        {
            this.drawTextToName(this.a_panel_title_frame, $str);

            this.resetBgSize()
        }
        private drawTextToName($ui: FrameCompenent, $str:string): void {

            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 20,0,0,TextAlign.LEFT)
            $ui.drawToCtx(this._bottomRender.uiAtlas, $ctx)
  
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

        public removeAllNodeLine(): void {
            for (var i: number=0; i < this.inPutItemVec.length; i++) {
                this. inPutItemVec[i].removeAllLine();
            }
            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].removeAllLine();
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

       
            var $materialEvent: MaterialEvent = new MaterialEvent(MaterialEvent.SELECT_MATERIAL_NODE_UI)
            $materialEvent.nodeUi = this;
            ModuleEventManager.dispatchEvent($materialEvent);
         
     
        }

        public getInItem($id: number): ItemMaterialUI{
            return this.inPutItemVec[$id];
        }

        public getOutItem($id: number): ItemMaterialUI{
            return this.outPutItemVec[$id];
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
        private  _select: boolean;
        public get select(): boolean {
            return this._select;
        }
        public set select(value: boolean) {
            this._select = value
            this.setUiListVisibleByItem([this.a_select_line], this._select);
        }

    }
}  