module materialui {

    export class MenuListData {
        public label: string
        public key: string;
        public subMenu: Array<MenuListData>;

        constructor($label: string, $key: string = null) {
            this.label = $label;
            if ($key) {
                this.key = $key;
            } else {
                this.key = $label;
            }

        }

    }

    export class RightMenuVo extends UICompenent {
        public txt: FrameCompenent
        public bg: FrameCompenent;
        public data: MenuListData;
        public bottomRender: UIRenderComponent
        private panel: RightMenuPanel
        public initData($panel: RightMenuPanel, $bottomRender: UIRenderComponent, $midRender: UIRenderComponent, $data: MenuListData, $frameId: number, $isSub: boolean = false): void {
            this.panel = $panel
            this.data = $data
            if ($isSub) {
                this.txt = this.panel.addEvntBut("b_sub_menu", $midRender);
            } else {
                this.txt = this.panel.addEvntBut("b_main_menu", $midRender);
            }

            this.txt.goToAndStop($frameId);
            this.bottomRender = $bottomRender
            this.drawFrontToFrame(this.txt, ColorType.Black000000 + $data.label)

            this.bg = <FrameCompenent>this.panel.addChild($bottomRender.getComponent("b_menu_color"));
            this.bg.goToAndStop(0)
            this.bg.width = this.txt.width;
            this.bg.height = this.txt.height;

            this.bg.addEventListener(InteractiveEvent.Move, this.butMove, this);

        }
        public removeStage(): void {
            this.panel.removeChild(this.txt);
            this.panel.removeChild(this.bg);
        }
        protected butMove(evt: InteractiveEvent): void {
            this.panel.moseMoveTo(evt.target)
        }
        public set x(value: number) {

            this._x = value;
            this.bg.x = this._x
            this.txt.x = this._x

        }
        public set y(value: number) {

            this._y = value;
            this.bg.y = this._y
            this.txt.y = this._y

        }


