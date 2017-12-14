class CharUint extends Object3D {
    public char: SceneChar
    public type: number;
    public avatar: string
    public inScene: boolean;
    public isDeath: boolean;
    public guid: number;
    public isMain: boolean;
    private static skipId: number;
    public constructor() {
        super()
        if (!CharUint.skipId) {
            CharUint.skipId = 1
        }
        CharUint.skipId++
        this.inScene = false;
        this.guid = CharUint.skipId

        this._hp = 100;
        this._maxhp = 100;
        this.isDeath=false
    }


    public addChar(): void {
        if (!this.inScene) {
            this.inScene = true;
            this.char = this.addRole(new Vector3D(this.x, this.y, this.z), this.avatar)
            this.char.rotationY = this.rotationY;
            this.char.charUint = this;
            this.char.charUint.isDeath = false
            this.char.charUint.setHp(this.char.charUint.getMaxHp());
            if (this.isMain) {
                this.char.showBlood(0)
            } else {
                if (this.type == 0) {
                    this.char.showBlood(1)
                }
            }
        }
    }
    public removeChar(): void {
        if (this.inScene) {
            this.inScene = false;
            if (this.char) {
                SceneManager.getInstance().removeMovieDisplay(this.char);
                this.char.destory()
                this.char = null
            }
        }
    }

    private addRole($pos: Vector3D, $avatar: string): SceneChar {
        var $sc: SceneChar = new SceneChar();
        $sc.setRoleUrl(getRoleUrl($avatar));
        $sc.x = $pos.x;
        $sc.y = $pos.y;
        $sc.z = $pos.z;
        $sc.px = $pos.x;
        $sc.py = $pos.y;
        $sc.pz = $pos.z;
        SceneManager.getInstance().addMovieDisplay($sc);
        $sc.refreshY();
        return $sc;
    }
    private _hp: number;
    public getHp(): number {
        return this._hp;
    }
    public setHp(value: number): void {
        this._hp = value;
    }

    private _maxhp: number;
    public getMaxHp(): number {
        return this._maxhp
    }
    public setMaxHp(value: number): void {
        this._maxhp = value;
    }

}


class SceneChar extends SceneBaseChar {

    public charUint: CharUint
    public speedTX: number = (1.5 / 20)*1.5;
    public life: number = 0;

    protected _walkPath: Array<Vector3D>;
    private _astarDirect: Vector3D;
    private _astatTopos: Vector3D;



    public static WEAPON_PART: string = "weapon";
    public static WEAPON_DEFAULT_SLOT: string = "w_01";
    public static MOUNT_SLOT: string = "mount_01";
    public static WING_SLOT: string = "wing_01";

    private _px: number = 0;
    private _py: number = 0;
    private _pz: number = 0;
    private _pRotationY: number = 0;


    public constructor() {
        super();
        this.shadow = true;

    }

    public get px(): number {
        return this._px;
    }
    public set px(val: number) {
        this._px = val;
       
        this.x = val;
 
    }
    public get py(): number {
        return this._py;
    }
    public set py(val: number) {
        this._py = val;
       
         this.y = val;
        
    }
    public get pz(): number {
        return this._pz;
    }
    public set pz(val: number) {
        this._pz = val;
    
        this.z = val;
   
    }
    /**强制角度 */
    public set forceRotationY(val: number) {
        this.pRotationY = val;
        this.rotationY = val;
        this.toRotationY = val;
    }

    public get pRotationY(): number {
        return this._pRotationY;
    }
    public set pRotationY(val: number) {
        this._pRotationY = val;
    
         this.rotationY = val;
      
    }
    private _charTitleVo: CharTitleMeshVo;
    public refreshTittle(): void {
        this.refreshPos();
    }
    private _charNameVo: CharNameMeshVo;
    public showName($color: string = null): void {
        this.refreshPos()
    }
    private _charBloodVo: BloodLineMeshVo;
    public showBlood($colorType: number = 0): void {
        if (!this._charBloodVo) {
            this._charBloodVo = BloodManager.getInstance().getBloodLineMeshVo()
            this._charBloodVo.colortype = $colorType;
        } else {
            this._charBloodVo.colortype = $colorType;
        }
        this.refreshPos()
    }


