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
var materialui;
(function (materialui) {
    var MenuListData = /** @class */ (function () {
        function MenuListData($label, $key) {
            if ($key === void 0) { $key = null; }
            this.label = $label;
            if ($key) {
                this.key = $key;
            }
            else {
                this.key = $label;
            }
        }
        return MenuListData;
    }());
    materialui.MenuListData = MenuListData;
    var RightMenuVo = /** @class */ (function (_super) {
        __extends(RightMenuVo, _super);
        function RightMenuVo() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RightMenuVo.prototype.initData = function ($panel, $bottomRender, $midRender, $data, $frameId, $isSub) {
            if ($isSub === void 0) { $isSub = false; }
            this.panel = $panel;
            this.data = $data;
            if ($isSub) {
                this.txt = this.panel.addEvntBut("b_sub_menu", $midRender);
            }
            else {
                this.txt = this.panel.addEvntBut("b_main_menu", $midRender);
            }
            this.txt.goToAndStop($frameId);
            this.bottomRender = $bottomRender;
            this.drawFrontToFrame(this.txt, ColorType.Black000000 + $data.label);
            this.bg = this.panel.addChild($bottomRender.getComponent("b_menu_color"));
            this.bg.goToAndStop(0);
            this.bg.width = this.txt.width;
            this.bg.height = this.txt.height;
            this.bg.addEventListener(InteractiveEvent.Move, this.butMove, this);
        };
        RightMenuVo.prototype.removeStage = function () {
            this.panel.removeChild(this.txt);
            this.panel.removeChild(this.bg);
        };
        RightMenuVo.prototype.butMove = function (evt) {
            this.panel.moseMoveTo(evt.target);
        };
        Object.defineProperty(RightMenuVo.prototype, "x", {
            set: function (value) {
                this._x = value;
                this.bg.x = this._x;
                this.txt.x = this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RightMenuVo.prototype, "y", {
            set: function (value) {
                this._y = value;
                this.bg.y = this._y;
                this.txt.y = this._y;
            },
            enumerable: true,
            configurable: true
        });
        RightMenuVo.prototype.drawFrontToFrame = function ($ui, $str, $align) {
            if ($align === void 0) { $align = TextAlign.CENTER; }
            var $toRect = $ui.getSkinCtxRect();
            var $ctx = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this.bottomRender.uiAtlas, $ctx);
        };
        return RightMenuVo;
    }(UICompenent));
    materialui.RightMenuVo = RightMenuVo;
    var RightMenuPanel = /** @class */ (function (_super) {
        __extends(RightMenuPanel, _super);
        function RightMenuPanel() {
            var _this = _super.call(this) || this;
            _this.width = 200;
            _this.height = 200;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this._bottomRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this._midRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this._topRender.uiAtlas = materialui.BaseMaterialNodeUI.baseUIAtlas;
            _this.loadConfigCom();
            return _this;
        }
        RightMenuPanel.prototype.initMainMenu = function () {
            this.menuTextItem = new Array();
            this.menuTextItem.push(this.getMathListData());
            this.menuTextItem.push(new MenuListData("常数", "2"));
            this.menuTextItem.push(this.getTextureListData());
            this.mainMenuUiArr = new Array();
            this.subMenuUiArr = new Array;
            for (var i = 0; i < this.menuTextItem.length; i++) {
                var $vo = new RightMenuVo;
                $vo.initData(this, this._bottomRender, this._midRender, this.menuTextItem[i], i);
                $vo.y = i * 21;
                $vo.x = 0;
                this.mainMenuUiArr.push($vo);
            }
        };
        RightMenuPanel.prototype.getMathListData = function () {
            var $vo = new MenuListData("Math", "1");
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("ADD", "11"));
            $vo.subMenu.push(new MenuListData("SUB", "12"));
            $vo.subMenu.push(new MenuListData("MUL", "13"));
            return $vo;
        };
        RightMenuPanel.prototype.getTextureListData = function () {
            var $vo = new MenuListData("纹理", "3");
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("纹理贴图", "31"));
            return $vo;
        };
        RightMenuPanel.prototype.moseMoveTo = function ($ui) {
            var isSub = false;
            for (var j = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].bg == $ui) {
                    this.subMenuUiArr[j].bg.goToAndStop(1);
                    isSub = true;
                }
                else {
                    this.subMenuUiArr[j].bg.goToAndStop(0);
                }
            }
            if (!isSub) {
                for (var i = 0; i < this.mainMenuUiArr.length; i++) {
                    if (this.mainMenuUiArr[i].bg == $ui) {
                        this.mainMenuUiArr[i].bg.goToAndStop(1);
                        this.showSubMenu(this.mainMenuUiArr[i].data.subMenu, i);
                    }
                    else {
                        this.mainMenuUiArr[i].bg.goToAndStop(0);
                    }
                }
            }
        };
        RightMenuPanel.prototype.clearSubMenu = function () {
            while (this.subMenuUiArr.length) {
                var $vo = this.subMenuUiArr.pop();
                $vo.removeStage();
            }
            this.lastShowsubMenu = null;
        };
        RightMenuPanel.prototype.showSubMenu = function ($subMenu, ty) {
            if ($subMenu) {
                if (this.lastShowsubMenu != $subMenu) {
                    this.clearSubMenu();
                    for (var i = 0; i < $subMenu.length; i++) {
                        var $vo = new RightMenuVo;
                        $vo.initData(this, this._bottomRender, this._midRender, $subMenu[i], i, true);
                        $vo.y = (ty + i) * 21;
                        $vo.x = 102;
                        this.subMenuUiArr.push($vo);
                    }
                }
            }
            else {
                this.clearSubMenu();
            }
            this.lastShowsubMenu = $subMenu;
        };
        RightMenuPanel.prototype.butClik = function (evt) {
            var $ui = evt.target;
            var seleceVo;
            for (var j = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].txt == $ui) {
                    seleceVo = this.subMenuUiArr[j];
                }
            }
            for (var i = 0; i < this.mainMenuUiArr.length; i++) {
                if (this.mainMenuUiArr[i].txt == $ui) {
                    seleceVo = this.mainMenuUiArr[i];
                }
            }
            if (seleceVo) {
                switch (seleceVo.data.key) {
                    case "1":
                        break;
                    case "2":
                        break;
                    case "3":
                        break;
                    case "4":
                        break;
                    case "11":
                        this.onAddNode(evt);
                        break;
                    case "31":
                        this.onAddTextureSampleNodeUI(evt);
                        break;
                    default:
                        break;
                }
                console.log(seleceVo.data.key);
                ModuleEventManager.dispatchEvent(new materialui.RightMenuEvent(materialui.RightMenuEvent.HIDE_RIGHT_MENU));
            }
        };
        RightMenuPanel.prototype.onAddTextureSampleNodeUI = function (evt) {
            var $ui = new materialui.TextureSampleNodeUI();
            $ui.left = evt.x / UIData.Scale - 200;
            $ui.top = evt.y / UIData.Scale - 30;
            materialui.MaterialCtrl.getInstance().addNodeUI($ui);
        };
        RightMenuPanel.prototype.onAddNode = function (evt) {
            var $ui = new materialui.MathAddNodeUI();
            $ui.left = evt.x / UIData.Scale - 200;
            $ui.top = evt.y / UIData.Scale - 30;
            materialui.MaterialCtrl.getInstance().addNodeUI($ui);
        };
        RightMenuPanel.prototype.drawFrontToFrame = function ($ui, $str, $align) {
            if ($align === void 0) { $align = TextAlign.CENTER; }
            var $toRect = $ui.getSkinCtxRect();
            var $ctx = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        };
        RightMenuPanel.prototype.loadConfigCom = function () {
            this.initMainMenu();
        };
        RightMenuPanel.prototype.refrish = function () {
            this.clearSubMenu();
        };
        return RightMenuPanel;
    }(UIPanel));
    materialui.RightMenuPanel = RightMenuPanel;
})(materialui || (materialui = {}));
//# sourceMappingURL=RightMenuPanel.js.map