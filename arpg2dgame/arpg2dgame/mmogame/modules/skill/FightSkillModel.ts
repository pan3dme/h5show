
class FightSkillModel {
    private static _instance: FightSkillModel;
    public static getInstance(): FightSkillModel {
        if (!this._instance) {
            this._instance = new FightSkillModel();
        }
        return this._instance;
    }
    public playSkillToAttack($vo: tb.SkillDataVo, $ui: boolean): void {

        if (GameInstance.mainChar.isSinging) {
            return;
        }
        if (!$ui || $vo.tb_skill_base.is_play_forbid == 0) {
            this.playSkillEffect($vo.tb_skill_base.id);
        }
        //发送技能消息给服务器
        var attack2D: Vector2D = new Vector2D;
        var $guid: number = 0;
        if (GameInstance.attackTarget) {
            attack2D = GameInstance.attackTarget.getAstarPos();
            GameInstance.mainChar.watch(GameInstance.attackTarget);
            if ($vo.tb_skill_base.lock_type == 1) {
                $guid = GameInstance.attackTarget.unit.uintGuid;
            }
        } else {
            attack2D = this.getMainCharFrontPos($vo);
        }
      
        //console.log("$vo.slot, attack2D.x, attack2D.y, 0, $guid");
        //console.log($vo.slot, attack2D.x, attack2D.y, 0, $guid, GameInstance.mainChar.unit.getGuid());


       
        var angly: number = (-GameInstance.mainChar.rotationY - 270) % 360
        NetManager.getInstance().protocolos.set_orient(angly);


        NetManager.getInstance().protocolos.spell_start($vo.slot, attack2D.x, attack2D.y, 0, $guid);


        tb.SkillData.setCdMeshData($vo.tb_skill_base.id, $vo.tb_skill_base.singleCD);


        fightui.FightSkillPanel.getInstance().refreshCdBySkillId($vo.tb_skill_base.id)
        
    }
    private getMainCharFrontPos($vo: tb.SkillDataVo): Vector2D {
        var a: Vector2D = AstarUtil.getGrapIndexByPos(GameInstance.mainChar.getCurrentPos());
        var m: Matrix3D = new Matrix3D()
        var angly: number = (-GameInstance.mainChar.rotationY - 270) % 360
        m.appendRotation(angly, Vector3D.Y_AXIS);
        var $p: Vector3D = new Vector3D(1, 0, 0);
        $p = m.transformVector($p);
        $p.normalize();
        $p.scaleBy($vo.tb_skill_uplevel.distance);
        a.x += $p.x;
        a.y += $p.z;
        a.x = Math.floor(a.x);
        a.y = Math.floor(a.y);
        return a;
    }
    public canPlaySkillToAttackTarger(range: number): boolean {

        if (GameInstance.attackTarget && GameInstance.mainChar.math_distance(GameInstance.attackTarget) < range) {
            return true
        }
        return false


    }
    //走到新攻击目标附近
    public moveToAttackTarger($sceneChar: SceneChar, $selectSkill: tb.SkillDataVo, $fun: Function = null): void {
        var $dis: number = $selectSkill.tb_skill_uplevel.distance - 2;
        var $to2D: Vector2D = $sceneChar.getAstarPos()
        var $self2D: Vector2D = GameInstance.mainChar.getAstarPos()

        var $nrm: Vector2D = new Vector2D($self2D.x - $to2D.x, $self2D.y - $to2D.y)
        $nrm.normalize()
        $nrm.scaleBy($dis)
        $nrm.x = Math.floor($nrm.x);
        $nrm.y = Math.floor($nrm.y);
        $to2D.x += $nrm.x;
        $to2D.y += $nrm.y;

        if ($to2D.x == $self2D.x && $to2D.y == $self2D.y) { //如果为起始点
            if ($fun) {
                $fun();
            }
        }
        var item: Array<Vector2D> = AstarUtil.findPath2D($self2D, $to2D);
        if (item && item.length) {
            MainCharControlModel.getInstance().setWalkPathFun(item, $fun);
        }
    }
    private playSkillEffect(skillid: number): void {
        var $skilldata: Play_Skill_Vo = Play_Skill_Vo.get_Play_Skill_Vo(skillid)
        if ($skilldata.tb_skill_base.effect_file && $skilldata.tb_skill_base.effect) {
            var $skill: Skill = SkillManager.getInstance().getSkill(getSkillUrl($skilldata.tb_skill_base.effect_file), $skilldata.tb_skill_base.effect);
            if ($skill) {
                $skill.reset();
                //$skill.isDeath = false;
                $skill.needSound = true;
                var $hitPosItem: Array<Vector3D> = new Array
                if ($skilldata.tb_skill_base.is_remain == 0) { //不是持续技能
                    if ($skilldata.tb_skill_base.isOrbit == 1) { //锁定技能
                        if (GameInstance.attackTarget) {
                            $skill.configTrajectory(GameInstance.mainChar, GameInstance.attackTarget);
                        } else {
                            return;
                        }
                    } else {

                        if (GameInstance.attackTarget && $skilldata.tb_skill_base.target_type == 4) {
                            $hitPosItem.push(GameInstance.attackTarget.getCurrentPos())
                        }
                        $skill.configFixEffect(GameInstance.mainChar, null, $hitPosItem);
                    }
                    GameInstance.mainChar.playSkill($skill);
                    FightManager.getInstance().setSelfSkillCd(skillid);
                }
            }
        }
    }



}