    public tittleHeight: number = 50
    public onMeshLoaded(): void {
        if (this._skinMesh) {
            this.tittleHeight = this._skinMesh.tittleHeight
            if (this.loadFinishFun) {
                this.loadFinishFun();
            }
        }
    }
    public loadFinishFun: Function
    private refreshPos(): void {

        //处理血条和名字位置 -FIXME--0
        if (this._charBloodVo) {
            this._charBloodVo.pos.x = this.px;
            this._charBloodVo.pos.z = this.pz;
            this._charBloodVo.pos.y = this.py + this.tittleHeight;
            this._charBloodVo.visible = this.visible;
        }
      
    }
    public refreshLifeNum(): void {
        this.life = this.charUint.getHp() / this.charUint.getMaxHp() * 100;
        if (this._charBloodVo) {
            this._charBloodVo.num = this.life
        }
    }
    public set walkPath($wp: Array<Vector3D>) {
        if ($wp.length == 0) {
            return;
        }
        //  console.log("收到寻路信息",$wp,  TimeUtil.getTimer())
        //console.log("改变行走CharAction.WALK")
        if (!this.curentAction||this.curentAction == CharAction.STANAD || this.curentAction == CharAction.STAND_MOUNT) {
            this.play(CharAction.WALK);
        }
        this._walkPath = $wp;
        this.setTarget();
 
    }
    //得到A星数据后重新刷坐标
    public fixAstartData(pos: Vector2D): void {
        if (this._walkPath) {
            for (var i: number = 0; i < this._walkPath.length; i++) {
                this._walkPath[i].x += pos.x;
                this._walkPath[i].z = pos.y - this._walkPath[i].z;
                this._walkPath[i].y = AstarUtil.getHeightByPos(this._walkPath[i]);
            }
        }
        this.px += pos.x;
        this.pz = pos.y - this.pz;
        if (this._astatTopos) {
            this._astatTopos.x += pos.x;
            this._astatTopos.z = pos.y - this._astatTopos.z;
            this.setAstarNrmAndRotation();
        }
        this.refreshY();
    }

    public applyWalk($item: Array<Vector2D>): void {
        if ($item && $item.length == 2) {
            //排除是停止的路径将不处理
            if ($item[0].x == $item[1].x && $item[0].y == $item[1].y) {
                return
            }
        }
        this.walkPath = AstarUtil.Path2dTo3d($item);
    }

    public set moveToPos2D($v2d: Vector2D) {
        // $v2d=new Vector2D(154,87)
        this._walkPath = null;
        this.play(this._defaultAction);
        var pos: Vector3D = AstarUtil.getWorldPosByStart2D($v2d);
        this.px = pos.x;
        this.pz = pos.z;
        this.refreshY();
    }

    private stopToPos($v2d: Vector2D): void {
        var pos: Vector3D = AstarUtil.getWorldPosByStart2D($v2d);
        var arr: Array<Vector3D> = new Array;
        arr.push(pos);
        this.walkPath = arr;
    }

    private moveTile(xt: number, yt: number) {
        this.moveToPos2D = new Vector2D(xt, yt);
    }
    public updateFrame(t: number): void {
        super.updateFrame(t);
        if (this._walkPath) {
            this.walkAstar(t);
            this.refreshY();
        }
        if (this._rotationMatrix) {
            this.rotationToNew(this.toRotationY, 2);
        }
    }
    //平滑num=1为直接
    protected rotationToNew(value: number, num: number = 1): void {
        var anum: number = value - this.pRotationY;
        if (anum == 0) {
            return;
        }
        if (anum < 1) {
            this.pRotationY = value;
            return;
        }
        var a: number = ((value - this.pRotationY) % 360 + 360) % 360;
        if (a > 180) {
            this.pRotationY -= (360 - a) / num;
        } else {
            this.pRotationY += a / num;
        }

    }
    public refreshY(): void {
        this.py = AstarUtil.getHeightByPos(this.getCurrentPos());
        this.refreshPos();
 
    }

    //设计毫秒走每个格子，
    public set speedUseTime(value: number) {
        this.speedTX = 0.01 * (value / 10);
    }
    protected walkAstar(t: number): void {
 
        var $wk: number = Math.min(t, 50)
        var distance: number = Vector3D.distance(new Vector3D(this.px, 0, this.pz), this._astatTopos);
        if (distance > 5) {
            var sn: number = $wk * this.speedTX;
            if (sn > distance) {
                this.px = this._astatTopos.x;
                this.pz = this._astatTopos.z;
                var tempT: number = (sn - distance) / this.speedTX;
                this.walkAstar(tempT);
            } else {
                this.px += this._astarDirect.x * sn;
                this.pz += this._astarDirect.z * sn;
            }
        } else {
            this.setTarget();
            if (!this._walkPath) {//已结束
                this.px = this._astatTopos.x;
                this.pz = this._astatTopos.z;
                this.walkComplete()
            } else {
                this.walkAstar(t);
            }
        }
    }
    public changeActionFun:Function
    protected changeAction($action: string): void {
   
        super.changeAction($action);
        if (this.changeActionFun) {
            this.changeActionFun($action);
        }
    }

