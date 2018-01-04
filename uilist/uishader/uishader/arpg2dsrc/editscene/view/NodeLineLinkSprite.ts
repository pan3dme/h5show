
module materialui {
    export class NodeLineLinkShader extends Shader3D {
        static NodeLineLinkShader: string = "NodeLineLinkShader";
        constructor() {
            super();
        }
        binLocation($context: WebGLRenderingContext): void {
            $context.bindAttribLocation(this.program, 0, "v4Pos");
        }
        getVertexShaderString(): string {
            var $str: string =
                "attribute vec4 v4Pos;" +
                "uniform vec4 posMove;" +
                "uniform mat4 viewMatrix3D;" +
                "void main(void)" +
                "{" +
                    "vec4 vt0= vec4(v4Pos.x+posMove.x,v4Pos.y+posMove.y,1.0,1.0);\n" +
                    "vt0=vt0*viewMatrix3D;\n" +
                    "vt0.x=vt0.x-1.0;\n" +
                    "vt0.y=vt0.y+1.0;\n" +
                    "gl_Position = vt0;\n" +
                "}"
            return $str
        }
        getFragmentShaderString(): string {
            var $str: string =
                "precision mediump float;\n" +
                "void main(void)\n" +
                "{\n" +
                       "gl_FragColor = vec4(0.9,0.9,0.9, 0.9);\n" +
                "}"
            return $str;
        }

    }
    export class MapLineUi extends UICompenent {

        public constructor() {
            super();
            this.x = UIData.designWidth / 2;
            this.y = UIData.designHeight / 2;
            this.width = 20;
            this.height = 20;
        }
        public applyRenderSize(): void {
        }
    }
    export class NodeLineLinkComponent extends MtUIRenderComponent {
        public constructor() {
            super();
            ProgrmaManager.getInstance().registe(NodeLineLinkShader.NodeLineLinkShader, new NodeLineLinkShader)
            this.shader = ProgrmaManager.getInstance().getProgram(NodeLineLinkShader.NodeLineLinkShader);
            this.program = this.shader.program;



        }


        public makeLineUiItem($arr: Array<Vector2D>): void {
            if ($arr && $arr.length > 1) {
                this.mapLineUiList = new Array();
                var lastPos: Vector2D = $arr[0];
                var $gapnum:number=1.0
                for (var i: number = 0; i < $arr.length; i++) {
                    while (Vector2D.distance(lastPos, $arr[i]) > $gapnum) {
                        lastPos = this.nextPostForTow(lastPos, $arr[i], $gapnum/2)
                        var $ui: Vector2D = new Vector2D();
                        $ui.x = lastPos.x;
                        $ui.y = lastPos.y;
              
                        this.mapLineUiList.push($ui);
                    }
                }
                this.makeLineVetlineObjData();
            } else {
                this.objData.treNum = 0;
                console.log("路线清除")
            }
        }
        private nextPostForTow(a: Vector2D, b: Vector2D, $gapnum:number): Vector2D {
            var c: Vector2D = new Vector2D(b.x - a.x, b.y - a.y);
            c.normalize();
            c.x = c.x * $gapnum;
            c.y = c.y * $gapnum;

            c.x += a.x
            c.y += a.y
            return c
        }


        private mapLineUiList: Array<Vector2D>;
        private makeLineVetlineObjData(): void {

            if (!this.objData) {
                this.objData = new ObjData;
            }
            this.objData.vertices = new Array();
            this.objData.indexs = new Array();
            this.getUiDataForItem();
            if (this.objData.vertexBuffer) {
                Scene_data.context3D.uploadBuff3DByBuffer(this.objData.vertexBuffer, this.objData.vertices);
                Scene_data.context3D.uploadIndexBuff3DByBuffer(this.objData.indexBuffer, this.objData.indexs);
            } else {
                this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
                this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
            }
            this.objData.treNum = this.objData.indexs.length;

        }

        private getUiDataForItem(): void {
            //   this.anglyNum++;
            var $v: Array<number> = new Array;
            var $linesize:number=2
            for (var i: number = 0; i < this.mapLineUiList.length; i++) {
                var $v2d: Vector2D = this.mapLineUiList[i];


                if (i == 0) {
                    this.objData.vertices.push($v2d.x, $v2d.y, 1, 1);
                    this.objData.vertices.push($v2d.x, $v2d.y, 1, 1);
                } else {
                    var lastV2d: Vector2D = this.mapLineUiList[i - 1];
                    var anglyNum: number = Math.atan2($v2d.y - lastV2d.y, $v2d.x - lastV2d.x);
                    var rotm: Matrix3D = new Matrix3D()
                    rotm.appendRotation(anglyNum * 180 / Math.PI , Vector3D.Z_AXIS);
                    rotm.appendTranslation($v2d.x, $v2d.y, 0);
                    var ka: Vector3D = rotm.transformVector(new Vector3D(0, +$linesize, 0))
                    var kb: Vector3D = rotm.transformVector(new Vector3D(0, -$linesize, 0))
     

                    this.objData.vertices.push(ka.x, ka.y, 1, 1);
                    this.objData.vertices.push(kb.x, kb.y, 1, 1);

                    var $indx:number=i-1

                    this.objData.indexs.push(0 + $indx * 2, 1 + $indx * 2, 3 + $indx * 2);
                    this.objData.indexs.push(0 + $indx * 2, 3 + $indx * 2, 2 + $indx * 2);
                }
            }

        }

