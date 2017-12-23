﻿class ResGC {
    protected _dic: Object;

    public constructor() {
        this._dic = new Object();
        TimeUtil.addTimeTick(1000000, () => { this.gc(); });
    }

    public gc(): void {
        for (var key in this._dic) {
            var rc: ResCount = this._dic[key];
            if (rc.useNum <= 0){
                rc.idleTime ++;

                if (rc.idleTime >= ResCount.GCTime){
                    console.log("清理 -" + key);
                    rc.destory();
                    delete this._dic[key];
                }

            }
        }
    }

} 