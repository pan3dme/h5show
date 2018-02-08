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
var CharUint = /** @class */ (function (_super) {
    __extends(CharUint, _super);
    function CharUint() {
        var _this = _super.call(this) || this;
        if (!CharUint.skipId) {
            CharUint.skipId = 1;
        }
        CharUint.skipId++;
        _this.inScene = false;
        _this.guid = CharUint.skipId;
        _this._hp = 100;
        _this._maxhp = 100;
        _this.isDeath = false;
        return _this;
    }
    CharUint.prototype.addChar = function () {
        if (!this.inScene) {
            this.inScene = true;
            this.char = this.addRole(new Vector3D(this.x, this.y, this.z), this.avatar);
            this.char.rotationY = this.rotationY;
            this.char.charUint = this;
            this.char.charUint.isDeath = false;
            this.char.charUint.setHp(this.char.charUint.getMaxHp());
            if (this.isMain) {
                this.char.showBlood(0);
            }
            else {
                if (this.type == 0) {
                    this.char.showBlood(1);
                }
            }
        }
    };
    CharUint.prototype.removeChar = function () {
        if (this.inScene) {
            this.inScene = false;
            if (this.char) {
                SceneManager.getInstance().removeMovieDisplay(this.char);
                this.char.destory();
                this.char = null;
            }
        }
    };
    CharUint.prototype.addRole = function ($pos, $avatar) {
        var $sc = new SceneChar();
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
    };
    CharUint.prototype.getHp = function () {
        return this._hp;
    };
    CharUint.prototype.setHp = function (value) {
        this._hp = value;
    };
    CharUint.prototype.getMaxHp = function () {
        return this._maxhp;
    };
    CharUint.prototype.setMaxHp = function (value) {
        this._maxhp = value;
    };
    return CharUint;
}(Object3D));
var SceneChar = /** @class */ (function (_super) {
    __extends(SceneChar, _super);
    function SceneChar() {
        var _this = _super.call(this) || this;
        _this.speedTX = (1.5 / 20) * 1.5;
        _this.life = 0;
        _this._px = 0;
        _this._py = 0;
        _this._pz = 0;
        _this._pRotationY = 0;
        _this.tittleHeight = 50;
        _this.toRotationY = 0;
        _this.shadow = true;
        return _this;
    }
    Object.defineProperty(SceneChar.prototype, "px", {
        get: function () {
            return this._px;
        },
        set: function (val) {
            this._px = val;
            this.x = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneChar.prototype, "py", {
        get: function () {
            return this._py;
        },
        set: function (val) {
            this._py = val;
            this.y = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneChar.prototype, "pz", {
        get: function () {
            return this._pz;
        },
        set: function (val) {
            this._pz = val;
            this.z = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneChar.prototype, "forceRotationY", {
        /**强制角度 */
        set: function (val) {
            this.pRotationY = val;
            this.rotationY = val;
            this.toRotationY = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneChar.prototype, "pRotationY", {
        get: function () {
            return this._pRotationY;
        },
        set: function (val) {
            this._pRotationY = val;
            this.rotationY = val;
        },
        enumerable: true,
        configurable: true
    });
    SceneChar.prototype.refreshTittle = function () {
        this.refreshPos();
    };
    SceneChar.prototype.showName = function ($color) {
        if ($color === void 0) { $color = null; }
        this.refreshPos();
    };
    SceneChar.prototype.showBlood = function ($colorType) {
        if ($colorType === void 0) { $colorType = 0; }
        if (!this._charBloodVo) {
            this._charBloodVo = BloodManager.getInstance().getBloodLineMeshVo();
            this._charBloodVo.colortype = $colorType;
        }
        else {
            this._charBloodVo.colortype = $colorType;
        }
        this.refreshPos();
    };
    SceneChar.prototype.onMeshLoaded = function () {
        if (this._skinMesh) {
            this.tittleHeight = this._skinMesh.tittleHeight;
            if (this.loadFinishFun) {
                this.loadFinishFun();
            }
        }
    };
    SceneChar.prototype.refreshPos = function () {
        //处理血条和名字位置 -FIXME--0
        if (this._charBloodVo) {
            this._charBloodVo.pos.x = this.px;
            this._charBloodVo.pos.z = this.pz;
            this._charBloodVo.pos.y = this.py + this.tittleHeight;
            this._charBloodVo.visible = this.visible;
        }
    };
    SceneChar.prototype.refreshLifeNum = function () {
        this.life = this.charUint.getHp() / this.charUint.getMaxHp() * 100;
        if (this._charBloodVo) {
            this._charBloodVo.num = this.life;
        }
    };
    Object.defineProperty(SceneChar.prototype, "walkPath", {
        set: function ($wp) {
            if ($wp.length == 0) {
                return;
            }
            //  console.log("收到寻路信息",$wp,  TimeUtil.getTimer())
            //console.log("改变行走CharAction.WALK")
            if (!this.curentAction || this.curentAction == CharAction.STANAD || this.curentAction == CharAction.STAND_MOUNT) {
                this.play(CharAction.WALK);
            }
            this._walkPath = $wp;
            this.setTarget();
        },
        enumerable: true,
        configurable: true
    });
    //得到A星数据后重新刷坐标
    SceneChar.prototype.fixAstartData = function (pos) {
        if (this._walkPath) {
            for (var i = 0; i < this._walkPath.length; i++) {
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
    };
    SceneChar.prototype.applyWalk = function ($item) {
        if ($item && $item.length == 2) {
            //排除是停止的路径将不处理
            if ($item[0].x == $item[1].x && $item[0].y == $item[1].y) {
                return;
            }
        }
        this.walkPath = AstarUtil.Path2dTo3d($item);
    };
    Object.defineProperty(SceneChar.prototype, "moveToPos2D", {
        set: function ($v2d) {
            // $v2d=new Vector2D(154,87)
            this._walkPath = null;
            this.play(this._defaultAction);
            var pos = AstarUtil.getWorldPosByStart2D($v2d);
            this.px = pos.x;
            this.pz = pos.z;
            this.refreshY();
        },
        enumerable: true,
        configurable: true
    });
    SceneChar.prototype.stopToPos = function ($v2d) {
        var pos = AstarUtil.getWorldPosByStart2D($v2d);
        var arr = new Array;
        arr.push(pos);
        this.walkPath = arr;
    };
    SceneChar.prototype.moveTile = function (xt, yt) {
        this.moveToPos2D = new Vector2D(xt, yt);
    };
    SceneChar.prototype.updateFrame = function (t) {
        _super.prototype.updateFrame.call(this, t);
        if (this._walkPath) {
            this.walkAstar(t);
            this.refreshY();
        }
        if (this._rotationMatrix) {
            this.rotationToNew(this.toRotationY, 2);
        }
    };
    //平滑num=1为直接
    SceneChar.prototype.rotationToNew = function (value, num) {
        if (num === void 0) { num = 1; }
        var anum = value - this.pRotationY;
        if (anum == 0) {
            return;
        }
        if (anum < 1) {
            this.pRotationY = value;
            return;
        }
        var a = ((value - this.pRotationY) % 360 + 360) % 360;
        if (a > 180) {
            this.pRotationY -= (360 - a) / num;
        }
        else {
            this.pRotationY += a / num;
        }
    };
    SceneChar.prototype.refreshY = function () {
        this.py = AstarUtil.getHeightByPos(this.getCurrentPos());
        this.refreshPos();
    };
    Object.defineProperty(SceneChar.prototype, "speedUseTime", {
        //设计毫秒走每个格子，
        set: function (value) {
            this.speedTX = 0.01 * (value / 10);
        },
        enumerable: true,
        configurable: true
    });
    SceneChar.prototype.walkAstar = function (t) {
        var $wk = Math.min(t, 50);
        var distance = Vector3D.distance(new Vector3D(this.px, 0, this.pz), this._astatTopos);
        if (distance > 5) {
            var sn = $wk * this.speedTX;
            if (sn > distance) {
                this.px = this._astatTopos.x;
                this.pz = this._astatTopos.z;
                var tempT = (sn - distance) / this.speedTX;
                this.walkAstar(tempT);
            }
            else {
                this.px += this._astarDirect.x * sn;
                this.pz += this._astarDirect.z * sn;
            }
        }
        else {
            this.setTarget();
            if (!this._walkPath) {
                this.px = this._astatTopos.x;
                this.pz = this._astatTopos.z;
                this.walkComplete();
            }
            else {
                this.walkAstar(t);
            }
        }
    };
    SceneChar.prototype.changeAction = function ($action) {
        _super.prototype.changeAction.call(this, $action);
        if (this.changeActionFun) {
            this.changeActionFun($action);
        }
    };
    SceneChar.prototype.walkComplete = function () {
        if (this.walkCompleteBackFun) {
            this.walkCompleteBackFun();
        }
    };
    SceneChar.prototype.setTarget = function () {
        if (!this._walkPath) {
            return;
        }
        if (this._walkPath.length == 0) {
            this._walkPath = null;
            this.play(CharAction.STANAD);
            return;
        }
        this._astatTopos = this._walkPath.shift();
        this.setAstarNrmAndRotation();
    };
    //计算移动角度和寻路方向 
    SceneChar.prototype.setAstarNrmAndRotation = function () {
        if (this._astatTopos) {
            this._astarDirect = this._astatTopos.subtract(this.getCurrentPos());
            this._astarDirect.y = 0;
            this._astarDirect.normalize();
            if (Vector3D.distance(this.getCurrentPos(), this._astatTopos) > 10) {
                this.toRotationY = this.mathAngle(this._astatTopos.z, this._astatTopos.x, this.pz, this.px) + 180;
            }
        }
    };
    SceneChar.prototype.mathAngle = function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    };
    SceneChar.prototype.stopMove = function () {
        this.play(CharAction.STANAD);
        this._walkPath = null;
    };
    SceneChar.prototype.getEndWalkPathPos = function () {
        if (this._walkPath) {
            return this._walkPath[this._walkPath.length - 1];
        }
        else {
            return null;
        }
    };
    SceneChar.prototype.watch = function ($obj, $syn) {
        if ($syn === void 0) { $syn = false; }
        if (!$obj) {
            console.log("面向对象无");
            return;
        }
        var xx = $obj.x - this.px;
        var yy = $obj.z - this.pz;
        var distance = Math.sqrt(xx * xx + yy * yy);
        xx /= distance;
        yy /= distance;
        var angle = Math.asin(xx) / Math.PI * 180;
        if (yy <= 0) {
            angle = 180 - angle;
        }
        if (!isNaN(angle)) {
            this.forceRotationY = angle;
        }
    };
    SceneChar.prototype.getCurrentPos = function () {
        return new Vector3D(this.px, this.py, this.pz);
    };
    SceneChar.prototype.getAstarPos = function () {
        return AstarUtil.getGrapIndexByPos(this.getCurrentPos());
    };
    SceneChar.prototype.removeStage = function () {
        _super.prototype.removeStage.call(this);
        if (this._charBloodVo) {
            this._charBloodVo.visible = false;
        }
    };
    SceneChar.prototype.addStage = function () {
        _super.prototype.addStage.call(this);
        if (this._charBloodVo) {
            this._charBloodVo.visible = true;
        }
    };
    SceneChar.prototype.playSkill = function ($skill) {
        this._walkPath = null;
        SkillManager.getInstance().playSkill($skill);
    };
    SceneChar.prototype.setWeaponByAvatar = function (avatar, $suffix) {
        if ($suffix === void 0) { $suffix = ""; }
        this.addPart(SceneChar.WEAPON_PART, SceneChar.WEAPON_DEFAULT_SLOT, getModelUrl("ccav"));
    };
    SceneChar.prototype.destory = function () {
        if (this._hasDestory) {
            return;
        }
        _super.prototype.destory.call(this);
        //清理血条和名称 -FIXME-0
        if (this._charNameVo) {
            this._charNameVo.destory();
            this._charNameVo = null;
        }
        if (this._charBloodVo) {
            this._charBloodVo.destory();
            this._charBloodVo = null;
        }
    };
    SceneChar.prototype.setMount = function ($mountId) {
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
    };
    SceneChar.prototype.setWing = function ($wingId) {
        if (!this._wingDisplay) {
            this._wingDisplay = new Display3dMovie();
        }
        this._wingDisplay.setRoleUrl(getRoleUrl($wingId));
        this._wingDisplay.setBind(this, SceneChar.WING_SLOT);
        SceneManager.getInstance().addMovieDisplay(this._wingDisplay);
    };
    SceneChar.prototype.play = function ($action, $completeState, needFollow) {
        if ($completeState === void 0) { $completeState = 0; }
        if (needFollow === void 0) { needFollow = true; }
        if (this.mountChar) {
            this.mountChar.visible = Boolean($action != CharAction.JUMP);
            if ($action == CharAction.STANAD) {
                _super.prototype.play.call(this, CharAction.STAND_MOUNT);
            }
            else if ($action == CharAction.WALK) {
                _super.prototype.play.call(this, CharAction.WALK_MOUNT);
            }
            else {
                if (this.mountChar.visible) {
                    _super.prototype.play.call(this, CharAction.STAND_MOUNT);
                }
                else {
                    _super.prototype.play.call(this, CharAction.JUMP);
                }
            }
            return this.mountChar.play($action, $completeState, needFollow);
        }
        else {
            return _super.prototype.play.call(this, $action, $completeState, needFollow);
        }
    };
    SceneChar.WEAPON_PART = "weapon";
    SceneChar.WEAPON_DEFAULT_SLOT = "w_01";
    SceneChar.MOUNT_SLOT = "mount_01";
    SceneChar.WING_SLOT = "wing_01";
    return SceneChar;
}(SceneBaseChar));
//# sourceMappingURL=SceneChar.js.map