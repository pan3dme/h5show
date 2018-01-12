module colorview {

    export class ColorPanel extends UIPanel {
        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;

        public constructor() {
            super();
            this.layer = 2000
            this.left = 400;
            this.top = 200;
            this.width = 300;
            this.height = 300;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);


            this._topRender.uiAtlas = new UIAtlas();
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/colorview/colorview.xml", "pan/marmoset/uilist/colorview/colorview.png", () => { this.loadConfigCom() });

        }
        private c_tittle: UICompenent
        private loadConfigCom(): void {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas
            this._midRender.uiAtlas = this._topRender.uiAtlas;

            this.c_tittle = this.addEvntBut("c_tittle", this._bottomRender)
            this.addEvntBut("c_bg", this._bottomRender)
       

        }
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.c_tittle:
                    this.addStageMoveEvets(evt)
                    break;
                default:
         
                    break;
            }


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

        }


        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
 


      

    }
}