module materialui {




    export class ItemMaterialUI extends EventDispatcher {
        private  _type:string;
        public  hasConnet:boolean;
        public inOut: boolean;//true为in false为out
        public nodeTreeItem: NodeTreeItem;
        public pointframe: FrameCompenent;
        public labelframe: FrameCompenent;
        public parent: BaseMaterialNodeUI;
        public titleLabeltext: string
        public outLineList: Array<MaterialNodeLineUI> 
        private  _inLine:MaterialNodeLineUI;
        public constructor(name: string, $type: string, $inOut: boolean = true) {
    
            super();
            this.outLineList = new Array
            this.titleLabeltext=name
            this.inOut = $inOut;
            if (this.inOut) {
                this.nodeTreeItem = new NodeTreeInputItem;
            } else {
                this.nodeTreeItem = new NodeTreeOutoutItem;
            }
            this.typets = $type;
            this.drawSp();
   
        }
        public removeOut($line: MaterialNodeLineUI): void {
            for (var i: number=0; i < this.outLineList.length; i++) {
                if (this.outLineList[i] == $line) {
                    this.outLineList.splice(i, 1);
                    break;
                }
            }
            if (!this.inOut && this.outLineList.length == 0) {
                this.hasConnet = false;
                this.dispatchEvent(new BaseEvent("DisConnect"));
            }
        }
        public  removeIn():void{
            this._inLine = null;
            if (this.inOut) {
                this.hasConnet = false;
                this.dispatchEvent(new BaseEvent("DisConnect"));
            }
        }
        public  setConnect():void{
            this.hasConnet = true;
            this.dispatchEvent(new BaseEvent("Connect"));
        }
        public removeAllLine(): void {
            var evt: MEvent_Material_Connect;
            for (var i: number = this.outLineList.length - 1; i >= 0; i--) {
                evt = new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE);
                evt.line = this.outLineList[i];
                ModuleEventManager.dispatchEvent(evt);
            }
            if (this._inLine) {
                evt = new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE);
                evt.line = this._inLine;
                ModuleEventManager.dispatchEvent(evt);
            }
        }
        public get typets(): string {
            return this._type;
        }
        public set typets(value: string) {
            this._type = value;
            this.nodeTreeItem.type = value;
        }
        private _x: number
        private _y: number
        public set x(value: number) {
            this._x = value;
            this.pointframe.x = this._x
    
            if (this.inOut) {
                this.labelframe.x = this._x+20
            } else {
                this.labelframe.x = this._x-30
            }
        }
        public get x() {
            return this._x;
        }
        public set y(value: number) {
            this._y = value;
            this.pointframe.y = this._y
            this.labelframe.y = this._y-2
        }
        public get y() {

            return this._y;
        }
        public getStagePoint(): Vector2D{
            return new Vector2D(this.pointframe.x + this.pointframe.parent.left+10, this.pointframe.y + this.pointframe.parent.top+10)
        }
    
        public changeType($type:string):void{
            this.typets = $type;
            this.drawSp();
        }
        public drawSp(): void{
            if (this.pointframe) {
                if (this._type == MaterialItemType.FLOAT) {
                    this.pointframe.goToAndStop(2)
                } else if (this._type == MaterialItemType.VEC2) {
                    this.pointframe.goToAndStop(3)
                } else if (this._type == MaterialItemType.VEC3) {
                    this.pointframe.goToAndStop(0)
                } else if (this._type == MaterialItemType.VEC4) {
                    this.pointframe.goToAndStop(1)
                } else if (this._type == MaterialItemType.UNDEFINE) {
                    this.pointframe.goToAndStop(4)
                }
            }
        }

        public  get inLine(): MaterialNodeLineUI {
            return this._inLine;
        }

        public  set inLine(value: MaterialNodeLineUI) {

            this._inLine = value;
            //NodeTreeInputItem(nodeTreeItem) = _inLine.fromNode.nodeTreeItem;
        }
		
        public drawLine(): void {
            for (var i: number=0; i <this. outLineList.length; i++) {
                this.outLineList[i].draw();
            }
            if (this._inLine) {
                this. _inLine.draw();
            }
        }
    }
}