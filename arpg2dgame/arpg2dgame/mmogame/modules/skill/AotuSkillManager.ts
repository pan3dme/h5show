
class AotuSkillManager  {
    private static _instance: AotuSkillManager;
    public static getInstance(): AotuSkillManager {
        if (!this._instance) {
            this._instance = new AotuSkillManager();
        }
        return this._instance;
    }
    public constructor() {
        TimeUtil.addFrameTick((t: number) => { this.update(t) });
    }
    private _aotuBattle: boolean = false;
    public get aotuBattle(): boolean {
        return this._aotuBattle;
    }
    public set aotuBattle(value: boolean) {
        this._aotuBattle = value;
        this._aotuMoveToNext = false;
    }
    public update(t:number): void
    {
        if (!tb.SkillData.skillList) {
            tb.SkillData.resetSkillData();
            return
        }
        MainCharControlModel.getInstance().clikEat()
        if (this._aotuBattle && !this._aotuMoveToNext) {
            var $curentAction: string = GameInstance.mainChar.curentAction;
            if (!GameInstance.attackTarget) {//没有攻击对象.找一个最近的攻击对象
                GameInstance.attackTarget = RelationManager.getInstance().findNearCanAttackScene()
            }
            if (GameInstance.attackTarget && $curentAction == CharAction.WALK) {//如果正在行走，并离攻击对象距离很近时设定为
                if (GameInstance.mainChar.math_distance(GameInstance.attackTarget) < 50) {
                    MainCharControlModel.getInstance().sendStop()
                }
            }
            this.needAttackToSelect();
        } else
        {
            if (this._aotuMoveToNext) {
                if (GameInstance.mainChar && !GameInstance.mainChar.isDeath) {
                    var $curentAction: string = GameInstance.mainChar.curentAction;
                    if ($curentAction == CharAction.STANAD) {
                        this._aotuMoveToNext = false
                    }
                }
            }
        }

        if (AppDataArpg.lockMainChar && GameInstance.mainChar) {
            AppDataArpg.resetSelfPosCenter();
        }
    }
    private needAttackToSelect(): void  //有攻击对象，将对其进行攻击
    {
        var $curentAction: string = GameInstance.mainChar.curentAction;
        if ($curentAction == CharAction.STANAD || $curentAction == CharAction.ATTACK_010 || $curentAction == CharAction.ATTACK_020) {
            var $selectSkill: tb.SkillDataVo;
            if (!$selectSkill) {
                for (var i: number = 0; i < tb.SkillData.skillList.length; i++) {
                    var $skillBaseDataVo: tb.SkillDataVo = tb.SkillData.skillList[i]
                    var slot: number = $skillBaseDataVo.slot
                    if ($skillBaseDataVo.level) { //特殊处理神兵和怒气插口和位置互换
                        var $saveCdTime: number = tb.SkillData.getCdMeshBySkillId($skillBaseDataVo.id);
                        if (isNaN($saveCdTime)) {
                            $saveCdTime = -1;
                        }
                        if ($saveCdTime < TimeUtil.getTimer()) {
                            $selectSkill = $skillBaseDataVo;
                        }
                    }
                }
            }
            if (!$selectSkill) {  //如果只是锁定并非自动战斗
                $selectSkill = tb.SkillData.threeSkillList[GameInstance.threeBattarId++ % 3];
            }
            var $canPlay: boolean = FightSkillModel.getInstance().canPlaySkillToAttackTarger($selectSkill.tb_skill_uplevel.distance * 10)
            if ($canPlay) {
                FightSkillModel.getInstance().playSkillToAttack($selectSkill, false);
            } else {
                if ($selectSkill.slot == 1) {
                    GameInstance.threeBattarId--//三连击没能发送将退回
                }
                if (GameInstance.attackTarget && GameInstance.attackTarget.onStage) {
                    this._aotuMoveToNext = true
                    FightSkillModel.getInstance().moveToAttackTarger(GameInstance.attackTarget, $selectSkill, () => { this.walkPathComplete() });
                }
            }
        }
    }
    private _aotuMoveToNext:boolean=false //自己动打怪寻路中
    private walkPathComplete(): void {
        this._aotuMoveToNext = false
    }

}