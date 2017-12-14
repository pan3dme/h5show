class QuestDataVo {
    public id: number;
    public indx: number
    public taskState: number
    public items: Array<QuestDataMeshVo>;
}
class QuestDataMeshVo {
    public state: number;
    public num: number;
    public process: number;

}


class QuestData extends GuidObject {

    public onBaseCreated(): void {
        // console.log("QuestData onBaseCreated");
        this.refreshTitleList();
        this._after_update = ($flag: number, $intMask: Object, $strMask: Object) => { this.dataUpdate($intMask, $strMask) };
        ModuleEventManager.dispatchEvent(new EngineEvent(EngineEvent.CORE_DATA_CREATED_EVENT));
    }
    private dataUpdate($intMask: Object, $strMask: Object): void {
       
    }

    private hasTitleVo($changevo: TitleItemData): boolean {
        for (var i = 0; i < this.titleAry.length; i++) {
            if ($changevo.id == this.titleAry[i].id) {
                return false;
            }
        }
        return true;
    }

    private _questDataItem: Array<QuestDataVo>
    public getTaskList(): Array<QuestDataVo> {
        if (!this._questDataItem) {
            this._questDataItem = new Array()
            for (var i: number = 0; i < SharedDef.MAX_QUEST_INFO_COUNT; i++) {
                var $temp: QuestDataVo = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_QUEST_START, i)
                if ($temp) {
                    this._questDataItem.push($temp);
                    //  console.log(this._questDataItem.length, $temp.id)
                }
            }
            var $escortQuestVo: QuestDataVo = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_ESCORT_QUEST_START, 0)
            if ($escortQuestVo) {
                this._questDataItem.push($escortQuestVo);
            }
            this._questDataItem.sort(
                function (a: QuestDataVo, b: QuestDataVo): number {
                    return a.taskState - b.taskState;
                }
            )
            //    console.log(this._questDataItem)
        }
        return this._questDataItem
    }


    private _dailyQuestDataItem: Array<QuestDataVo>
    public getDaliyQuestList(): Array<QuestDataVo> {
        if (!this._dailyQuestDataItem) {
            this._dailyQuestDataItem = this.refreshDailyQuestVo();
        }
        //console.log("--this._dailyQuestDataItem--",this._dailyQuestDataItem);
        return this._dailyQuestDataItem;
    }

    private refreshDailyQuestVo(): Array<QuestDataVo> {
        var dailyQuestDataItem = new Array();
        for (var i: number = 0; i < SharedDef.MAX_QUEST_INFO_COUNT; i++) {
            var $temp: QuestDataVo = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_DAILY2_QUEST_START, i)
            if ($temp) {
                dailyQuestDataItem.push($temp);
            }
        }
        return dailyQuestDataItem;
    }

    /**
     * 历练任务
     */
    private _trainingTaskDataItem: Array<QuestDataVo>
    public getTrainingTaskList(): Array<QuestDataVo> {
        if (!this._trainingTaskDataItem) {
            this._trainingTaskDataItem = this.refreshTrainingTaskList();
        }
        return this._trainingTaskDataItem;
    }

    private refreshTrainingTaskList(): Array<QuestDataVo> {
        var trainingTaskDataItem = new Array();
        for (var i: number = 0; i < SharedDef.MAX_ADVENTURE_QUEST_COUNT; i++) {
            var $temp: QuestDataVo = this.changeQuestDataByKey(SharedDef.QUEST_FIELD_ADVENTURE_QUEST_START, i)
            if ($temp) {
                trainingTaskDataItem.push($temp);
            }
        }
        return trainingTaskDataItem;
    }


    private changeQuestDataByKey($startindex: number, indx: number): QuestDataVo {

        var intStart: number = $startindex + indx * SharedDef.MAX_QUEST_INFO_COUNT;
        var $taskId: number = this.GetUInt16(intStart + SharedDef.QUEST_INFO_ID, 0);
        var $taskState: number = this.GetUInt16(intStart + SharedDef.QUEST_INFO_ID, 1);

        if ($taskId != 0) {
            //console.log("任务id", $taskId)
            var $questDataVo: QuestDataVo = new QuestDataVo()
            $questDataVo.id = $taskId;
            $questDataVo.indx = indx;
            $questDataVo.taskState = $taskState;
            $questDataVo.items = new Array
            for (var i: number = SharedDef.QUEST_INFO_STEP_START; i < SharedDef.QUEST_INFO_STEP_END; i += SharedDef.MAX_QUEST_TARGET_INFO_COUNT) {
                var targetIntStart: number = intStart + i;
                var $state: number = this.GetUInt16(targetIntStart + SharedDef.QUEST_TARGET_INFO_SHORT0, 0); //目标:状态
                var $num: number = this.GetUInt16(targetIntStart + SharedDef.QUEST_TARGET_INFO_SHORT0, 1); //目标:值
                var $process: number = this.GetUInt32(targetIntStart + SharedDef.QUEST_TARGET_INFO_PROCESS); //进度

                if ($num != 0) {
                    //console.log("目标:", $state)
                    //console.log("值", $num)
                    //console.log("进度", $process)

                    var $obj: QuestDataMeshVo = new QuestDataMeshVo();
                    $obj.state = $state;
                    $obj.num = $num;
                    $obj.process = $process;
                    $questDataVo.items.push($obj);
                }
            }

            return $questDataVo
        } else {
            return null
        }

    }

    public getAchieveInfo($id: number): AchieveItemData {
        var idx: number = ($id - 1) * SharedDef.MAX_ACHIEVE_FIELD + SharedDef.QUEST_FIELD_ACHIEVE_START;
        var obj: AchieveItemData = new AchieveItemData;
        obj.hasReach = this.GetByte(idx + SharedDef.ACHIEVE_FIELD_REWARD, 1) == 1 ? true : false;
        obj.hasReward = this.GetByte(idx + SharedDef.ACHIEVE_FIELD_REWARD, 0) == 1 ? true : false;
        obj.progress = this.GetUInt32(idx + SharedDef.ACHIEVE_FIELD_CURRENT);
        obj.id = $id;
        return obj
    }
    /**成就点 */
    public getAchieveAllNum(): number {
        return this.GetUInt32(SharedDef.QUEST_FIELD_ACHIEVE_ALL);
    }
    /**总成就奖励ID */
    public getAchieveAllRewardID(): number {
        return this.GetUInt32(SharedDef.QUEST_FIELD_ACHIEVE_REWARD);
    }
    /**是否领取首冲奖励 */
    public IsReceiveShouChongReward(): boolean {
        return this.GetUInt32(SharedDef.QUEST_FIELD_WELFARE_SHOUCHONG) == 1;
    }
    /**每日签到奖励领取标记数据 */
    public getSigninEveryDayList(): Array<boolean> {
        var $aryflag: Array<boolean> = new Array
        for (var i: number = 0; i < 32; i++) {
            $aryflag.push(this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN, i));
        }
        return $aryflag;
    }

    /**每日签到vo数据 */
    public getSigninEveryDayVoList(): Array<SigninEveryDayItemData> {
        var $aryflag: Array<SigninEveryDayItemData> = new Array
        // $aryflag.splice
        for (var i: number = 0; i < this.getcurMonthDays(); i++) {
            var tabvo: tb.TB_welfare_checkin = tb.TB_welfare_checkin.get_TB_welfare_checkinById(i + 1);
            var bb: SigninEveryDayItemData = new SigninEveryDayItemData();
            bb.data = tabvo

            var isreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN, i);
            if (isreceive) {
                //已领取
                bb.state = 3
            } else {
                //未领取
                if (this.getcurDays() > (i + 1)) {
                    bb.state = 4
                } else if (this.getcurDays() == (i + 1)) {
                    bb.state = 2
                } else {
                    bb.state = 1
                }
            }

            $aryflag.push(bb);
        }
        return $aryflag;
    }



    /**
     * 获取当前处于本月第几天
     * 从1开始计算
     */
    private _lastDate: number;
    public getcurDays(): number {
        var $ts: number = GameInstance.getServerNow();
        var $sever: Date = new Date($ts * 1000);
        return $sever.getDate();
    }

    public getLoginDay(): number {
        return this.GetUInt32(SharedDef.QUEST_FIELD_WELFARE_SEVEN_DAY_PROCESS);
    }

    /**
     * 获取当月共有多少天
     */
    public getcurMonthDays(): number {
        //获取当月共有多少天
        var d = new Date();
        //d.getMonth()+1代表下个月，月份索引从0开始，即当前月为6月时，getMonth()返回值为5，创建日期时同理
        //此处构造的日期为下个月的第0天，天数索引从1开始，第0天即代表上个月的最后一天
        var curMonthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
        // console.log("本月共有 " + curMonthDays + " 天");
        return curMonthDays;
    }

    /**累计签到vo数据 */
    public getSigninWeekList(): Array<SigninWeekItemData> {
        var $aryflagall: Array<SigninWeekItemData> = new Array
        for (var i: number = 0; i < 5; i++) {
            var tabvo: tb.TB_welfare_checkin_all = tb.TB_welfare_checkin_all.get_TB_welfare_checkin_allById(i + 1);
            var aa: SigninWeekItemData = new SigninWeekItemData();
            aa.data = tabvo;
            var canreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CHECKIN_ALL, (i + 1));
            if (!canreceive) {
                //未领取
                if (this.getSigninDayNum() >= tabvo.num) {
                    aa.state = 2
                } else {
                    aa.state = 1
                }
            } else {
                //已领取
                aa.state = 3
            }
            $aryflagall.push(aa);
        }
        return $aryflagall;
    }

    /**升级奖励vo数据 */
    public getLevelUpRewardList(): Array<LevelUpRewardItemData> {
        var $aryflaglevelup: Array<LevelUpRewardItemData> = new Array
        var $arytabvo: Array<tb.TB_welfare_level> = tb.TB_welfare_level.get_TB_welfare_level();
        for (var i: number = 0; i < $arytabvo.length; i++) {
            var cc: LevelUpRewardItemData = new LevelUpRewardItemData();
            cc.data = $arytabvo[i]

            var isreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_LEVEL, i);

            if (isreceive) {
                cc.state = 3
            } else {
                // console.log("---当前等级----", GuidData.player.getLevel());
                if (GuidData.player.getLevel() >= $arytabvo[i].lev) {
                    cc.state = 1
                } else {
                    cc.state = 2
                }
            }
            $aryflaglevelup.push(cc);
        }

        $aryflaglevelup.sort(
            function (a: LevelUpRewardItemData, b: LevelUpRewardItemData): number {
                if (a.state == b.state) {
                    if (a.data.id < b.data.id) {
                        return -1
                    } else {
                        return 1
                    }
                } else if (a.state < b.state) {
                    return -1
                } else {
                    return 1
                }
            }
        )

        return $aryflaglevelup;
    }


    /**消耗奖励vo数据 */
    public getCostRewardList(): Array<CostRewardItemData> {
        var $aryflaglevelup: Array<CostRewardItemData> = new Array
        var $arytabvo: Array<tb.TB_welfare_consume> = tb.TB_welfare_consume.get_TB_welfare_consume();
        for (var i: number = 0; i < $arytabvo.length; i++) {
            var cc: CostRewardItemData = new CostRewardItemData();
            cc.data = $arytabvo[i]

            var isreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_CONSUME_REWARD_FLAG, i);

            if (isreceive) {
                cc.state = 3
            } else {
                // console.log("---当前等级----", GuidData.player.getLevel());
                if (GuidData.player.getConsume() >= $arytabvo[i].money) {
                    cc.state = 1
                } else {
                    cc.state = 2
                }
            }
            cc.type = SharedDef.MODULE_WELFARE_CONSUME;
            $aryflaglevelup.push(cc);
        }

        $aryflaglevelup.sort(
            function (a: CostRewardItemData, b: CostRewardItemData): number {
                if (a.state == b.state) {
                    if (a.data.id < b.data.id) {
                        return -1
                    } else {
                        return 1
                    }
                } else if (a.state < b.state) {
                    return -1
                } else {
                    return 1
                }
            }
        )

        return $aryflaglevelup;
    }


    /** 充值返利 vo数据 */
    public getRechargeRewardList(): Array<RechargeRewardItemData> {
        var $aryflaglevelup: Array<RechargeRewardItemData> = new Array
        var $arytabvo: Array<tb.TB_welfare_recharge> = tb.TB_welfare_recharge.get_TB_welfare_recharge();
        for (var i: number = 0; i < $arytabvo.length; i++) {
            var cc: RechargeRewardItemData = new RechargeRewardItemData();
            cc.data = $arytabvo[i]

            var isreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_RECHARGE_REWARD_FLAG, i);

            if (isreceive) {
                cc.state = 3
            } else {
                if (GuidData.player.getChongZhiSum() >= $arytabvo[i].money) {
                    cc.state = 1
                } else {
                    cc.state = 2
                }
            }
            cc.type = SharedDef.MODULE_WELFARE_RECHARGE;
            $aryflaglevelup.push(cc);
        }

        $aryflaglevelup.sort(
            function (a: RechargeRewardItemData, b: RechargeRewardItemData): number {
                if (a.state == b.state) {
                    if (a.data.id < b.data.id) {
                        return -1
                    } else {
                        return 1
                    }
                } else if (a.state < b.state) {
                    return -1
                } else {
                    return 1
                }
            }
        )

        return $aryflaglevelup;
    }


    /** 七日礼物 vo数据 */
    public getSevenDayList(): Array<SevenDayaItemData> {
        var $aryflaglevelup: Array<SevenDayaItemData> = new Array
        var $arytabvo: Array<tb.TB_welfare_sevengift> = tb.TB_welfare_sevengift.get_TB_welfare_sevengift();
        for (var i: number = 0; i < $arytabvo.length; i++) {
            var cc: SevenDayaItemData = new SevenDayaItemData();
            cc.data = $arytabvo[i]

            var isreceive: boolean = this.GetBit(SharedDef.QUEST_FIELD_WELFARE_SEVEN_DAY_FLAG, i);

            if (isreceive) {
                cc.state = 0
            } else {
                if (this.getLoginDay() >= i + 1) {
                    cc.state = 1
                } else {
                    cc.state = 2
                }
            }
            $aryflaglevelup.push(cc);
        }
        return $aryflaglevelup;
    }

    /**本月累计签到几天 */
    public getSigninDayNum(): number {
        var $totalnum: number = 0;
        var $ary = this.getSigninEveryDayList();
        for (var i = 0; i < $ary.length; i++) {
            if ($ary[i]) {
                $totalnum++;
            }
        }
        // console.log("------累计签到-----", $totalnum);
        return $totalnum;
    }

    /**
     * 活动找回vo数据
     */
    public getBackList(): Array<RewardBackItemData> {

        var $ary: Array<RewardBackItemData> = new Array
        var $arytabvo: Array<tb.TB_welfare_back> = tb.TB_welfare_back.get_TB_welfare_back();
        for (var i: number = 0; i < $arytabvo.length; i++) {
            var dd: RewardBackItemData = new RewardBackItemData();
            dd.data = $arytabvo[i]

            var $kNum: number = SharedDef.QUEST_FIELD_WELFARE_BACK_START + SharedDef.WELFA_BACK_ITEM_NUM + (i * SharedDef.MAX_WELFA_BACK_ITEM);
            dd.num = this.GetUInt32($kNum);

            if (dd.num == 0) {
                dd.state = 2
            } else {
                dd.state = 1
            }
            $ary.push(dd);
        }

        $ary.sort(
            function (a: RewardBackItemData, b: RewardBackItemData): number {
                if (a.state == b.state) {
                    if (a.data.id < b.data.id) {
                        return -1
                    } else {
                        return 1
                    }
                } else if (a.state < b.state) {
                    return -1
                } else {
                    return 1
                }
            }
        )

        return $ary;
    }



    private titleAry: Array<TitleItemData>;
    public getTitleList(): Array<TitleItemData> {
        if (this.titleAry) {
            return this.titleAry;
        }

        this.titleAry = new Array;

        this.refreshTitleList();

        return this.titleAry;
    }

    public getrefreshByidx($Idx: number): TitleItemData {
        var tid: number = this.GetUInt16($Idx, 0);
        if (tid != 0) {
            var tObj: TitleItemData = new TitleItemData();
            tObj.id = tid;
            tObj.init = (this.GetUInt16($Idx, 1) == 1);
            tObj.time = this.GetUInt32($Idx + SharedDef.TITLE_FIELD_TIME);
            return tObj;
        } else {
            return null;
        }
    }

    public refreshTitleList(): void {
        if (!this.titleAry) {
            this.titleAry = new Array;
        }
        this.titleAry.length = 0;
        for (var i: number = SharedDef.QUEST_FIELD_TITLE_START; i < SharedDef.QUEST_FIELD_TITLE_END; i += SharedDef.MAX_TITLE_FIELD) {
            var tid: number = this.GetUInt16(i, 0);
            if (tid != 0) {
                var tObj: TitleItemData = new TitleItemData();
                tObj.id = tid;
                tObj.init = (this.GetUInt16(i, 1) == 1);
                tObj.time = this.GetUInt32(i + SharedDef.TITLE_FIELD_TIME);
                this.titleAry.push(tObj);
            }
        }
    }

    public traceAchieve(obj: AchieveItemData): void {
        console.log("成就ID:" + obj.id + (obj.hasReach ? " 已完成" : " 未完成") + (obj.hasReward ? " 已领奖" : " 未领奖") + " 当前进度：" + obj.progress);
    }

    private _id: number
    public traceTitle(): void {
        console.log("------称号列表_id-----------------", this._id)
        // console.log("称号ID:" + this.titleAry[i].id + " 失效时间：" + this.titleAry[i].time);
        for (var i: number = 0; i < this.titleAry.length; i++) {
            console.log("------称号列表-----------------", this.titleAry[i].id, this.titleAry[i])
            if (this.titleAry[i].id != this._id) {
                this._id = this.titleAry[i].id;

            }
        }
    }

    //日常任务完成个数
    public getDailyQuestCompleteNum(): number {
        return this.GetUInt32(SharedDef.QUEST_FIELD_DAILY2_FINISHED);
    }

    //日常任务是否提交
    public getDailyQuestSubmitState(): boolean {
        return this.GetUInt32(SharedDef.QUEST_FIELD_DAILY2_SUBMIT) > 0;
    }
}

