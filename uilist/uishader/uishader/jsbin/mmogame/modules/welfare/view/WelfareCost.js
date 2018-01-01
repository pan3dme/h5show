var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var welfare;
(function (welfare) {
    var WelfareCost = (function (_super) {
        __extends(WelfareCost, _super);
        function WelfareCost() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            // this._bottomRender = new UIRenderComponent;
            // this.addRender(this._bottomRender)
            this._bigPic = new UIRenderOnlyPicComponent();
            this.addRender(this._bigPic);
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            // this._topRender = new UIRenderComponent;
            // this.addRender(this._topRender)
        }
        WelfareCost.prototype.dispose = function () {
            this._bigPic.dispose();
            this._bigPic = null;
            this._baseRender.dispose();
            this._baseRender = null;
            if (this.welfarCostList) {
                this.welfarCostList.dispose();
                this.welfarCostList = null;
            }
        };
        WelfareCost.prototype.initUiAtlas = function ($uiAtlas) {
            // this._bottomRender.uiAtlas = $uiAtlas;
            this._bigPic.uiAtlas = $uiAtlas;
            this._baseRender.uiAtlas = $uiAtlas;
            // this._topRender.uiAtlas = $uiAtlas;
            this.initView();
        };
        WelfareCost.prototype.initView = function () {
            var renderLevel = this._baseRender;
            //大背景
            this.addChild(this._bigPic.getComponent("b_pic"));
            this._bigPic.setImgUrl("ui/uidata/welfare/adbg.png");
            var t_info = this.addChild(renderLevel.getComponent("t_info"));
            var tab = tb.TB_welfare_base.get_TB_welfare_baseById(1);
            LabelTextFont.writeTextAutoVerticalCenter(this._baseRender.uiAtlas, t_info.skinName, "活动说明：" + tab.expense_info, 16, ColorType.Brown40120a, 545, "", true);
            // var tabvo: Array<tb.TB_welfare_level_show> = tb.TB_welfare_level_show.get_TB_welfare_level_show();
            // for (var i = 0; i < tabvo[0].item.length; i++) {
            //     var aa: UICompenent = this.addEvntButUp("l_reward" + i, renderLevel);
            //     aa.data = tabvo[0].item[i]
            //     this.drawReward(aa);
            // }
            // this.addChild(<UICompenent>renderLevel.getComponent("a_37"));
            // this.addChild(<UICompenent>renderLevel.getComponent("a_36"));
            // this._lev = this.addChild(<UICompenent>renderLevel.getComponent("lev"));
            this.slistIndex2 = this.addChild(renderLevel.getComponent("slistIndex2"));
        };
        WelfareCost.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.welfarCostList) {
                this.welfarCostList.left = this.slistIndex2.parent.x / UIData.Scale + this.slistIndex2.x;
                this.welfarCostList.top = this.slistIndex2.parent.y / UIData.Scale + this.slistIndex2.y;
            }
        };
        WelfareCost.prototype.show = function () {
            UIManager.getInstance().addUIContainer(this);
            //请求数据
            this.resetData();
        };
        WelfareCost.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
            if (this.welfarCostList) {
                this.welfarCostList.hide();
            }
        };
        WelfareCost.prototype.resetData = function () {
            if (!this.welfarCostList) {
                this.welfarCostList = new WelfarCostList();
                this.welfarCostList.init(this._baseRender.uiAtlas);
            }
            this.welfarCostList.show();
            this.resize();
        };
        return WelfareCost;
    })(UIVirtualContainer);
    welfare.WelfareCost = WelfareCost;
    /**
     * 消费有奖list
     */
    var WelfarCostList = (function (_super) {
        __extends(WelfarCostList, _super);
        function WelfarCostList() {
            _super.call(this);
            this.left = 222;
            this.top = 192;
        }
        WelfarCostList.prototype.init = function ($uiAtlas) {
            this.baseAtlas = $uiAtlas;
            this.initData();
        };
        WelfarCostList.prototype.initData = function () {
            var $ary = new Array();
            this.setData($ary, welfare.WelfareGeneralListRender, 681, 319, 0, 83, 3, 512, 512, 1, 6);
        };
        WelfarCostList.prototype.compareAry = function ($ary) {
            if ($ary.length != this._everycheckinlist.length) {
                return true;
            }
            for (var i = 0; i < $ary.length; i++) {
                if ($ary[i].state != this._everycheckinlist[i].state) {
                    return true;
                }
            }
            return false;
        };
        WelfarCostList.prototype.refreshDataByNewData = function () {
            var $flag = true;
            var a = GuidData.quest.getCostRewardList();
            if (this._everycheckinlist) {
                $flag = this.compareAry(a);
            }
            if ($flag) {
                console.log("数据变化了");
                this._everycheckinlist = a;
                var $sListItemData = this.getData(this._everycheckinlist);
                this.refreshData($sListItemData);
            }
        };
        WelfarCostList.prototype.getData = function ($data) {
            var ary = new Array;
            for (var i = 0; i < $data.length; i++) {
                var item = new SListItemData;
                item.data = $data[i];
                item.id = i;
                ary.push(item);
            }
            return ary;
        };
        WelfarCostList.prototype.show = function () {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
            }
            this.refreshAndselectIndex();
        };
        WelfarCostList.prototype.refreshAndselectIndex = function () {
            // var num: number = Math.floor(GuidData.quest.getcurDays() / 7);
            // console.log("num----", num);
            // this.scrollY(100);
            this.refreshDataByNewData();
        };
        WelfarCostList.prototype.hide = function () {
            if (this.hasStage)
                UIManager.getInstance().removeUIContainer(this);
        };
        return WelfarCostList;
    })(SList);
    welfare.WelfarCostList = WelfarCostList;
})(welfare || (welfare = {}));
//# sourceMappingURL=WelfareCost.js.map