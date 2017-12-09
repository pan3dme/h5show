module scene2d {
    export
        class Scene2dChar extends SceneChar {
        public applyWalk($item: Array<Vector2D>): void {

            if ($item && $item.length == 2) {
                //排除是停止的路径将不处理
                if ($item[0].x == $item[1].x && $item[0].y == $item[1].y) {
                    console.log("收到寻路坐标是在原地==>", $item)
                    this._speedDirect = null;
                    this._walkPath = null;
                    if (this.curentAction == CharAction.WALK) {
                        this.play(CharAction.STANAD);
                    }
                    var $k: Vector3D = AstarUtil.getWorldPosByStart2D($item[0]);
                    this.px = $k.x;
                    this.pz = $k.z;
                    return;
                }
            }
            this.walkPath = SceneAstarModel.getInstance().Path2dTo3d($item);


        }
        public refreshY(): void {
            this.py = 0
            this.refreshPos();
        }

    }
}