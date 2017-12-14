var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var fightui;
(function (fightui) {
    var SkillUIVo = /** @class */ (function () {
        function SkillUIVo() {
        }
        return SkillUIVo;
    }());
    fightui.SkillUIVo = SkillUIVo;
    var JumpAndEatCompenent = /** @class */ (function () {
        function JumpAndEatCompenent() {
        }
        JumpAndEatCompenent.prototype.update = function () {
            var $num = Math.ceil((GuidData.player.nextCanJumpTM - TimeUtil.getTimer()) / 1000);
            if ($num > 0) {
                var $kt = (GuidData.player.nextCanJumpTM - TimeUtil.getTimer()) / (10 * 1000);
                this.jumpcd.setCdNum(1 - $kt);
            }
            else {
                this.jumpcd.setCdNum(0.999999);
            }
        };
        JumpAndEatCompenent.prototype.clikJump = function () {
        };
        return JumpAndEatCompenent;
    }());
    fightui.JumpAndEatCompenent = JumpAndEatCompenent;
    var FightSkillPanel = /** @class */ (function (_super) {
        __extends(FightSkillPanel, _super);
        function FightSkillPanel() {
            var _this = _super.call(this) || this;
            _this.loadComplate = false;
            _this.skilImgKey = new Object;
            _this.skillList = new Array;
            _this.interfaceUI = true;
            _this.width = 300;
            _this.height = 100;
            _this.center = 0;
            _this.top = 10;
            _this.interfaceUI = true;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._cdRender = new CdRenderComponent();
            _this.addRender(_this._cdRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this._bottomRender.uiAtlas = new UIAtlas;
            _this.applyLoad();
            if (!_this.hasStage) {
                UIManager.getInstance().addUIContainer(_this);
            }
            return _this;
        }
        FightSkillPanel.getInstance = function () {
            if (!this._instance) {
                this._instance = new FightSkillPanel();
            }
            return this._instance;
        };
        FightSkillPanel.prototype.resize = function () {
            if (Scene_data.stageWidth > Scene_data.stageHeight) {
                this.top = 10;
            }
            else {
                this.top = 100;
            }
            _super.prototype.resize.call(this);
        };
        FightSkillPanel.prototype.applyLoad = function () {
            var _this = this;
            this._bottomRender.uiAtlas.setInfo("ui/uidata/mainui/fight/fight.xml", "ui/uidata/mainui/fight/fight.png", function () { _this.loadConfigCom(); });
        };
        FightSkillPanel.prototype.loadConfigCom = function () {
            var _this = this;
            this._midRender.uiAtlas = this._bottomRender.uiAtlas;
            this._topRender.uiAtlas = this._bottomRender.uiAtlas;
            this._cdRender.uiAtlas = this._bottomRender.uiAtlas;
            this.a_skill_2 = this.addEvntBut("a_skill_2", this._bottomRender);
            this.a_skill_3 = this.addEvntBut("a_skill_3", this._bottomRender);
            this.a_skill_4 = this.addEvntBut("a_skill_4", this._bottomRender);
            this.a_skill_5 = this.addEvntBut("a_skill_5", this._bottomRender);
            var $uiArr = new Array();
            $uiArr.push(this.a_skill_2);
            $uiArr.push(this.a_skill_3);
            $uiArr.push(this.a_skill_4);
            $uiArr.push(this.a_skill_5);
            for (var i = 0; i < $uiArr.length; i++) {
                $uiArr[i].x = 100 * i;
                $uiArr[i].y = 0;
            }
            this.addSkillUiToList(this.a_skill_2);
            this.addSkillUiToList(this.a_skill_3);
            this.addSkillUiToList(this.a_skill_4);
            this.addSkillUiToList(this.a_skill_5);
            this.refresh();
            TimeUtil.addFrameTick(function (t) { _this.update(t); });
            this.loadComplate = true;
        };
        FightSkillPanel.prototype.addEvntBut = function ($name, $uiRender) {
            var $temp = this.addChild($uiRender.getComponent($name));
            $temp.addEventListener(InteractiveEvent.Down, this.butClik, this);
            $temp.addEventListener(InteractiveEvent.Up, this.butUpClik, this);
            return $temp;
        };
        FightSkillPanel.prototype.butUpClik = function (evt) {
            console.log(evt.target);
        };
        //需要加上倒计时和CD技能
        FightSkillPanel.prototype.addSkillUiToList = function ($ui) {
            var $cdRender = this._cdRender;
            var $vo = new SkillUIVo();
            var $cd = this._cdRender.getComponent("a_cd_mask");
            var $alpha = 0.3;
            // $cd.colorVer = [1 * $alpha, 1 * $alpha, 1 * $alpha, $alpha];
            $cd.setCdNum(1);
            $cd.x = $ui.x + 1;
            $cd.y = $ui.y + 1;
            $vo.baseRect = new Rectangle($ui.x, $ui.y, $ui.width, $ui.height);
            this.addChild($cd);
            $vo.cd = $cd;
            $vo.iconUi = $ui;
            $vo.blackMask = this.addChild(this._midRender.getComponent("a_bleak_ui"));
            $vo.blackMask.x = $vo.iconUi.x;
            $vo.blackMask.y = $vo.iconUi.y;
            $vo.blackMask.width = $vo.iconUi.width;
            $vo.blackMask.height = $vo.iconUi.height;
            $vo.cdnumA = this.addChild(this._topRender.getComponent("a_cd_num"));
            $vo.cdnumB = this.addChild(this._topRender.getComponent("a_cd_num"));
            $vo.cdnumA.Invisible();
            $vo.cdnumB.Invisible();
            var $pos = new Vector2D(25, 22);
            $vo.cdnumB.y = $pos.y + $vo.iconUi.y;
            $vo.cdnumA.y = $pos.y + $vo.iconUi.y;
            this.skillList.push($vo);
        };
        FightSkillPanel.prototype.update = function (t) {
            for (var i = 0; i < this.skillList.length; i++) {
                var $skillUIVo = this.skillList[i];
                if ($skillUIVo.cd && $skillUIVo.cdnumA) {
                    var $k = TimeUtil.getTimer() - $skillUIVo.cd.lastTime;
                    if ($k < $skillUIVo.cd.cdTotalnum) {
                        var $pos = new Vector2D(25, 22);
                        var $second = Math.ceil(($skillUIVo.cd.cdTotalnum - $k) / 1000);
                        var $A = $second % 10;
                        $skillUIVo.cdnumA.goToAndStop($A);
                        var $B = Math.floor($second / 10);
                        $skillUIVo.cdnumB.goToAndStop($B);
                        if ($B <= 0) {
                            $skillUIVo.cdnumB.Invisible();
                            $skillUIVo.cdnumA.x = $pos.x + $skillUIVo.baseRect.x;
                        }
                        else {
                            $skillUIVo.cdnumB.x = $pos.x + $skillUIVo.baseRect.x - 8;
                            $skillUIVo.cdnumA.x = $pos.x + $skillUIVo.baseRect.x + 8;
                        }
                        $skillUIVo.blackMask.x = $skillUIVo.iconUi.x;
                    }
                    else {
                        $skillUIVo.cdnumB.Invisible();
                        $skillUIVo.cdnumA.Invisible();
                        $skillUIVo.blackMask.x = 2000;
                    }
                }
            }
        };
        //设置当前主技能的功能
        FightSkillPanel.prototype.loadBaseSkillIconById = function (value) {
            var $url = this.getPicToSkillById(value);
            this.drawPicToSkill($url);
            this.lastNeedShowUrl = $url;
        };
        FightSkillPanel.prototype.getPicToSkillById = function ($id) {
            return "ui/load/skill/" + $id + ".png";
        };
        FightSkillPanel.prototype.drawPicToSkill = function ($url) {
            var _this = this;
            if ($url != this.lastNeedShowUrl) {
                return;
            }
            if (this.skilImgKey[$url]) {
            }
            else {
                var img = new Image();
                img.onload = function () {
                    _this.skilImgKey[$url] = img;
                    _this.drawPicToSkill($url);
                };
                img.src = Scene_data.fileRoot + $url;
            }
        };
        FightSkillPanel.prototype.refresh = function () {
            tb.SkillData.resetSkillData();
            var $skillList = tb.SkillData.skillList;
            for (var i = 0; i < $skillList.length; i++) {
                var $vo = $skillList[i];
                if ($vo.slot >= 2 && $vo.slot <= 5) {
                    this.drawSkillIcon($vo);
                }
            }
        };
        FightSkillPanel.prototype.drawSkillIcon = function ($vo) {
            var $tempBut = this["a_skill_" + $vo.slot];
            this.drawPicToSkillBut($vo, $tempBut);
        };
        //给技能加上图标， 神兵和主动技能
        FightSkillPanel.prototype.drawPicToSkillBut = function ($vo, $ui) {
            var _this = this;
            $ui.data = $vo;
            LoadManager.getInstance().load(Scene_data.fileRoot + getSkillIconUrl(String($vo.tb_skill_base.icon)), LoadManager.IMG_TYPE, function ($img) {
                var $skillrec = _this._topRender.uiAtlas.getRec($ui.skinName);
                var $ctx = UIManager.getInstance().getContext2D($skillrec.pixelWitdh, $skillrec.pixelHeight, false);
                UiDraw.cxtDrawImg($ctx, PuiData.SKILL_BG68, new Rectangle(0, 0, 71, 71), UIData.publicUi);
                $ctx.drawImage($img, 4, 4, 62, 62);
                //推送至显卡
                _this._topRender.uiAtlas.updateCtx($ctx, $skillrec.pixelX, $skillrec.pixelY);
            });
            this.setSkillCdTime($ui);
        };
        FightSkillPanel.prototype.refreshCdBySkillId = function ($skillId) {
            if (this.loadComplate) {
                for (var i = 0; i < this.skillList.length; i++) {
                    var $skillUIVo = this.skillList[i];
                    var $skillVo = $skillUIVo.iconUi.data;
                    if ($skillVo && $skillVo.id == $skillId) {
                        $skillUIVo.cd.lastTime = TimeUtil.getTimer();
                    }
                }
            }
        };
        FightSkillPanel.prototype.setSkillCdTime = function ($ui) {
            for (var i = 0; i < this.skillList.length; i++) {
                var $skillUIVo = this.skillList[i];
                if ($skillUIVo.iconUi == $ui) {
                    var $skillBaseDataVo = $ui.data;
                    var $saveTime = tb.SkillData.getCdMeshBySkillId($skillBaseDataVo.id);
                    $skillUIVo.cd.cdTotalnum = $skillBaseDataVo.singleCD;
                    $skillUIVo.cd.lastTime = $saveTime - $skillBaseDataVo.singleCD;
                }
            }
        };
        return FightSkillPanel;
    }(UIPanel));
    fightui.FightSkillPanel = FightSkillPanel;
})(fightui || (fightui = {}));
//# sourceMappingURL=FightSkillPanel.js.map