var AstarUtil = /** @class */ (function () {
    function AstarUtil() {
    }
    AstarUtil.setData = function ($tempNavMesh) {
        this.makeStarGraph($tempNavMesh.astarItem);
    };
    Object.defineProperty(AstarUtil, "sceneVectList", {
        set: function (value) {
            this._sceneVectList = value;
            this._frist = true; //标记新进入场景时
        },
        enumerable: true,
        configurable: true
    });
    AstarUtil.getJumpDataByV2d = function ($tx, $ty) {
        return false;
    };
    AstarUtil.clear = function () {
    };
    AstarUtil.porcessBak = function (tf) {
        if (tf) {
            this.setData(this._bakData);
        }
        this._bakData = null;
    };
    AstarUtil.getHeightByPos = function ($pos) {
        return 0;
    };
    AstarUtil.getBaseHeightByBitmapdata = function ($xpos, $ypos) {
        var perX = $xpos - float2int($xpos);
        var perY = $ypos - float2int($ypos);
        var zero_zero = this.getBitmapDataHight(float2int($xpos), float2int($ypos));
        var zero_one = this.getBitmapDataHight(float2int($xpos), Math.ceil($ypos));
        var one_zero = this.getBitmapDataHight(Math.ceil($xpos), float2int($ypos));
        var one_one = this.getBitmapDataHight(Math.ceil($xpos), Math.ceil($ypos));
        var dis1 = (1 - perX) * (1 - perY);
        var dis2 = (1 - perX) * perY;
        var dis3 = perX * (1 - perY);
        var dis4 = perX * perY;
        var num = (dis1 * zero_zero + dis2 * zero_one + dis3 * one_zero + dis4 * one_one);
        return num;
    };
    AstarUtil.getBitmapDataHight = function ($tx, $ty) {
        return 0;
    };
    AstarUtil.Path2dTo3d = function (result) {
        var astarPosItem = new Array;
        for (var i = 0; i < result.length; i++) {
            astarPosItem.push(this.getWorldPosByStart2D(result[i]));
        }
        return astarPosItem;
    };
    AstarUtil.getWorldPosByStart2D = function (a) {
        var $v2d = new Vector2D;
        $v2d.x = AppDataArpg.sceneStagePos.x + a.x * MapConfig.pix15.x;
        $v2d.y = AppDataArpg.sceneStagePos.y + a.y * MapConfig.pix15.y;
        $v2d.x *= UIData.htmlScale;
        $v2d.y *= UIData.htmlScale;
        var $p = AppDataArpg.math2Dto3DGroundarpg($v2d);
        return $p;
    };
    AstarUtil.findPath3D = function ($a, $b) {
        if (!AstarUtil.getPosIsCanMove($b)) {
            $b = this.findNearLinePoint($a, $b);
        }
        var gridVec2DA = this.getGrapIndexByPos($a);
        var gridVec2DB = this.getGrapIndexByPos($b);
        if (this.getJumpDataByV2d(gridVec2DB.x, gridVec2DB.y)) {
            console.log("是跳跃区域不可寻路", gridVec2DB.x, gridVec2DB.y);
            return null;
        }
        if (!this.isGridCanWalk(gridVec2DB)) {
            return null;
        }
        if (!gridVec2DA) {
            console.log("逻辑格位置有错");
            return null;
        }
        if (this.findStraightLine(gridVec2DA, gridVec2DB)) {
            //console.log("直线走走走")
            return [gridVec2DA, gridVec2DB];
        }
        return this.findPath2D(gridVec2DA, gridVec2DB);
    };
    //是否可以直线走
    AstarUtil.findStraightLine = function ($a, $b) {
        var $nrm = new Vector2D($b.x - $a.x, $b.y - $a.y);
        $nrm.normalize();
        var d = Math.round(Vector2D.distance($a, $b));
        var p = new Vector2D;
        for (var i = 0; i < d; i++) {
            p.x = Math.floor($a.x + i * $nrm.x);
            p.y = Math.floor($a.y + i * $nrm.y);
            if (!this.isGridCanWalk(p)) {
                return false;
            }
            p.x = Math.ceil($a.x + i * $nrm.x);
            p.y = Math.ceil($a.y + i * $nrm.y);
            if (!this.isGridCanWalk(p)) {
                return false;
            }
            p.x = Math.round($a.x + i * $nrm.x);
            p.y = Math.round($a.y + i * $nrm.y);
            if (!this.isGridCanWalk(p)) {
                return false;
            }
        }
        return true;
    };
    AstarUtil.isGridCanWalk = function (p) {
        if (p) {
            if (!this.graphData.grid[p.y]) {
                return false;
            }
            if (!this.graphData.grid[p.y][p.x]) {
                return false;
            }
            if (this.graphData.grid[p.y][p.x].weight == 0) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log("没有这个点", p);
            return false;
        }
    };
    AstarUtil.findPath2D = function (gridVec2DA, gridVec2DB) {
        try {
            if (this.graphData && this.graphData.grid && gridVec2DA && gridVec2DB) {
                var start = this.graphData.grid[gridVec2DA.y][gridVec2DA.x];
                var end = this.graphData.grid[gridVec2DB.y][gridVec2DB.x];
                var result = astar.search(this.graphData, start, end);
                var pos2Ditem = new Array;
                pos2Ditem.push(gridVec2DA);
                for (var i = 0; i < result.length; i++) {
                    var a = new Vector2D(result[i].y, result[i].x);
                    pos2Ditem.push(a);
                }
                return this.simplifyAstar(pos2Ditem);
            }
        }
        catch (err) {
            console.log("在此处理错误2");
            throw new Error("findPath2D 在此处理错误");
        }
        return null;
    };
    //简化寻路结果
    AstarUtil.simplifyAstar = function ($arr) {
        var $num = 0;
        if ($arr.length > 1) {
            //   $arr.splice(0, 1);
        }
        if ($arr.length > 2) {
            var $back = new Array;
            $back.push($arr[0]); //加上首个
            for (var i = 2; i < $arr.length; i++) {
                var a = $back[$back.length - 1];
                var b = $arr[i - 1];
                var c = $arr[i];
                if (Math.atan2(b.y - a.y, b.x - a.x) != Math.atan2(c.y - a.y, c.x - a.x) || $num > 126) {
                    $back.push(b);
                }
                else {
                    $num++;
                }
            }
            $back.push($arr[$arr.length - 1]); //加上最后一个
            return $back;
        }
        else {
            return $arr;
        }
    };
    AstarUtil.findNearLinePoint = function ($a, $b) {
        while (Vector3D.distance($a, $b) > 5) {
            $b = this.moveA2B($b, $a, 1);
            if (AstarUtil.getPosIsCanMove($b)) {
                return $b;
                //break
            }
        }
        return $b;
    };
    AstarUtil.moveA2B = function (a, b, speed) {
        var c = b.subtract(a);
        c.normalize();
        c.scaleBy(speed);
        c = c.add(a);
        return c;
    };
    AstarUtil.getPosIsCanMove = function ($pos) {
        if (!this.graphData || !this.graphData.grid) {
            console.log("寻路这时是不可的a");
            return false;
        }
        var $kt = this.getGrapIndexByPos($pos);
        return this.isGridCanWalk($kt);
        //if (!$kt||!this.graphData.grid[$kt.y] || !this.graphData.grid[$kt.y][$kt.x]) {
        //    console.log("寻路这时是不可的b")
        //    return false
        //}
        //if ($kt && this.graphData.grid[$kt.y][$kt.x].weight) {
        //    return true;
        //} else {
        //    return false;
        //}
    };
    AstarUtil.makeStarGraph = function ($arr) {
        var $graphArr = new Array();
        this.canwalkItem.length = 0;
        for (var i = 0; i < $arr.length; i++) {
            var mt = new Array();
            for (var j = 0; j < $arr[i].length; j++) {
                if ($arr[i][j] == 1) {
                    mt.push(1);
                }
                else {
                    mt.push(0);
                }
            }
            $graphArr.push(mt);
        }
        this.graphData = new Graph($graphArr);
        this.graphData.diagonal = true;
    };
    AstarUtil.getGrapIndexByPos = function ($pos) {
        return new Vector2D(float2int($pos.x / this.midu), float2int($pos.z / this.midu));
    };
    AstarUtil.getScenePos = function ($x, $y) {
        var $temp = Groundposition.getGroundPos($x, $y);
        return this.getLookAtPos($temp);
    };
    AstarUtil.getLookAtPos = function ($hit3D) {
        var $cam3D = new Vector3D(Scene_data.cam3D.x, Scene_data.cam3D.y, Scene_data.cam3D.z);
        var nrm = $hit3D.subtract($cam3D);
        nrm.normalize();
        var $dis = 0;
        var backB;
        while (true) {
            $dis += 2;
            var $n = nrm.clone();
            $n.scaleBy($dis);
            var $XZ = $cam3D.add($n);
            var $y = AstarUtil.getHeightByPos($XZ);
            if ($y > $XZ.y) {
                backB = $XZ;
                break;
            }
            if ($dis > 1000) {
                backB = null;
                break;
            }
        }
        return backB;
    };
    AstarUtil.midu = 10;
    AstarUtil._frist = false;
    AstarUtil.canwalkItem = [];
    return AstarUtil;
}());
//# sourceMappingURL=AstarUtil.js.map