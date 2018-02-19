module left {
    export class modelShowRender extends UIRenderOnlyPicComponent {
        public constructor() {
            super();
        }
        public makeRenderDataVc($vcId: number): void {
            super.makeRenderDataVc($vcId);
            for (var i: number = 0; i < this.renderData2.length / 4; i++) {
                this.renderData2[i * 4 + 0] = 1;
                this.renderData2[i * 4 + 1] = -1;
                this.renderData2[i * 4 + 2] = 0;
                this.renderData2[i * 4 + 3] = 0;
            }
        }
    }
    export class LeftPanel extends UIPanel {
        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;
        private modelPic: modelShowRender;
        public constructor() {
            super();
   
            this.left = 0;
            this.top = 0;
            this.width=600
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this.modelPic = new modelShowRender();
            this.addRender(this.modelPic)



            this._topRender.uiAtlas = new UIAtlas();
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.xml", "pan/marmoset/uilist/left/left.png", () => { this.loadConfigCom() });

        }
        private showModelPic: UICompenent
        private initView(): void {
            var $ui: UICompenent = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("pan/marmoset/uilist/1024.jpg");
            $ui.top = 10;
            $ui.left = 10;
            ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic"
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);

            this.showModelPic = $ui


        }
        public resize(): void {
            super.resize()
            this.height = Scene_data.stageHeight
            if (this.a_panel_bg) {
                this.a_panel_bg.width = this.width;
                this.a_panel_bg.height = this.height;
                this.a_left_line.x = this.width - 10;
                this.a_left_line.y = 0;
                this.a_left_line.height = this.height;

                this.showModelPic.width = this.width - 20;
                this.showModelPic.height = this.width - 20;

                this.a_compile_but.y = this.showModelPic.height + 20;
                this.a_input_dae.y = this.a_compile_but.y 
            }

        }
        private a_left_line: UICompenent;
        private lastWidth: number
        private a_left_lineDown($e: InteractiveEvent): void {
            this.a_left_line.data = new Vector2D($e.x, $e.y)
            this.lastWidth = this.width
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        }
        private a_left_lineUp($e: InteractiveEvent): void {
            this.a_left_line.data = null
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        }
        private onMoveLine($e: InteractiveEvent): void {
            var $select: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($e.x, $e.y))
            if ($select == this.a_left_line) {
                Scene_data.canvas3D.style.cursor = "e-resize"
            } else {
                Scene_data.canvas3D.style.cursor = "auto"
            }
            if (this.a_left_line.data) {
                var $lastV2d: Vector2D = <Vector2D>this.a_left_line.data;
                var Tx: number = ($e.x - $lastV2d.x);

                var $lastW: number = this.width

                this.width = this.lastWidth + Tx;
                this.resize();
                prop.PropModel.getInstance().moveTop(this.width + 60)

                var $materialEvent: materialui.MaterialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE)
                $materialEvent.v2d = new Vector2D((this.width - $lastW) / materialui.MtlUiData.Scale, 0);
                ModuleEventManager.dispatchEvent($materialEvent);

            }
        }

     
        private lastCameRotation: Vector2D;
        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.lastCameRotation = new Vector2D(Scene_data.focus3D.rotationX, Scene_data.focus3D.rotationY);
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {
            var $n: Vector2D = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
            Scene_data.focus3D.rotationX = this.lastCameRotation.x - $n.y;
            Scene_data.focus3D.rotationY = this.lastCameRotation.y - $n.x ;
        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
        private a_panel_bg: UICompenent;
        private a_compile_but: UICompenent
        private a_input_dae: UICompenent
        private loadConfigCom(): void {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;

            
            this.a_input_dae = this.addEvntBut("a_input_dae", this._topRender)
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender)

            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;

            this.a_left_line = this.addChild(this._topRender.getComponent("a_left_line"));
            this.a_left_line.addEventListener(InteractiveEvent.Down, this.a_left_lineDown, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMoveLine, this);


            this.initView()
            this.resize();


          
        }
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break
                case this.a_input_dae:
                    console.log("inputdae")
                    this.selectInputDae(evt)
                    break
                default:
                    break
            }
        }

        private _inputHtmlSprite: HTMLInputElement
        protected selectInputDae(evt: InteractiveEvent): void {


                this._inputHtmlSprite = <HTMLInputElement>document.createElement('input');
                this._inputHtmlSprite.setAttribute('id', '_ef');
                this._inputHtmlSprite.setAttribute('type', 'file');
                this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
                this._inputHtmlSprite.click();
                this._inputHtmlSprite.value;
                this._inputHtmlSprite.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
     

        }
        private changeFile(evt: any): void {
            for (var i: number = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile: File = <File>this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader: FileReader = new FileReader(); 
                    $reader.readAsArrayBuffer(simpleFile);
                    $reader.onload = ($temp: Event) => { this.readOnLod($temp) }
                } else {
                    alert("请确保文件类型为图像类型");
                }
            
            }
            this._inputHtmlSprite = null;
        }
        private readOnLod($temp: Event): void {
            var $reader: FileReader = <FileReader>($temp.target);
            var newByte: ByteArray = new ByteArray($reader.result);
            var $objdata: ObjData = new ObjData();
            var $objurl: string = newByte.readUTF()
            console.log($objurl);
            $objdata.vertices = this.readVecFloat(newByte);
            $objdata.normals = this.readVecFloat(newByte);
            $objdata.uvs = this.readVecFloat(newByte);
            $objdata.lightuvs = this.readVecFloat(newByte);
            $objdata.indexs = this.readVecInt(newByte);
            $objdata.treNum = $objdata.indexs.length;
            TBNUtils.processTBN($objdata);

            $objdata.vertexBuffer = Scene_data.context3D.uploadBuff3D($objdata.vertices);
            $objdata.uvBuffer = Scene_data.context3D.uploadBuff3D($objdata.uvs);
            $objdata.lightUvBuffer = Scene_data.context3D.uploadBuff3D($objdata.lightuvs);
            $objdata.tangentBuffer = Scene_data.context3D.uploadBuff3D($objdata.tangents);
            $objdata.bitangentBuffer = Scene_data.context3D.uploadBuff3D($objdata.bitangents);
            $objdata.normalsBuffer = Scene_data.context3D.uploadBuff3D($objdata.normals);
            $objdata.indexBuffer = Scene_data.context3D.uploadIndexBuff3D($objdata.indexs);
  
            console.log($objdata);

            ModelShowModel.getInstance().lightSpriteList.inputObjdata = $objdata;
            ModelShowModel.getInstance().lightSpriteList.objData = $objdata;
        }

        private readVecFloat($byte: ByteArray): Array<number> {
            var $arr: Array<number> = new Array();
            var $len: number = $byte.readInt();
            for (var i: number = 0; i < $len; i++) {
                $arr.push($byte.readFloat())
            }
            return $arr
        }
        private readVecInt($byte: ByteArray): Array<number> {
            var $arr: Array<number> = new Array();
            var $len: number = $byte.readInt();
            for (var i: number = 0; i < $len; i++) {
                $arr.push($byte.readInt())
            }
            return $arr
        }
    
    }
}