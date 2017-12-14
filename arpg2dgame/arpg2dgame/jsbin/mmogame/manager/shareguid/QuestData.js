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
var QuestDataVo = /** @class */ (function () {
    function QuestDataVo() {
    }
    return QuestDataVo;
}());
var QuestDataMeshVo = /** @class */ (function () {
    function QuestDataMeshVo() {
    }
    return QuestDataMeshVo;
}());
var QuestData = /** @class */ (function (_super) {
    __extends(QuestData, _super);
    function QuestData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuestData.prototype.onBaseCreated = function () {
        var _this = this;
        // console.log("QuestData onBaseCreated");
        this.refreshTitleList();
        this._after_update = function ($flag, $intMask, $strMask) { _this.dataUpdate($intMask, $strMask); };
        ModuleEventManager.dispatchEvent(new EngineEvent(EngineEvent.CORE_DATA_CREATED_EVENT));
    };
    QuestData.prototype.dataUpdate = function ($intMask, $strMask) {
    };
    QuestData.prototype.hasTitleVo = function ($changevo) {
        for (var i = 0; i < this.titleAry.length; i++) {
            if ($changevo.id == this.titleAry[i].id) {
                return false;
            }
        }
        return true;
    };
    QuestData.prototype.getTaskList = function () {
        if (!this._questDataItem) {
            this._questDataItem = new Array();
            for (var i = 0; i < SharedDef.MAX_QUEST_INFO_COUNT; i++) {
                var $temp = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_QUEST_START, i);
                if ($temp) {
                    this._questDataItem.push($temp);
                    //  console.log(this._questDataItem.length, $temp.id)
                }
            }
            var $escortQuestVo = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_ESCORT_QUEST_START, 0);
            if ($escortQuestVo) {
                this._questDataItem.push($escortQuestVo);
            }
            this._questDataItem.sort(function (a, b) {
                return a.taskState - b.taskState;
            });
            //    console.log(this._questDataItem)
        }
        return this._questDataItem;
    };
    QuestData.prototype.getDaliyQuestList = function () {
        if (!this._dailyQuestDataItem) {
            this._dailyQuestDataItem = this.refreshDailyQuestVo();
        }
        //console.log("--this._dailyQuestDataItem--",this._dailyQuestDataItem);
        return this._dailyQuestDataItem;
    };
    QuestData.prototype.refreshDailyQuestVo = function () {
        var dailyQuestDataItem = new Array();
        for (var i = 0; i < SharedDef.MAX_QUEST_INFO_COUNT; i++) {
            var $temp = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_DAILY2_QUEST_START, i);
            if ($temp) {
                dailyQuestDataItem.push($temp);
            }
        }
        return dailyQuestDataItem;
    };
    QuestData.prototype.getTrainingTaskList = function () {
        if (!this._trainingTaskDataItem) {
            this._trainingTaskDataItem = this.refreshTrainingTaskList();
        }
        return this._trainingTaskDataItem;
    };
    QuestData.prototype.refreshTrainingTaskList = function () {
        var trainingTaskDataItem = new Array();
        for (var i = 0; i < SharedDef.MAX_ADVENTURE_QUEST_COUNT; i++) {
            var $temp = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_ADVENTURE_QUEST_START, i);
            if ($temp) {
                trainingTaskDataItem.push($temp);
            }
        }
        return trainingTaskDataItem;
    };
    QuestData.prototype.changeQuestDataByKey = function ($startindex, indx) {
        var intStart = $startindex + indx * SharedDef.MAX_QUEST_INFO_COUNT;
        var $taskId = this.GetUInt16(intStart + SharedDef.QUEST_INFO_ID, 0);
        var $taskState = this.GetUInt16(intStart + SharedDef.QUEST_INFO_ID, 1);
        if ($taskId != 0) {
            //console.log("任务id", $taskId)
            var $questDataVo = new QuestDataVo();
            $questDataVo.id = $taskId;
            $questDataVo.indx = indx;
            $questDataVo.taskState = $taskState;
            $questDataVo.items = new Array;
            for (var i = SharedDef.QUEST_INFO_STEP_START; i < SharedDef.QUEST_INFO_STEP_END; i += SharedDef.MAX_QUEST_TARGET_INFO_COUNT) {
                var targetIntStart = intStart + i;
                var $state = this.GetUInt16(targetIntStart + SharedDef.QUEST_TARGET_INFO_SHORT0, 0); //目标:状态
                var $num = this.GetUInt16(targetIntStart + SharedDef.QUEST_TARGET_INFO_SHORT0, 1); //目标:值
                var $process = this.GetUInt32(targetIntStart + SharedDef.QUEST_TARGET_INFO_PROCESS); //进度
                if ($num != 0) {
                    //console.log("目标:", $state)
                    //console.log("值", $num)
                    //console.log("进度", $process)
                    var $obj = new QuestDataMeshVo();
                    $obj.state = $state;
                    $obj.num = $num;
                    $obj.process = $process;
                    $questDataVo.items.push($obj);
                }
            }
            return $questDataVo;
        }
        else {
            return null;
        }
    };
    QuestData.prototype.getAchieveInfo = function ($id) {
        var idx = ($id - 1) * SharedDef.MAX_ACHIEVE_FIELD + SharedDef.QUEST_FIELD_ACHIEVE_START;
        var obj = new AchieveItemData;
        obj.hasReach = this.GetByte(idx + SharedDef.ACHIEVE_FIELD_REWARD, 1) == 1 ? true : false;
        obj.hasReward = this.GetByte(idx + SharedDef.ACHIEVE_FIELD_REWARD, 0) == 1 ? true : false;
        obj.progress = this.GetUInt32(idx + SharedDef.ACHIEVE_FIELD_CURRENT);
        obj.id = $id;
        return obj;
    };
    /**成就点 */
    QuestData.prototype.getAchieveAllNum = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_ACHIEVE_ALL);
    };
    /**总成就奖励ID */
    QuestData.prototype.getAchieveAllRewardID = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_ACHIEVE_REWARD);
    };
    /**是否领取首冲奖励 */
    QuestData.prototype.IsReceiveShouChongReward = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_WELFARE_SHOUCHONG) == 1;
    };
    /**每日签到奖励领取标记数据 */
    QuestData.prototype.getSigninEveryDayList = function () {
        var $aryflag = new Array;
        for (var i = 0; i < 32; i++) {
            $aryflag.push(this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN, i));
        }
        return $aryflag;
    };
    /**每日签到vo数据 */
    QuestData.prototype.getSigninEveryDayVoList = function () {
        var $aryflag = new Array;
        // $aryflag.splice
        for (var i = 0; i < this.getcurMonthDays(); i++) {
            var tabvo = tb.TB_welfare_checkin.get_TB_welfare_checkinById(i + 1);
            var bb = new SigninEveryDayItemData();
            bb.data = tabvo;
            var isreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN, i);
            if (isreceive) {
                //已领取
                bb.state = 3;
            }
            else {
                //未领取
                if (this.getcurDays() > (i + 1)) {
                    bb.state = 4;
                }
                else if (this.getcurDays() == (i + 1)) {
                    bb.state = 2;
                }
                else {
                    bb.state = 1;
                }
            }
            $aryflag.push(bb);
        }
        return $aryflag;
    };
    QuestData.prototype.getcurDays = function () {
        var $ts = GameInstance.getServerNow();
        var $sever = new Date($ts * 1000);
        return $sever.getDate();
    };
    QuestData.prototype.getLoginDay = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_WELFARE_SEVEN_DAY_PROCESS);
    };
    /**
     * 获取当月共有多少天
     */
    QuestData.prototype.getcurMonthDays = function () {
        //获取当月共有多少天
        var d = new Date();
        //d.getMonth()+1代表下个月，月份索引从0开始，即当前月为6月时，getMonth()返回值为5，创建日期时同理
        //此处构造的日期为下个月的第0天，天数索引从1开始，第0天即代表上个月的最后一天
        var curMonthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
        // console.log("本月共有 " + curMonthDays + " 天");
        return curMonthDays;
    };
    /**累计签到vo数据 */
    QuestData.prototype.getSigninWeekList = function () {
        var $aryflagall = new Array;
        for (var i = 0; i < 5; i++) {
            var tabvo = tb.TB_welfare_checkin_all.get_TB_welfare_checkin_allById(i + 1);
            var aa = new SigninWeekItemData();
            aa.data = tabvo;
            var canreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN_ALL, (i + 1));
            if (!canreceive) {
                //未领取
                if (this.getSigninDayNum() >= tabvo.num) {
                    aa.state = 2;
                }
                else {
                    aa.state = 1;
                }
            }
            else {
                //已领取
                aa.state = 3;
            }
            $aryflagall.push(aa);
        }
        return $aryflagall;
    };
    /**升级奖励vo数据 */
    QuestData.prototype.getLevelUpRewardList = function () {
        var $aryflaglevelup = new Array;
        var $arytabvo = tb.TB_welfare_level.get_TB_welfare_level();
        for (var i = 0; i < $arytabvo.length; i++) {
            var cc = new LevelUpRewardItemData();
            cc.data = $arytabvo[i];
            var isreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_LEVEL, i);
            if (isreceive) {
                cc.state = 3;
            }
            else {
                // console.log("---当前等级----", GuidData.player.getLevel());
                if (GuidData.player.getLevel() >= $arytabvo[i].lev) {
                    cc.state = 1;
                }
                else {
                    cc.state = 2;
                }
            }
            $aryflaglevelup.push(cc);
        }
        $aryflaglevelup.sort(function (a, b) {
            if (a.state == b.state) {
                if (a.data.id < b.data.id) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (a.state < b.state) {
                return -1;
            }
            else {
                return 1;
            }
        });
        return $aryflaglevelup;
    };
    /**消耗奖励vo数据 */
    QuestData.prototype.getCostRewardList = function () {
        var $aryflaglevelup = new Array;
        var $arytabvo = tb.TB_welfare_consume.get_TB_welfare_consume();
        for (var i = 0; i < $arytabvo.length; i++) {
            var cc = new CostRewardItemData();
            cc.data = $arytabvo[i];
            var isreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CONSUME_REWARD_FLAG, i);
            if (isreceive) {
                cc.state = 3;
            }
            else {
                // console.log("---当前等级----", GuidData.player.getLevel());
                if (GuidData.player.getConsume() >= $arytabvo[i].money) {
                    cc.state = 1;
                }
                else {
                    cc.state = 2;
                }
            }
            cc.type = SharedDef.MODULE_WELFARE_CONSUME;
            $aryflaglevelup.push(cc);
        }
        $aryflaglevelup.sort(function (a, b) {
            if (a.state == b.state) {
                if (a.data.id < b.data.id) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (a.state < b.state) {
                return -1;
            }
            else {
                return 1;
            }
        });
        return $aryflaglevelup;
    };
    /** 充值返利 vo数据 */
    QuestData.prototype.getRechargeRewardList = function () {
        var $aryflaglevelup = new Array;
        var $arytabvo = tb.TB_welfare_recharge.get_TB_welfare_recharge();
        for (var i = 0; i < $arytabvo.length; i++) {
            var cc = new RechargeRewardItemData();
            cc.data = $arytabvo[i];
            var isreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_RECHARGE_REWARD_FLAG, i);
            if (isreceive) {
                cc.state = 3;
            }
            else {
                if (GuidData.player.getChongZhiSum() >= $arytabvo[i].money) {
                    cc.state = 1;
                }
                else {
                    cc.state = 2;
                }
            }
            cc.type = SharedDef.MODULE_WELFARE_RECHARGE;
            $aryflaglevelup.push(cc);
        }
        $aryflaglevelup.sort(function (a, b) {
            if (a.state == b.state) {
                if (a.data.id < b.data.id) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (a.state < b.state) {
                return -1;
            }
            else {
                return 1;
            }
        });
        return $aryflaglevelup;
    };
    /** 七日礼物 vo数据 */
    QuestData.prototype.getSevenDayList = function () {
        var $aryflaglevelup = new Array;
        var $arytabvo = tb.TB_welfare_sevengift.get_TB_welfare_sevengift();
        for (var i = 0; i < $arytabvo.length; i++) {
            var cc = new SevenDayaItemData();
            cc.data = $arytabvo[i];
            var isreceive = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_SEVEN_DAY_FLAG, i);
            if (isreceive) {
                cc.state = 0;
            }
            else {
                if (this.getLoginDay() >= i + 1) {
                    cc.state = 1;
                }
                else {
                    cc.state = 2;
                }
            }
            $aryflaglevelup.push(cc);
        }
        return $aryflaglevelup;
    };
    /**本月累计签到几天 */
    QuestData.prototype.getSigninDayNum = function () {
        var $totalnum = 0;
        var $ary = this.getSigninEveryDayList();
        for (var i = 0; i < $ary.length; i++) {
            if ($ary[i]) {
                $totalnum++;
            }
        }
        // console.log("------累计签到-----", $totalnum);
        return $totalnum;
    };
    /**
     * 活动找回vo数据
     */
    QuestData.prototype.getBackList = function () {
        var $ary = new Array;
        var $arytabvo = tb.TB_welfare_back.get_TB_welfare_back();
        for (var i = 0; i < $arytabvo.length; i++) {
            var dd = new RewardBackItemData();
            dd.data = $arytabvo[i];
            var $kNum = SharedDef.QUEST_FIELD_WELFARE_BACK_START + SharedDef.WELFA_BACK_ITEM_NUM + (i * SharedDef.MAX_WELFA_BACK_ITEM);
            dd.num = this.GetUInt32($kNum);
            if (dd.num == 0) {
                dd.state = 2;
            }
            else {
                dd.state = 1;
            }
            $ary.push(dd);
        }
        $ary.sort(function (a, b) {
            if (a.state == b.state) {
                if (a.data.id < b.data.id) {
                    return -1;
                }
                else {
                    return 1;
                }
            }
            else if (a.state < b.state) {
                return -1;
            }
            else {
                return 1;
            }
        });
        return $ary;
    };
    QuestData.prototype.getTitleList = function () {
        if (this.titleAry) {
            return this.titleAry;
        }
        this.titleAry = new Array;
        this.refreshTitleList();
        return this.titleAry;
    };
    QuestData.prototype.getrefreshByidx = function ($Idx) {
        var tid = this.GetUInt16($Idx, 0);
        if (tid != 0) {
            var tObj = new TitleItemData();
            tObj.id = tid;
            tObj.init = (this.GetUInt16($Idx, 1) == 1);
            tObj.time = this.GetUInt32($Idx + SharedDef.TITLE_FIELD_TIME);
            return tObj;
        }
        else {
            return null;
        }
    };
    QuestData.prototype.refreshTitleList = function () {
        if (!this.titleAry) {
            this.titleAry = new Array;
        }
        this.titleAry.length = 0;
        for (var i = SharedDef.QUEST_FIELD_TITLE_START; i < SharedDef.QUEST_FIELD_TITLE_END; i += SharedDef.MAX_TITLE_FIELD) {
            var tid = this.GetUInt16(i, 0);
            if (tid != 0) {
                var tObj = new TitleItemData();
                tObj.id = tid;
                tObj.init = (this.GetUInt16(i, 1) == 1);
                tObj.time = this.GetUInt32(i + SharedDef.TITLE_FIELD_TIME);
                this.titleAry.push(tObj);
            }
        }
    };
    QuestData.prototype.traceAchieve = function (obj) {
        console.log("成就ID:" + obj.id + (obj.hasReach ? " 已完成" : " 未完成") + (obj.hasReward ? " 已领奖" : " 未领奖") + " 当前进度：" + obj.progress);
    };
    QuestData.prototype.traceTitle = function () {
        console.log("------称号列表_id-----------------", this._id);
        // console.log("称号ID:" + this.titleAry[i].id + " 失效时间：" + this.titleAry[i].time);
        for (var i = 0; i < this.titleAry.length; i++) {
            console.log("------称号列表-----------------", this.titleAry[i].id, this.titleAry[i]);
            if (this.titleAry[i].id != this._id) {
                this._id = this.titleAry[i].id;
            }
        }
    };
    //日常任务完成个数
    QuestData.prototype.getDailyQuestCompleteNum = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_DAILY2_FINISHED);
    };
    //日常任务是否提交
    QuestData.prototype.getDailyQuestSubmitState = function () {
        return this.GetUInt32(SharedDef.QUEST_FIELD_DAILY2_SUBMIT) > 0;
    };
    return QuestData;
}(GuidObject));
var AchieveItemData = /** @class */ (function () {
    function AchieveItemData() {
    }
    return AchieveItemData;
}());
var TitleItemData = /** @class */ (function () {
    function TitleItemData() {
    }
    return TitleItemData;
}());
/** 累计签到vo */
var SigninWeekItemData = /** @class */ (function () {
    function SigninWeekItemData() {
    }
    return SigninWeekItemData;
}());
/** 每日签到vo */
var SigninEveryDayItemData = /** @class */ (function () {
    function SigninEveryDayItemData() {
    }
    return SigninEveryDayItemData;
}());
/** 升级奖励vo */
var LevelUpRewardItemData = /** @class */ (function () {
    function LevelUpRewardItemData() {
    }
    return LevelUpRewardItemData;
}());
/** 消耗奖励vo */
var CostRewardItemData = /** @class */ (function () {
    function CostRewardItemData() {
    }
    return CostRewardItemData;
}());
/** 充值返利vo */
var RechargeRewardItemData = /** @class */ (function () {
    function RechargeRewardItemData() {
    }
    return RechargeRewardItemData;
}());
/** 七日礼物vo */
var SevenDayaItemData = /** @class */ (function () {
    function SevenDayaItemData() {
    }
    return SevenDayaItemData;
}());
/** 活动找回vo */
var RewardBackItemData = /** @class */ (function () {
    function RewardBackItemData() {
    }
    return RewardBackItemData;
}());
//# sourceMappingURL=QuestData.js.map