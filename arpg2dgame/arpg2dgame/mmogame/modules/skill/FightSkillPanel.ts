module fightui {
    export class SkillUIVo {
        public iconUi: UICompenent
        public cd: CdUICompenent;
        public blackMask: UICompenent
        public cdnumA: FrameCompenent;
        public cdnumB: FrameCompenent;
        public baseRect: Rectangle

    }
    export class JumpAndEatCompenent {
        public jumpUi: UICompenent;
        public jumpcd: CdUICompenent;

        public eatUi: UICompenent;
        public eatcd: CdUICompenent;
        public constructor() {

        }
        public update(): void {
            var $num: number = Math.ceil((GuidData.player.nextCanJumpTM - TimeUtil.getTimer()) / 1000);
            if ($num > 0) {
                var $kt: number = (GuidData.player.nextCanJumpTM - TimeUtil.getTimer()) / (10 * 1000)
                this.jumpcd.setCdNum(1 - $kt);

            } else {
                this.jumpcd.setCdNum(0.999999);
            }
        }

        public clikJump(): void {
      
        }

    }
    export class FightSkillPanel extends UIPanel {

        private _bottomRender: UIRenderComponent
        private _midRender: UIRenderComponent;
        private _topRender: UIRenderComponent;
        private _cdRender: CdRenderComponent;
        private static _instance: FightSkillPanel;
        public static getInstance(): FightSkillPanel {
            if (!this._instance) {
                this._instance = new FightSkillPanel();
            }
            return this._instance;
        }

        public constructor() {
            super();
            this.interfaceUI = true
            this.width = 300;
            this.height = 100;
            this.center = 0;
            this.top = 10;
            this.interfaceUI = true;
            
      
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._cdRender = new CdRenderComponent();
            this.addRender(this._cdRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this._bottomRender.uiAtlas = new UIAtlas;

            this.applyLoad()

           
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
            }
       
        }
        public resize(): void {

            if (Scene_data.stageWidth > Scene_data.stageHeight){
                this.top = 10;
            } else {
                this.top = 100;
            }
            super.resize();
        }
    
        public applyLoad(): void {
            this._bottomRender.uiAtlas.setInfo("ui/uidata/mainui/fight/fight.xml", "ui/uidata/mainui/fight/fight.png", () => { this.loadConfigCom() });
        }

        private a_skill_2: UICompenent;
        private a_skill_3: UICompenent;
        private a_skill_4: UICompenent;
        private a_skill_5: UICompenent;

        private loadComplate: boolean = false;

        private loadConfigCom(): void {

            this._midRender.uiAtlas = this._bottomRender.uiAtlas;
            this._topRender.uiAtlas = this._bottomRender.uiAtlas;
            this._cdRender.uiAtlas = this._bottomRender.uiAtlas;

            this.a_skill_2 = this.addEvntBut("a_skill_2", this._bottomRender)
            this.a_skill_3 = this.addEvntBut("a_skill_3", this._bottomRender)
            this.a_skill_4 = this.addEvntBut("a_skill_4", this._bottomRender)
            this.a_skill_5 = this.addEvntBut("a_skill_5", this._bottomRender)

            var $uiArr: Array<UICompenent> = new Array();
            $uiArr.push(this.a_skill_2);
            $uiArr.push(this.a_skill_3);
            $uiArr.push(this.a_skill_4);
            $uiArr.push(this.a_skill_5);
            for (var i: number = 0; i < $uiArr.length; i++) {
                $uiArr[i].x = 100 * i;
                $uiArr[i].y = 0;
            }
            this.addSkillUiToList(this.a_skill_2);
            this.addSkillUiToList(this.a_skill_3);
            this.addSkillUiToList(this.a_skill_4);
            this.addSkillUiToList(this.a_skill_5);

            this.refresh();

            TimeUtil.addFrameTick((t: number) => { this.update(t) });

            this.loadComplate=true
   
        }
        public addEvntBut($name: string, $uiRender: UIRenderComponent): any {
            var $temp: UICompenent = this.addChild(<UICompenent>$uiRender.getComponent($name));
            $temp.addEventListener(InteractiveEvent.Down, this.butClik, this);
            $temp.addEventListener(InteractiveEvent.Up, this.butUpClik, this);
            return $temp;
        }
        private butUpClik(evt: InteractiveEvent): void {
            console.log(evt.target)
        }
        //需要加上倒计时和CD技能
        private addSkillUiToList($ui: UICompenent): void {
            var $cdRender: CdRenderComponent = this._cdRender;
            var $vo: SkillUIVo = new SkillUIVo();
            var $cd: CdUICompenent = <CdUICompenent>this._cdRender.getComponent("a_cd_mask")
            var $alpha: number = 0.3;
            // $cd.colorVer = [1 * $alpha, 1 * $alpha, 1 * $alpha, $alpha];
            $cd.setCdNum(1);
            $cd.x = $ui.x + 1
            $cd.y = $ui.y + 1

            $vo.baseRect = new Rectangle($ui.x, $ui.y, $ui.width, $ui.height)

            this.addChild($cd);
            $vo.cd = $cd;
            $vo.iconUi = $ui;

            $vo.blackMask = this.addChild(this._midRender.getComponent("a_bleak_ui"))
            $vo.blackMask.x = $vo.iconUi.x
            $vo.blackMask.y = $vo.iconUi.y
            $vo.blackMask.width = $vo.iconUi.width
            $vo.blackMask.height = $vo.iconUi.height

            $vo.cdnumA = <FrameCompenent>this.addChild(this._topRender.getComponent("a_cd_num"))
            $vo.cdnumB = <FrameCompenent>this.addChild(this._topRender.getComponent("a_cd_num"))
            $vo.cdnumA.Invisible();
            $vo.cdnumB.Invisible();

            var $pos: Vector2D = new Vector2D(25, 22);
            $vo.cdnumB.y = $pos.y + $vo.iconUi.y;
            $vo.cdnumA.y = $pos.y + $vo.iconUi.y;

            this.skillList.push($vo)

        }
        private update(t: number): void {

            for (var i: number = 0; i < this.skillList.length; i++) {
                var $skillUIVo: SkillUIVo = this.skillList[i];
                if ($skillUIVo.cd && $skillUIVo.cdnumA) {
                    var $k: number = TimeUtil.getTimer() - $skillUIVo.cd.lastTime;
                    if ($k < $skillUIVo.cd.cdTotalnum) {
                        var $pos: Vector2D = new Vector2D(25, 22);

                        var $second: number = Math.ceil(($skillUIVo.cd.cdTotalnum - $k) / 1000);
                        var $A: number = $second % 10;
                        $skillUIVo.cdnumA.goToAndStop($A)

                        var $B: number = Math.floor($second / 10);
                        $skillUIVo.cdnumB.goToAndStop($B)
                        if ($B <= 0) {
                            $skillUIVo.cdnumB.Invisible()
                            $skillUIVo.cdnumA.x = $pos.x + $skillUIVo.baseRect.x;
                        } else {
                            $skillUIVo.cdnumB.x = $pos.x + $skillUIVo.baseRect.x - 8;
                            $skillUIVo.cdnumA.x = $pos.x + $skillUIVo.baseRect.x + 8;
                        }
                        $skillUIVo.blackMask.x = $skillUIVo.iconUi.x

                    } else {
                        $skillUIVo.cdnumB.Invisible()
                        $skillUIVo.cdnumA.Invisible()
                        $skillUIVo.blackMask.x = 2000
                    }

                }

            }

        }
        //设置当前主技能的功能
        public loadBaseSkillIconById(value: number): void {
            var $url: string = this.getPicToSkillById(value)
            this.drawPicToSkill($url);
            this.lastNeedShowUrl = $url;
        }
        private getPicToSkillById($id: number): string {
            return "ui/load/skill/" + $id + ".png";
        }
        private lastNeedShowUrl: string
        private skilImgKey: any = new Object
        private drawPicToSkill($url): void {
            if ($url != this.lastNeedShowUrl) {
                return
            }
            if (this.skilImgKey[$url]) {

            } else {
                var img: any = new Image();
                img.onload = () => {
                    this.skilImgKey[$url] = img;
                    this.drawPicToSkill($url);
                }
                img.src = Scene_data.fileRoot + $url
            }
        }
        private skillList: Array<SkillUIVo> = new Array;
        public refresh(): void {
            tb.SkillData.resetSkillData();
            var $skillList: Array<tb.SkillDataVo> = tb.SkillData.skillList;
            for (var i: number = 0; i < $skillList.length; i++) {
                var $vo: tb.SkillDataVo = $skillList[i];
                if ($vo.slot >= 2 && $vo.slot <= 5) {
                    this.drawSkillIcon($vo);
                } 
            }
        }

        private drawSkillIcon($vo: tb.SkillDataVo): void {
            var $tempBut: UICompenent = <UICompenent>this["a_skill_" + $vo.slot];
            this.drawPicToSkillBut($vo, $tempBut);
        }
        //给技能加上图标， 神兵和主动技能
        private drawPicToSkillBut($vo: tb.SkillDataVo, $ui: UICompenent): void {
            $ui.data = $vo

            LoadManager.getInstance().load(Scene_data.fileRoot + getSkillIconUrl(String($vo.tb_skill_base.icon)), LoadManager.IMG_TYPE,
                ($img: any) => {
                    var $skillrec: UIRectangle = this._topRender.uiAtlas.getRec($ui.skinName);
                    var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($skillrec.pixelWitdh, $skillrec.pixelHeight, false);
                    UiDraw.cxtDrawImg($ctx, PuiData.SKILL_BG68, new Rectangle(0, 0, 71, 71), UIData.publicUi);
                    $ctx.drawImage($img, 4, 4, 62, 62);
                    //推送至显卡
                    this._topRender.uiAtlas.updateCtx($ctx, $skillrec.pixelX, $skillrec.pixelY);
                });
            this.setSkillCdTime($ui);
        }

        public refreshCdBySkillId($skillId: number): void {
            if (this.loadComplate) {
                for (var i: number = 0; i < this.skillList.length; i++) {
                    var $skillUIVo: SkillUIVo = this.skillList[i]
                    var $skillVo: tb.SkillDataVo = $skillUIVo.iconUi.data
                    if ($skillVo && $skillVo.id == $skillId) {
                        $skillUIVo.cd.lastTime = TimeUtil.getTimer();
                    }
                }
            }
           
        }
        private setSkillCdTime($ui: UICompenent): void {
            for (var i: number = 0; i < this.skillList.length; i++) {
                var $skillUIVo: SkillUIVo = this.skillList[i]
                if ($skillUIVo.iconUi == $ui) {
                    var $skillBaseDataVo: tb.SkillDataVo = $ui.data
                    var $saveTime: number = tb.SkillData.getCdMeshBySkillId($skillBaseDataVo.id)
                    $skillUIVo.cd.cdTotalnum = $skillBaseDataVo.singleCD;
                    $skillUIVo.cd.lastTime = $saveTime - $skillBaseDataVo.singleCD;
                }
            }
        }

 
 


    }

    
}