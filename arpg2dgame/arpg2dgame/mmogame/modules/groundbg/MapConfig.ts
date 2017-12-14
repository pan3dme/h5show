


class MapConfig {
    public static pix15: Vector2D = new Vector2D(24, 24);
    public static Scale:number=1
    private static _instance: MapConfig;
    public static getInstance(): MapConfig {
        if (!this._instance) {
            this._instance = new MapConfig();
        }
        return this._instance;
    }
    protected _singSeparate: string = ",";
    public id: number;
    /**场景名称*/
    public name: string;
    /**日期*/
    public dateStr: string = "";
    /**背景音乐*/
    public bgMusicPath: string;
    /**小地图缩放比*/
    public thumbScale: number = 1;
    /**小地图加载地址*/
    public smallMapPath: string;
    /**地图宽度*/
    public pxWidth: number = 0;
    /**地图高度*/
    public pxHeight: number = 0;
    /**行*/
    public row: number = 0;
    /**列*/
    public column: number = 0;
    /**切片宽度*/
    public sliceWidth: number;
    /**切片高度*/
    public sliceHeight: number;
    /**网格宽*/
    public tileWidth: number = 48;
    /**网格高*/
    public tileHeight: number = 24;
    /**地图类型*/
    public mapType: number = 0;
    /**是否副本*/
    public isCopyMap: boolean;

    public obstacleMask: UpdateMask;

    public constructor() {
        this.obstacleMask = new UpdateMask();
    }
    public anlyData(data: string): void {
        this.obstacleMask = new UpdateMask();
        var configText: Array<string> = data.split("\n");
        var first: Array<string> = configText[0].split(this._singSeparate);
        //第一行 基本配置
        this.id = parseInt(first[0]), this.name = first[1], this.dateStr = first[2], this.pxWidth = Number(first[3]), this.pxHeight = Number(first[4]);
        this.sliceWidth = Number(first[5]) || 512;
        this.sliceHeight = Number(first[6]) || 512;
        this.column = Number(first[7]);
        this.row = Number(first[8]);
        this.tileWidth = Number(first[14]) || 48;
        this.tileHeight = Number(first[15]) || 24;

        var obstacleInfo: Array<string> = configText[1].split(this._singSeparate);
        var len: number = obstacleInfo.length;
        var i: number;
        for (i = 0; i < len; i++) {
            this.obstacleMask.baseByteArray.writeUnsignedInt(Number(obstacleInfo[i]));
        }
        this.makeAstarItem()
    }
    public astarItem: Array<Array<number>>
    private makeAstarItem(): void
    {
        this.astarItem=new Array()
        for (var j: number = 0; j < this.row; j++) {
            var $arr: Array<number> = new Array
            for (var i: number = 0; i < this.column; i++) {
                $arr.push(this.isBlock(i, j) ? 0 : 1);
            }
            this.astarItem.push($arr);
        }
     
    }
    public isBlock(x: number, y: number): Boolean {
        if (x < 0 || x >= this.column || y < 0 || y >= this.row) {
            return true;
        }
        return this.obstacleMask.GetBit(this.column * y + x);
    }

}