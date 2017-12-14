module camand {
    export class CammandRender extends ListItemRender {

        public draw(): void {
            var ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(this.uvData.ow, this.uvData.oh, false);
            UiDraw.cxtDrawImg(ctx, PuiData.Slist_select, new Rectangle(0, 0, 98, 50), UIData.publicUi);
            this.drawLable(ctx, 50, 15, this._listItemData.data.txt, 16, "#000000", false);
            this.atlas.updateCtx(ctx, this.uvData.ox, this.uvData.oy);

        }

        private drawLable(ctx: CanvasRenderingContext2D,
            $xpos: number, $ypos: number,
            $str: string, fontsize: number, fontColor: string, bolder: boolean = false): void {

            ctx.textBaseline = TextAlign.TOP;
            ctx.textAlign = TextAlign.CENTER;
            ctx.fillStyle = fontColor;
            ctx.font = (bolder ? "bolder " : "") + fontsize + "px" + UIData.font;

            ctx.fillText($str, $xpos, $ypos);
        }


    }


    export class CammandPanel extends UIConatiner {


        private _backRender: UIRenderComponent;
        private _butRender: UIRenderComponent;
        private _baseRender: UIRenderComponent;
        private _listRender: UIListRenderComponent;
        public constructor() {
            super();

            //  this.makeBgWinPanel();

            this.width = 600;
            this.height = 400;
            this.center = 0;
            this.middle = 0;

            this._listRender = new UIListRenderComponent;
            this.addRender(this._listRender);

            this._baseRender = new UIRenderComponent();
            this.addRender(this._baseRender);

            this.addList()
        }
        private _bgList: GridList;
        private _bgMask: UIMask;
        private addList(): void {
            var $pos: Vector2D = new Vector2D(30, 20)
            this._bgList = this._listRender.createGridList();
            this._bgList.x = $pos.x;
            this._bgList.y = $pos.y;

            this.addChild(this._bgList);

            this._bgMask = new UIMask();
            this._bgMask.x = $pos.x;
            this._bgMask.y = $pos.y;
            this._bgMask.width = 512;
            this._bgMask.height = 300;
            this.addMask(this._bgMask);

            this._listRender.mask = this._bgMask;

            this.refreshData()

        }
        private refreshData(): void {
            var ary: Array<ListItemData> = new Array;
            var butItem: Array<string> = [

                "回主城",
                "去新手村",
                "慈云寺",
                "莽苍山",
                "去幻境",
                "测试场景",
                "显示A星",


            ]
            for (var i: number = 0; i < butItem.length; i++) {
                var listItemData: ListItemData = new ListItemData();
                listItemData.data = { txt: butItem[i], id: i };
                listItemData.clickFun = ($listItemData: ListItemData) => { this.itemDataClick($listItemData) }
                ary.push(listItemData);
            }
            this._bgList.contentY = 0;
            this._bgList.setGridData(ary, CammandRender, 5, 100, 50, 512, 512, 512, 300);

        }
        private itemDataClick($listItemData: ListItemData): void {

            var str: string = $listItemData.data.txt
            console.log(str)
            switch (str) {
                case "回主城":
                    NetManager.getInstance().protocolos.teleport_map(1, GuidData.map.getLineID());
                    break
                case "去新手村":
                    NetManager.getInstance().protocolos.teleport_map(1001, GuidData.map.getLineID());
                    break
                case "莽苍山":
                    NetManager.getInstance().protocolos.teleport_map(1002, GuidData.map.getLineID());
                    break
                case "慈云寺":
                    NetManager.getInstance().protocolos.teleport_map(1003, GuidData.map.getLineID());
                    break
                case "测试场景":
                    NetManager.getInstance().protocolos.teleport_map(1007, GuidData.map.getLineID());
                    break
                case "去幻境":
                    NetManager.getInstance().protocolos.enter_risk_instance();
                    break
                case "显示A星":
                    SceneAstarModel.getInstance().showAstarLine()
        
                    break

              
                default:
                    break;
            }

            this.hide();
        }

        public hide(): void {
            if (this.hasStage) {
                UIManager.getInstance().removeUIContainer(this);
                Scene_data.uiBlankStage.removeEventListener(InteractiveEvent.Down, this.onStageMouseUp, this);
            }
        }
        public show(): void {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
                Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Up, this.onStageMouseUp, this);
            }
        }
        private onStageMouseUp(evt: InteractiveEvent): void {
            this.hide()
        }


    }
  
 

}