        private drawFrontToFrame($ui: FrameCompenent, $str: string, $align: string = TextAlign.CENTER): void {
            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this.bottomRender.uiAtlas, $ctx);
        }

    }

    export class RightMenuPanel extends UIPanel {


        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;



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


            this.loadConfigCom();
        }
        private menuTextItem: Array<MenuListData>;
        private mainMenuUiArr: Array<RightMenuVo>
        private subMenuUiArr: Array<RightMenuVo>
        private initMainMenu(): void {

            this.menuTextItem = new Array();
            this.menuTextItem.push(this.getMathListData());
            this.menuTextItem.push(this.getV2CListData());
            this.menuTextItem.push(this.getTextureListData());


            this.mainMenuUiArr = new Array()
            this.subMenuUiArr = new Array


            for (var i: number = 0; i < this.menuTextItem.length; i++) {
                var $vo: RightMenuVo = new RightMenuVo;
                $vo.initData(this, this._bottomRender, this._midRender, this.menuTextItem[i], i);
                $vo.y = i * 21;
                $vo.x = 0;
                this.mainMenuUiArr.push($vo)

            }
        }
        private getMathListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("Math", "1")
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("ADD", "11"));
            $vo.subMenu.push(new MenuListData("SUB", "12"));
            $vo.subMenu.push(new MenuListData("MUL", "13"));
            $vo.subMenu.push(new MenuListData("DIV", "14"));
            $vo.subMenu.push(new MenuListData("SIN", "15"));
            //$vo.subMenu.push(new MenuListData("COS", "16"));
            //$vo.subMenu.push(new MenuListData("LERP", "17"));
            //$vo.subMenu.push(new MenuListData("MIN", "18"));
            return $vo;

        }
        private getV2CListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("常数", "2")
            $vo.subMenu = new Array;
            //     $vo.subMenu.push(new MenuListData("vec4", "21"));
            $vo.subMenu.push(new MenuListData("vec3", "22"));
            $vo.subMenu.push(new MenuListData("vec2", "23"));
            $vo.subMenu.push(new MenuListData("float", "24"));
            return $vo;
        }
        private getTextureListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("纹理", "3")
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("纹理贴图", "31"));
            return $vo;
        }
        public moseMoveTo($ui: FrameCompenent): void {

            var isSub: boolean = false

            for (var j: number = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].bg == $ui) {
                    this.subMenuUiArr[j].bg.goToAndStop(1);
                    isSub = true
                } else {
                    this.subMenuUiArr[j].bg.goToAndStop(0)
                }
            }
            if (!isSub) {
                for (var i: number = 0; i < this.mainMenuUiArr.length; i++) {
                    if (this.mainMenuUiArr[i].bg == $ui) {
                        this.mainMenuUiArr[i].bg.goToAndStop(1);
                        this.showSubMenu(this.mainMenuUiArr[i].data.subMenu, i);
                    } else {
                        this.mainMenuUiArr[i].bg.goToAndStop(0)
                    }
                }
            }

        }
        private clearSubMenu(): void {
            while (this.subMenuUiArr.length) {
                var $vo: RightMenuVo = this.subMenuUiArr.pop();
                $vo.removeStage()
            }
            this.lastShowsubMenu = null

        }


        private lastShowsubMenu: Array<MenuListData>
        public showSubMenu($subMenu: Array<MenuListData>, ty: number): void {
            if ($subMenu) {
                if (this.lastShowsubMenu != $subMenu) {
                    this.clearSubMenu();
                    for (var i: number = 0; i < $subMenu.length; i++) {
                        var $vo: RightMenuVo = new RightMenuVo;
                        $vo.initData(this, this._bottomRender, this._midRender, $subMenu[i], i, true);
                        $vo.y = (ty + i) * 21;
                        $vo.x = 102;
                        this.subMenuUiArr.push($vo);
                    }

                }
            } else {
                this.clearSubMenu()
            }
            this.lastShowsubMenu = $subMenu;
        }

        protected butClik(evt: InteractiveEvent): void {
            var $ui: FrameCompenent = <FrameCompenent>evt.target;
            var seleceVo: RightMenuVo;
            for (var j: number = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].txt == $ui) {
                    seleceVo = this.subMenuUiArr[j]
                }
            }
            for (var i: number = 0; i < this.mainMenuUiArr.length; i++) {
                if (this.mainMenuUiArr[i].txt == $ui) {
                    seleceVo = this.mainMenuUiArr[i]
                }
            }
            if (seleceVo) {
                switch (seleceVo.data.key) {
                    case "1":
                        break
                    case "2":
                        break
                    case "3":
                        break
                    case "4":
                        break
                    case "11":
                        this.onTempNode(new MathAddNodeUI(), evt)
                        break;
                    case "12":
                        this.onTempNode(new MathSubNodeUI(), evt)
                        break;
                    case "13":
                        this.onTempNode(new MathMulNodeUI(), evt)
                        break;
                    case "14":
                        this.onTempNode(new MathDivNodeUI(), evt)
                        break;
                    case "31":
                        this.onTempNode(new TextureSampleNodeUI(), evt)
                        break;
                    case "22":
                        this.onTempNode(new ConstVec3NodeUI(), evt)
                        break;
                    case "23":
                        this.onTempNode(new ConstVec2NodeUI(), evt)
                        break;
                    case "24":
                        this.onTempNode(new ConstFloatNodeUI(), evt)
                        break;
                    default:
                        break;
                }

                console.log(seleceVo.data.key)

                ModuleEventManager.dispatchEvent(new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU));
            }


        }

        private onTempNode($ui: BaseMaterialNodeUI, evt: InteractiveEvent): void {
            $ui.left = evt.x / MtlUiData.Scale - 200;
            $ui.top = evt.y / MtlUiData.Scale - 30;
            MaterialCtrl.getInstance().addNodeUI($ui)
        }


        private drawFrontToFrame($ui: FrameCompenent, $str: string, $align: string = TextAlign.CENTER): void {
            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        }

        protected loadConfigCom(): void {

            this.initMainMenu();
        }
        public refrish(): void {
            this.clearSubMenu();
        }

    }
}