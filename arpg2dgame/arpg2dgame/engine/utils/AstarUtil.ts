class AstarUtil {
    constructor() {
    }


    public static midu: number = 10;

    public static areaRect:Rectangle

    public static setData($tempNavMesh: any): void {
       

        this.makeStarGraph($tempNavMesh.astarItem);

    }
    private static _sceneVectList: Array<Vector3D>;
    private static _frist:boolean=false
    public static set sceneVectList(value: Array<Vector3D>) {
        this._sceneVectList = value
        this._frist=true //标记新进入场景时

    }
  
    
    public static getJumpDataByV2d($tx: number, $ty: number): boolean {

        return false

    }



    private static _bakData:any;
    public static clear(): void {

    }

    public static porcessBak(tf:boolean):void{
        
        if(tf){
            this.setData(this._bakData)
        }

        this._bakData = null;

    }


    public static getHeightByPos($pos: Vector3D): number {

      return 0
    }


    public static getBaseHeightByBitmapdata($xpos: number, $ypos: number): number {
        var perX: number = $xpos - float2int($xpos);
        var perY: number = $ypos - float2int($ypos);

        var zero_zero: number = this.getBitmapDataHight(float2int($xpos), float2int($ypos))
        var zero_one: number = this.getBitmapDataHight(float2int($xpos), Math.ceil($ypos))
        var one_zero: number = this.getBitmapDataHight(Math.ceil($xpos), float2int($ypos))
        var one_one: number = this.getBitmapDataHight(Math.ceil($xpos), Math.ceil($ypos))

        var dis1: number = (1 - perX) * (1 - perY);
        var dis2: number = (1 - perX) * perY;
        var dis3: number = perX * (1 - perY);
        var dis4: number = perX * perY;

        var num: number = (dis1 * zero_zero + dis2 * zero_one + dis3 * one_zero + dis4 * one_one);

        return num;
    }
    private static getBitmapDataHight($tx: number, $ty: number): number {
        return 0
    }

  
    public static Path2dTo3d(result: Array<Vector2D>): Array<Vector3D> {
        var astarPosItem: Array<Vector3D> = new Array
        for (var i: number = 0; i < result.length; i++) {
            astarPosItem.push(this.getWorldPosByStart2D(result[i]))
        }
        return astarPosItem
    }
    public static getWorldPosByStart2D(a: Vector2D): Vector3D {
        var $v2d:Vector2D=new Vector2D
        $v2d.x = AppDataArpg.sceneStagePos.x + a.x * MapConfig.pix15.x ;
        $v2d.y = AppDataArpg.sceneStagePos.y + a.y * MapConfig.pix15.y;

        $v2d.x *= UIData.htmlScale
        $v2d.y *= UIData.htmlScale
        var $p: Vector3D = AppDataArpg.math2Dto3DGroundarpg($v2d);
      
        return $p
    }
    public static findPath3D($a: Vector3D, $b: Vector3D): Array<Vector2D> {
     
            if (!AstarUtil.getPosIsCanMove($b)) {
                $b = this.findNearLinePoint($a, $b)
            }
            var gridVec2DA: Vector2D = this.getGrapIndexByPos($a);
            var gridVec2DB: Vector2D = this.getGrapIndexByPos($b);

            if (this.getJumpDataByV2d(gridVec2DB.x, gridVec2DB.y)) {
                console.log("是跳跃区域不可寻路", gridVec2DB.x, gridVec2DB.y)
                return null;
            }

            if (!this.isGridCanWalk(gridVec2DB))
            {
                return null;
            }
            if (!gridVec2DA) {  //特殊处理如果出去了将直接跳到目的地
                console.log("逻辑格位置有错")
                return null;
            }
            if (this.findStraightLine(gridVec2DA, gridVec2DB)) {
                //console.log("直线走走走")
                return [gridVec2DA,gridVec2DB]
            }
            return this.findPath2D(gridVec2DA, gridVec2DB)
     
    }
    //是否可以直线走
    private static findStraightLine($a: Vector2D, $b: Vector2D): boolean
    {
        var $nrm: Vector2D = new Vector2D($b.x - $a.x, $b.y - $a.y);
        $nrm.normalize();
        var d: number = Math.round(Vector2D.distance($a, $b));
        var p: Vector2D = new Vector2D;
        for (var i: number = 0; i < d; i++)
        {
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
    }
    public static isGridCanWalk(p:Vector2D): boolean
    {
        if (p) {
            if (!this.graphData.grid[p.y]) {
                return false
            }
            if (!this.graphData.grid[p.y][p.x]) {
                return false
            }
            if (this.graphData.grid[p.y][p.x].weight == 0) {
                return false;
            } else {
                return true
            }
        } else {
            console.log("没有这个点", p);
            return false
        }
    }

    public static findPath2D(gridVec2DA: Vector2D, gridVec2DB: Vector2D): Array<Vector2D> {
        try {
            if (this.graphData && this.graphData.grid && gridVec2DA && gridVec2DB) {
                var start = this.graphData.grid[gridVec2DA.y][gridVec2DA.x];
                var end = this.graphData.grid[gridVec2DB.y][gridVec2DB.x];
                var result: Array<any> = astar.search(this.graphData, start, end);
                var pos2Ditem: Array<Vector2D> = new Array
                pos2Ditem.push(gridVec2DA)
                for (var i: number = 0; i < result.length; i++) {
                    var a: Vector2D = new Vector2D(result[i].y, result[i].x)
                    pos2Ditem.push(a)
                }
                return this.simplifyAstar(pos2Ditem);
            }
        }
        catch (err) {
            console.log("在此处理错误2");
            throw new Error("findPath2D 在此处理错误");
        }
     
        return null
    }
    //简化寻路结果
    private static simplifyAstar($arr: Array<Vector2D>): Array<Vector2D> {
        var $num: number = 0
        if ($arr.length>1) {
         //   $arr.splice(0, 1);
        }
        if ($arr.length > 2) {
            var $back: Array<Vector2D> = new Array;
            $back.push($arr[0]); //加上首个
   
            for (var i: number = 2; i < $arr.length; i++) {
                var a: Vector2D = $back[$back.length - 1];
                var b: Vector2D = $arr[i - 1];
                var c: Vector2D = $arr[i];
                if (Math.atan2(b.y - a.y, b.x - a.x) != Math.atan2(c.y - a.y, c.x - a.x) || $num > 126) {
                    $back.push(b);
                } else {
                    $num++
                }
            }
            $back.push($arr[$arr.length - 1]); //加上最后一个
            return $back
        } else {
            return $arr
        }
    }
    public static findNearLinePoint($a: Vector3D, $b: Vector3D): Vector3D {
        while (Vector3D.distance($a, $b) > 5) {
            $b = this.moveA2B($b, $a, 1)
            if (AstarUtil.getPosIsCanMove($b)) {
                return $b;
                //break
            }

        }
        return $b
    }
    private static moveA2B(a: Vector3D, b: Vector3D, speed: number): Vector3D {
        var c: Vector3D = b.subtract(a)
        c.normalize();
        c.scaleBy(speed)
        c = c.add(a)
        return c;

    }
    public static getPosIsCanMove($pos: Vector3D): boolean {

        if (!this.graphData || !this.graphData.grid) {
            console.log("寻路这时是不可的a")
            return false
        }
        var $kt: Vector2D = this.getGrapIndexByPos($pos);
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

       



    }

    public static canwalkItem: Array<Vector2D> = []
    public static makeStarGraph($arr: Array<Array<number>>): void {

        var $graphArr: Array<Array<number>> = new Array()
        this.canwalkItem.length = 0
        for (var i: number = 0; i < $arr.length; i++) {
            var mt: Array<number> = new Array()
            for (var j: number = 0; j < $arr[i].length; j++) {
                if ($arr[i][j] == 1) {
                    mt.push(1)
                } else {
                    mt.push(0)
                }
            }
            $graphArr.push(mt)
        }


        this.graphData = new Graph($graphArr);
        this.graphData.diagonal = true


    }
    public static graphData: Graph
    public static getGrapIndexByPos($pos: Vector3D): Vector2D {
     
            return new Vector2D(float2int($pos.x / this.midu), float2int($pos.z / this.midu))
     


    }

    public static getScenePos($x: number, $y: number): Vector3D {

        var $temp: Vector3D = Groundposition.getGroundPos($x,$y)
        return this.getLookAtPos($temp);
    }
   

   



    public static getLookAtPos($hit3D: Vector3D): Vector3D {


        var $cam3D: Vector3D = new Vector3D(Scene_data.cam3D.x, Scene_data.cam3D.y, Scene_data.cam3D.z)

        var nrm: Vector3D = $hit3D.subtract($cam3D)
        nrm.normalize()



        var $dis: number = 0
        var backB: Vector3D;
        while (true) {
            $dis += 2
            var $n: Vector3D = nrm.clone();
            $n.scaleBy($dis)
            var $XZ: Vector3D = $cam3D.add($n);
            var $y: number = AstarUtil.getHeightByPos($XZ)

            if ($y > $XZ.y) {
                backB = $XZ
                break
            }
            if ($dis > 1000)  //当向前1000都还没找到。就退出
            {
                backB = null
                break;
            }
        }

        return backB


    }


}