class AchieveItemData {
    public id: number;
    /**是否达成成就 */
    public hasReach: boolean;
    /**是否已领取奖励 */
    public hasReward: boolean;
    /**成就进度 */
    public progress: number;
    public data: tb.TB_achieve_base;

}

class TitleItemData {
    public id: number;//称号ID
    public init: boolean;//是否已经初始化 整备过或查看过即为初始化
    public time: number//称号失效时间
}

/** 累计签到vo */
class SigninWeekItemData {
    public data: tb.TB_welfare_checkin_all;
    public state: number;// 1：条件不满足，不可领取   2：可领取  3：已领取
}

/** 每日签到vo */
class SigninEveryDayItemData {
    public data: tb.TB_welfare_checkin;
    public state: number;// 1：条件不满足，不可领取   2：可领取  3：已领取 4:补领
}

/** 升级奖励vo */
class LevelUpRewardItemData {
    public data: tb.TB_welfare_level;
    public state: number;// 1：可领取   2：条件不满足，不可领取  3：已领取
}

/** 消耗奖励vo */
class CostRewardItemData {
    public data: tb.TB_welfare_consume;
    public type: number;
    public state: number;// 1：可领取   2：条件不满足，不可领取  3：已领取
}

/** 充值返利vo */
class RechargeRewardItemData {
    public data: tb.TB_welfare_recharge;
    public type: number;
    public state: number;// 1：可领取   2：条件不满足，不可领取  3：已领取
}

/** 七日礼物vo */
class SevenDayaItemData {
    public data: tb.TB_welfare_sevengift;
    public state: number;// 0：已领取   1：可领取  2：条件不满足，不可领取
}

/** 活动找回vo */
class RewardBackItemData {
    public data: tb.TB_welfare_back;
    public num: number
    public state: number;// 1：可找回   2：不可找回 
}