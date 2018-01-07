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
            this.layer = 100
            this.left = 0;
            this.top = 0;
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
        private initView(): void {
            var $ui: UICompenent = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("ui/load/map/bigworld.jpg");
            $ui.top = 10;
            $ui.left = 10;
            ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic"
            this.addEvntBut
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);

        }

        private lastCameRotation: number;
        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.lastCameRotation = Scene_data.focus3D.rotationY;
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {
            var $n: number = ($e.x - this.mouseXY.x);
            Scene_data.focus3D.rotationY = this.lastCameRotation - $n;
        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
        private a_panel_bg: UICompenent;
        private a_compile_but: UICompenent
        private loadConfigCom(): void {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;
       //     this.addChild(this._topRender.getComponent("a_base"));

            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender)

            

            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;


            this.initView()
            this.resize();
        }
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break
                default:
                    break
            }
        }
        public resize(): void {
            super.resize()
            if (this.a_panel_bg) {
                this.a_panel_bg.width = 250;
                this.a_panel_bg.height = Scene_data.stageHeight;
            }

        }
    }
}