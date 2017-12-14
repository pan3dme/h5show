var MapConfig = /** @class */ (function () {
    function MapConfig() {
        this._singSeparate = ",";
        /**日期*/
        this.dateStr = "";
        /**小地图缩放比*/
        this.thumbScale = 1;
        /**地图宽度*/
        this.pxWidth = 0;
        /**地图高度*/
        this.pxHeight = 0;
        /**行*/
        this.row = 0;
        /**列*/
        this.column = 0;
        /**网格宽*/
        this.tileWidth = 48;
        /**网格高*/
        this.tileHeight = 24;
        /**地图类型*/
        this.mapType = 0;
        this.obstacleMask = new UpdateMask();
    }
    MapConfig.getInstance = function () {
        if (!this._instance) {
            this._instance = new MapConfig();
        }
        return this._instance;
    };
    MapConfig.prototype.anlyData = function (data) {
        this.obstacleMask = new UpdateMask();
        var configText = data.split("\n");
        var first = configText[0].split(this._singSeparate);
        //第一行 基本配置
        this.id = parseInt(first[0]), this.name = first[1], this.dateStr = first[2], this.pxWidth = Number(first[3]), this.pxHeight = Number(first[4]);
        this.sliceWidth = Number(first[5]) || 512;
        this.sliceHeight = Number(first[6]) || 512;
        this.column = Number(first[7]);
        this.row = Number(first[8]);
        this.tileWidth = Number(first[14]) || 48;
        this.tileHeight = Number(first[15]) || 24;
        var obstacleInfo = configText[1].split(this._singSeparate);
        var len = obstacleInfo.length;
        var i;
        for (i = 0; i < len; i++) {
            this.obstacleMask.baseByteArray.writeUnsignedInt(Number(obstacleInfo[i]));
        }
        this.makeAstarItem();
    };
    MapConfig.prototype.makeAstarItem = function () {
        this.astarItem = new Array();
        for (var j = 0; j < this.row; j++) {
            var $arr = new Array;
            for (var i = 0; i < this.column; i++) {
                $arr.push(this.isBlock(i, j) ? 0 : 1);
            }
            this.astarItem.push($arr);
        }
    };
    MapConfig.prototype.isBlock = function (x, y) {
        if (x < 0 || x >= this.column || y < 0 || y >= this.row) {
            return true;
        }
        return this.obstacleMask.GetBit(this.column * y + x);
    };
    MapConfig.pix15 = new Vector2D(24, 24);
    MapConfig.Scale = 1;
    return MapConfig;
}());
//# sourceMappingURL=MapConfig.js.map