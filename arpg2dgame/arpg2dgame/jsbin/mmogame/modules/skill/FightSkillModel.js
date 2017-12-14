var FightSkillModel = /** @class */ (function () {
    function FightSkillModel() {
    }
    FightSkillModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new FightSkillModel();
        }
        return this._instance;
    };
    FightSkillModel.prototype.playSkillToAttack = function ($vo, $ui) {
        if (GameInstance.mainChar.isSinging) {
            return;
        }
        if (!$ui || $vo.tb_skill_base.is_play_forbid == 0) {
            this.playSkillEffect($vo.tb_skill_base.id);
        }
        //发送技能消息给服务器
        var attack2D = new Vector2D;
        var $guid = 0;
        if (GameInstance.attackTarget) {
            attack2D = GameInstance.attackTarget.getAstarPos();
            GameInstance.mainChar.watch(GameInstance.attackTarget);
            if ($vo.tb_skill_base.lock_type == 1) {
                $guid = GameInstance.attackTarget.unit.uintGuid;
            }
        }
        else {
            attack2D = this.getMainCharFrontPos($vo);
        }
        //console.log("$vo.slot, attack2D.x, attack2D.y, 0, $guid");
        //console.log($vo.slot, attack2D.x, attack2D.y, 0, $guid, GameInstance.mainChar.unit.getGuid());
        var angly = (-GameInstance.mainChar.rotationY - 270) % 360;
        NetManager.getInstance().protocolos.set_orient(angly);
        NetManager.getInstance().protocolos.spell_start($vo.slot, attack2D.x, attack2D.y, 0, $guid);
        tb.SkillData.setCdMeshData($vo.tb_skill_base.id, $vo.tb_skill_base.singleCD);
        fightui.FightSkillPanel.getInstance().refreshCdBySkillId($vo.tb_skill_base.id);
    };
    FightSkillModel.prototype.getMainCharFrontPos = function ($vo) {
        var a = AstarUtil.getGrapIndexByPos(GameInstance.mainChar.getCurrentPos());
        var m = new Matrix3D();
        var angly = (-GameInstance.mainChar.rotationY - 270) % 360;
        m.appendRotation(angly, Vector3D.Y_AXIS);
        var $p = new Vector3D(1, 0, 0);
        $p = m.transformVector($p);
        $p.normalize();
        $p.scaleBy($vo.tb_skill_uplevel.distance);
        a.x += $p.x;
        a.y += $p.z;
        a.x = Math.floor(a.x);
        a.y = Math.floor(a.y);
        return a;
    };
    FightSkillModel.prototype.canPlaySkillToAttackTarger = function (range) {
        if (GameInstance.attackTarget && GameInstance.mainChar.math_distance(GameInstance.attackTarget) < range) {
            return true;
        }
        return false;
    };
    //走到新攻击目标附近
    FightSkillModel.prototype.moveToAttackTarger = function ($sceneChar, $selectSkill, $fun) {
        if ($fun === void 0) { $fun = null; }
        var $dis = $selectSkill.tb_skill_uplevel.distance - 2;
        var $to2D = $sceneChar.getAstarPos();
        var $self2D = GameInstance.mainChar.getAstarPos();
        var $nrm = new Vector2D($self2D.x - $to2D.x, $self2D.y - $to2D.y);
        $nrm.normalize();
        $nrm.scaleBy($dis);
        $nrm.x = Math.floor($nrm.x);
        $nrm.y = Math.floor($nrm.y);
        $to2D.x += $nrm.x;
        $to2D.y += $nrm.y;
        if ($to2D.x == $self2D.x && $to2D.y == $self2D.y) {
            if ($fun) {
                $fun();
            }
        }
        var item = AstarUtil.findPath2D($self2D, $to2D);
        if (item && item.length) {
            MainCharControlModel.getInstance().setWalkPathFun(item, $fun);
        }
    };
    FightSkillModel.prototype.playSkillEffect = function (skillid) {
        var $skilldata = Play_Skill_Vo.get_Play_Skill_Vo(skillid);
        if ($skilldata.tb_skill_base.effect_file && $skilldata.tb_skill_base.effect) {
            var $skill = SkillManager.getInstance().getSkill(getSkillUrl($skilldata.tb_skill_base.effect_file), $skilldata.tb_skill_base.effect);
            if ($skill) {
                $skill.reset();
                //$skill.isDeath = false;
                $skill.needSound = true;
                var $hitPosItem = new Array;
                if ($skilldata.tb_skill_base.is_remain == 0) {
                    if ($skilldata.tb_skill_base.isOrbit == 1) {
                        if (GameInstance.attackTarget) {
                            $skill.configTrajectory(GameInstance.mainChar, GameInstance.attackTarget);
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        if (GameInstance.attackTarget && $skilldata.tb_skill_base.target_type == 4) {
                            $hitPosItem.push(GameInstance.attackTarget.getCurrentPos());
                        }
                        $skill.configFixEffect(GameInstance.mainChar, null, $hitPosItem);
                    }
                    GameInstance.mainChar.playSkill($skill);
                    FightManager.getInstance().setSelfSkillCd(skillid);
                }
            }
        }
    };
    return FightSkillModel;
}());
//# sourceMappingURL=FightSkillModel.js.map