        public update(): void {

            if (this.objData && this.objData.treNum > 0) {
                Scene_data.context3D.setProgram(this.program);
                Scene_data.context3D.setVa(0, 4, this.objData.vertexBuffer);
                var $m: Matrix3D = new Matrix3D;

                $m.appendScale(2 / Scene_data.stageWidth * MtlUiData.Scale, -2 / Scene_data.stageHeight * MtlUiData.Scale, 1);
      

       

                Scene_data.context3D.setVc4fv(this.shader, "posMove", [Arpg2dGameStart.stagePos.x, Arpg2dGameStart.stagePos.y, 0, 0]);
   
                Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", $m.m);
                Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
            }


        }
    }


    export class MaterialLineContainer extends MtUiPanel {


      
        public _midRender: NodeLineLinkComponent;


        public constructor() {
            super();
            this.layer=100
            this.width = 200;
            this.height = 200;

           /*
            this._midRender = new NodeLineLinkComponent;
            this.addRender(this._midRender);
            var $arr: Array<Vector2D> = new Array();
            $arr.push(new Vector2D(0, 0));
            $arr.push(new Vector2D(1000, 0));
            $arr.push(new Vector2D(1000, 1000));
            $arr.push(new Vector2D(0, 1000));
            $arr.push(new Vector2D(0, 0));
            this._midRender.makeLineUiItem($arr)

            */
            this._lineList=new Array
        }
        private _currentLine: MaterialNodeLineUI
        private  _lineList:Array<MaterialNodeLineUI> 
        public  startLine($item:ItemMaterialUI):void{
            this._currentLine = new MaterialNodeLineUI;
            this._currentLine.parent=this
            this.addRender(this._currentLine.lineRender);
    
            this._currentLine.setFromNode($item);
  
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onMouseUp, this);
        }

        public removeLine($line: MaterialNodeLineUI): void {
            for (var i: number; i < this._lineList.length; i++) {
                if (this._lineList[i] == $line) {
                    this. _lineList.splice(i, 1);
                    break;
                }
            }
            $line.remove();
        }
		
        public globalToLocal($v: Vector2D): Vector2D {
            var p: Vector2D = new Vector2D($v.x - Arpg2dGameStart.stagePos.x, $v.y - Arpg2dGameStart.stagePos.y)
            return p

        }
        public getMouse($v: InteractiveEvent): Vector2D {
            var p: Vector2D = new Vector2D(($v.x / MtlUiData.Scale - Arpg2dGameStart.stagePos.x), $v.y / MtlUiData.Scale - Arpg2dGameStart.stagePos.y )
            return p

        }

        protected  onMouseUp(event:MouseEvent):void
        {
      
            var $slectUi: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D(event.x, event.y))
            var evt: MEvent_Material_Connect = new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG);
            if ($slectUi&&$slectUi.name == "a_point_frame" ) {
                evt.itemNode = <ItemMaterialUI>$slectUi.data;
            }
            ModuleEventManager.dispatchEvent(evt);

        Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onMouseUp, this);
        }
        public  addConnentLine($startItem: ItemMaterialUI, $endItem: ItemMaterialUI):void {
            this._currentLine = new MaterialNodeLineUI;

            this._currentLine.parent = this
            this.addRender(this._currentLine.lineRender);
            this._currentLine.setFromNode($startItem);
            this._currentLine.setEndNode($endItem);
            this._lineList.push(this._currentLine);
        }

        public stopLine($item: ItemMaterialUI): void{

      
            if ($item) {
              
                if (this._currentLine.needNodeType == $item.inOut && $item.parent != this._currentLine.currentHasNode.parent && ($item.typets == MaterialItemType.UNDEFINE || $item.typets == this._currentLine.currentHasNode.typets)) {
                    if ($item.typets == MaterialItemType.UNDEFINE) {
                        $item.changeType(this._currentLine.currentHasNode.typets);
                    }
                   this. _currentLine.setEndNode($item);
                    this._lineList.push(this._currentLine);
                } else {
                   this. _currentLine.removeStage();
                }
             
            }else{
               this. _currentLine.removeStage();
            }

        
        }
      
		

    }
}