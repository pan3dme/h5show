var AotuSkillManager = /** @class */ (function () {
    function AotuSkillManager() {
        var _this = this;
        this._aotuBattle = false;
        this._aotuMoveToNext = false; //自己动打怪寻路中
        TimeUtil.addFrameTick(function (t) { _this.update(t); });
    }
    AotuSkillManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new AotuSkillManager();
        }
        return this._instance;
    };
    Object.defineProperty(AotuSkillManager.prototype, "aotuBattle", {
        get: function () {
            return this._aotuBattle;
        },
        set: function (value) {
            this._aotuBattle = value;
            this._aotuMoveToNext = false;
        },
        enumerable: true,
        configurable: true
    });
    AotuSkillManager.prototype.update = function (t) {
        if (!tb.SkillData.skillList) {
            tb.SkillData.resetSkillData();
            return;
        }
        MainCharControlModel.getInstance().clikEat();
        if (this._aotuBattle && !this._aotuMoveToNext) {
            var $curentAction = GameInstance.mainChar.curentAction;
            if (!GameInstance.attackTarget) {
                GameInstance.attackTarget = RelationManager.getInstance().findNearCanAttackScene();
            }
            if (GameInstance.attackTarget && $curentAction == CharAction.WALK) {
                if (GameInstance.mainChar.math_distance(GameInstance.attackTarget) < 50) {
                    MainCharControlModel.getInstance().sendStop();
                }
            }
            this.needAttackToSelect();
        }
        else {
            if (this._aotuMoveToNext) {
                if (GameInstance.mainChar && !GameInstance.mainChar.isDeath) {
                    var $curentAction = GameInstance.mainChar.curentAction;
                    if ($curentAction == CharAction.STANAD) {
                        this._aotuMoveToNext = false;
                    }
                }
            }
        }
        if (AppDataArpg.lockMainChar && GameInstance.mainChar) {
            AppDataArpg.resetSelfPosCenter();
        }
    };
    AotuSkillManager.prototype.needAttackToSelect = function () {
        var _this = this;
        var $curentAction = GameInstance.mainChar.curentAction;
        if ($curentAction == CharAction.STANAD || $curentAction == CharAction.ATTACK_010 || $curentAction == CharAction.ATTACK_020) {
            var $selectSkill;
            if (!$selectSkill) {
                for (var i = 0; i < tb.SkillData.skillList.length; i++) {
                    var $skillBaseDataVo = tb.SkillData.skillList[i];
                    var slot = $skillBaseDataVo.slot;
                    if ($skillBaseDataVo.level) {
                        var $saveCdTime = tb.SkillData.getCdMeshBySkillId($skillBaseDataVo.id);
                        if (isNaN($saveCdTime)) {
                            $saveCdTime = -1;
                        }
                        if ($saveCdTime < TimeUtil.getTimer()) {
                            $selectSkill = $skillBaseDataVo;
                        }
                    }
                }
            }
            if (!$selectSkill) {
                $selectSkill = tb.SkillData.threeSkillList[GameInstance.threeBattarId++ % 3];
            }
            var $canPlay = FightSkillModel.getInstance().canPlaySkillToAttackTarger($selectSkill.tb_skill_uplevel.distance * 10);
            if ($canPlay) {
                FightSkillModel.getInstance().playSkillToAttack($selectSkill, false);
            }
            else {
                if ($selectSkill.slot == 1) {
                    GameInstance.threeBattarId--; //三连击没能发送将退回
                }
                if (GameInstance.attackTarget && GameInstance.attackTarget.onStage) {
                    this._aotuMoveToNext = true;
                    FightSkillModel.getInstance().moveToAttackTarger(GameInstance.attackTarget, $selectSkill, function () { _this.walkPathComplete(); });
                }
            }
        }
    };
    AotuSkillManager.prototype.walkPathComplete = function () {
        this._aotuMoveToNext = false;
    };
    return AotuSkillManager;
}());
//# sourceMappingURL=AotuSkillManager.js.map