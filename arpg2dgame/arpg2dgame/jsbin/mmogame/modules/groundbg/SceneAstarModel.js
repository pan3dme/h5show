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
var SceneAstarModel = /** @class */ (function (_super) {
    __extends(SceneAstarModel, _super);
    function SceneAstarModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._showOrHide = false;
        _this.lastMouseDownTm = 0;
        return _this;
    }
    SceneAstarModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new SceneAstarModel();
        }
        return this._instance;
    };
    SceneAstarModel.prototype.showAstarLine = function () {
        if (!this._astarLineSprite) {
            ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader());
            this._astarLineSprite = new MulLineSprite();
        }
        this._showOrHide = !this._showOrHide;
        if (this._showOrHide) {
            SceneManager.getInstance().addDisplay(this._astarLineSprite);
            // this.drawTemp(AstarUtil.navmeshData.astarItem)
            this.drawTemp(MapConfig.getInstance().astarItem);
            var $k = AstarUtil.getWorldPosByStart2D(new Vector2D());
            this._astarLineSprite.x = $k.x;
            this._astarLineSprite.z = $k.z;
        }
        else {
            this.clearAstarLine();
        }
    };
    SceneAstarModel.prototype.clearAstarLine = function () {
        this._astarLineSprite.clear();
        this._astarLineSprite.upToGpu();
    };
    SceneAstarModel.prototype.mouseDownFindLoad = function ($evt) {
        this.lastMouseDownTm = TimeUtil.getTimer();
    };
    SceneAstarModel.prototype.mouseMoveFindLoad = function ($evt) {
        this.lastMouseDownTm = 0;
    };
    SceneAstarModel.prototype.mouseUpFindLoad = function ($evt) {
        if (!GameInstance.mainChar) {
            return;
        }
        if ((TimeUtil.getTimer() - this.lastMouseDownTm) < 200) {
            var $hitSceneChar = this.findHitChat(new Vector2D($evt.x, $evt.y));
            GameInstance.attackTarget = $hitSceneChar;
            if ($hitSceneChar) {
                AotuSkillManager.getInstance().aotuBattle = true;
                AppDataArpg.lockMainChar = true;
            }
            else {
                AotuSkillManager.getInstance().aotuBattle = false;
                var $beginV2 = this.getAstarBySceneV3D(new Vector3D(GameInstance.mainChar.x, 0, GameInstance.mainChar.z));
                var $toV2 = this.getAstarSceneByMouse($evt);
                var item = AstarUtil.findPath2D($beginV2, $toV2);
                if (item && item.length) {
                    MainCharControlModel.getInstance().setWalkPathFun(item);
                }
            }
        }
    };
    SceneAstarModel.prototype.findHitChat = function ($evt) {
        var $hitPos = AppDataArpg.math2Dto3DGroundarpg(new Vector2D($evt.x / 2, $evt.y / 2));
        if ($hitPos) {
            var $camVec = new Vector3D;
            $camVec.x = Scene_data.cam3D.x;
            $camVec.y = Scene_data.cam3D.y;
            $camVec.z = Scene_data.cam3D.z;
            for (var i = 0; i < GameInstance.roleList.length; i++) {
                var $sceneChar = GameInstance.roleList[i];
                if (!$sceneChar.unit.isMain && $sceneChar.mouseClik($camVec, $hitPos)) {
                    return $sceneChar;
                }
            }
        }
        return null;
    };
    //收获鼠标的A星坐标
    SceneAstarModel.prototype.getAstarSceneByMouse = function ($evt) {
        var mouse2D = new Vector2D();
        mouse2D.x = $evt.x / MapConfig.Scale - AppDataArpg.sceneStagePos.x;
        mouse2D.y = $evt.y / MapConfig.Scale - AppDataArpg.sceneStagePos.y;
        mouse2D.x = Math.round(mouse2D.x / MapConfig.pix15.x);
        mouse2D.y = Math.round(mouse2D.y / MapConfig.pix15.y);
        return mouse2D;
    };
    //3d世界坐标得到2D坐标
    SceneAstarModel.prototype.getAstarBySceneV3D = function ($v3d) {
        var $v2 = AppDataArpg.getScene2DBy3Dpostion($v3d);
        $v2.x = Math.round($v2.x / MapConfig.pix15.x);
        $v2.y = Math.round($v2.y / MapConfig.pix15.y);
        return $v2;
    };
    SceneAstarModel.prototype.drawTemp = function (astarItem) {
        this._astarLineSprite.clear();
        this._astarLineSprite.baseColor = new Vector3D(0.6, 0.6, 0.6, 1);
        var w = astarItem[0].length;
        var h = astarItem.length;
        var miduX15 = MapConfig.pix15.x / MapConfig.Scale * UIData.htmlScale;
        var miduY15 = MapConfig.pix15.y / MapConfig.Scale * UIData.htmlScale;
        var $hscale = 1 / Math.sin(45 * Math.PI / 180);
        for (var i = 0; i < astarItem.length; i++) {
            for (var j = 0; j < astarItem[i].length; j++) {
                if (astarItem[i][j] == 1) {
                    var pos = new Vector3D(j * miduX15, 0, -i * miduY15);
                    pos.z = pos.z * $hscale;
                    var $a = new Vector3D(pos.x, pos.y, pos.z);
                    var $b = new Vector3D(pos.x + miduX15, pos.y, pos.z);
                    var $c = new Vector3D(pos.x + miduX15, pos.y, pos.z - miduY15 * $hscale);
                    var $d = new Vector3D(pos.x, pos.y, pos.z - miduY15 * $hscale);
                    this._astarLineSprite.makeLineMode($a, $b);
                    this._astarLineSprite.makeLineMode($a, $d);
                    if (astarItem[i + 1] && astarItem[i + 1][j] != 1) {
                        this._astarLineSprite.makeLineMode($c, $d);
                    }
                    if (astarItem[i][j + 1] && astarItem[i][j + 1] != 1) {
                        this._astarLineSprite.makeLineMode($b, $c);
                    }
                }
            }
        }
        this._astarLineSprite.upToGpu();
    };
    return SceneAstarModel;
}(UIPanel));
//# sourceMappingURL=SceneAstarModel.js.map