    protected walkComplete(): void {
        if (this.walkCompleteBackFun) {
            this.walkCompleteBackFun()
        }
    }
    public walkCompleteBackFun: Function;
    protected setTarget(): void {
        if (!this._walkPath) {
            return;
        }
        if (this._walkPath.length == 0) {
            this._walkPath = null;
            this.play(CharAction.STANAD);
            return;
        }
        this._astatTopos = this._walkPath.shift();
        this.setAstarNrmAndRotation()

    }
    //计算移动角度和寻路方向 
    public setAstarNrmAndRotation(): void {
        if (this._astatTopos) {
            this._astarDirect = this._astatTopos.subtract(this.getCurrentPos());
            this._astarDirect.y = 0;
            this._astarDirect.normalize();
            if (Vector3D.distance(this.getCurrentPos(), this._astatTopos) > 10) {
                this.toRotationY = this.mathAngle(this._astatTopos.z, this._astatTopos.x, this.pz, this.px) + 180
            }
        }
    }
    public toRotationY: number = 0;
    protected mathAngle(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
    }

    public stopMove(): void {
        this.play(CharAction.STANAD);
        this._walkPath = null;
    }
    public getEndWalkPathPos(): Vector3D {
        if (this._walkPath) {
            return this._walkPath[this._walkPath.length - 1]
        } else {
            return null
        }
    }

    public watch($obj: Display3D, $syn: boolean = false): void {
        if (!$obj) {
            console.log("面向对象无")
            return;
        }
        var xx: number = $obj.x - this.px;
        var yy: number = $obj.z - this.pz;
        var distance: number = Math.sqrt(xx * xx + yy * yy);
        xx /= distance;
        yy /= distance;
        var angle: number = Math.asin(xx) / Math.PI * 180;
        if (yy <= 0) {
            angle = 180 - angle;
        }
        if (!isNaN(angle)) {
            this.forceRotationY = angle
        }
    }
    public getCurrentPos(): Vector3D {
        return new Vector3D(this.px, this.py, this.pz);
    }
    public getAstarPos(): Vector2D {
        return AstarUtil.getGrapIndexByPos(this.getCurrentPos())
    }

    public removeStage(): void {
        super.removeStage();
        if (this._charBloodVo) {
            this._charBloodVo.visible = false
        }
    }
    public addStage(): void {
        super.addStage()
        if (this._charBloodVo) {
            this._charBloodVo.visible = true;
        }
    }
    public playSkill($skill: Skill): void {
        this._walkPath = null;
        SkillManager.getInstance().playSkill($skill);
    }

    public setWeaponByAvatar(avatar: number, $suffix: string = ""): void {
        var so: tb.TB_item_slot = tb.TB_item_slot.getTempVo(avatar)
        if (so) {
            this.addPart(SceneChar.WEAPON_PART, so.slot, this.getSceneCharWeaponUrl(avatar, $suffix));
        } else {
            this.addPart(SceneChar.WEAPON_PART, SceneChar.WEAPON_DEFAULT_SLOT, this.getSceneCharWeaponUrl(avatar, $suffix));
        }
    }

    public destory(): void {
        if (this._hasDestory) {
            return;
        }
        super.destory();
        //清理血条和名称 -FIXME-0
        if (this._charNameVo) {
            this._charNameVo.destory()
            this._charNameVo = null
        }
        if (this._charBloodVo) {
            this._charBloodVo.destory()
            this._charBloodVo = null
        }

    }
    private mountChar: MountChar;
    public setMount($mountId:string): void {
            if (!this.mountChar) {
                this.mountChar = new MountChar();
            }
            this.mountChar.x = this.px;
            this.mountChar.y = this.py;
            this.mountChar.z = this.pz;
            this.mountChar.rotationY = this._pRotationY;
            this.mountChar.setRoleUrl(getRoleUrl($mountId));
            this.setBind(this.mountChar, SceneChar.MOUNT_SLOT);
            SceneManager.getInstance().addMovieDisplay(this.mountChar);
            this.play(this.curentAction);
    }

    private _wingDisplay: Display3dMovie;
    public setWing($wingId: string): void {

        if (!this._wingDisplay) {
            this._wingDisplay = new Display3dMovie();
        }
        this._wingDisplay.setRoleUrl(getRoleUrl($wingId));
        this._wingDisplay.setBind(this, SceneChar.WING_SLOT);
        SceneManager.getInstance().addMovieDisplay(this._wingDisplay);
    }



    public play($action: string, $completeState: number = 0, needFollow: boolean = true): boolean {
        if (this.mountChar) {
            this.mountChar.visible = Boolean($action != CharAction.JUMP)
            if ($action == CharAction.STANAD) {
                super.play(CharAction.STAND_MOUNT);
            } else if ($action == CharAction.WALK) {
                super.play(CharAction.WALK_MOUNT);
            } else {
                if (this.mountChar.visible) {
                    super.play(CharAction.STAND_MOUNT);
                } else {
                    super.play(CharAction.JUMP);
                }
            }
            return this.mountChar.play($action, $completeState, needFollow);
        } else {
            return super.play($action, $completeState, needFollow)
        }

     
    }

} 
