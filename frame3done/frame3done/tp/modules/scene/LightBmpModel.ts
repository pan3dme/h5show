class LightBmpModel
{
    constructor() {

    }
    private static _instance: LightBmpModel;
    public static getInstance(): LightBmpModel {
        if (!this._instance) {
            this._instance = new LightBmpModel();
        }
        return this._instance;
    }
    public videoLightUvData:Array<Array<any>> 
    public videoTextureRes: TextureRes
    public upLightTexture($frameVoItem: Array<FrameFileNode>): void
    {
        var $frame: number = Math.floor(Frame3dRes.frameNum)
        for (var i: number = 0; $frameVoItem && i < $frameVoItem.length; i++) {
            var $node: FrameFileNode = $frameVoItem[i]
            var $isVisible: boolean = $node.isVisible($frame);
            if ($isVisible && !$node.frameNodeVo.noLight) {
                var $dis: LightDisplay3DSprite = <LightDisplay3DSprite>$node.sprite;
                var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(1024, 1024, false);
                $ctx.drawImage(this.videoElem, 0, 0, this.videoElem.videoWidth, this.videoElem.videoHeight, 0, 0, 1024, 1024);
                if (!this.videoTextureRes) {
                    this.videoTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);
                }
                TextureManager.getInstance().updateTexture(this.videoTextureRes.texture, 0, 0, $ctx);
                $dis.lightMapTextureRes = this.videoTextureRes;
                this.setVdeoLightUvData($node, $frame);
            }
        }
    }
    private setVdeoLightUvData($node: FrameFileNode, $frame:number): void
    {
        if (this.videoLightUvData) {
            for (var i: number = 0; i < this.videoLightUvData[$frame].length; i++) {
                var $obj: any = this.videoLightUvData[$frame][i]
                if ($obj.id == $node.frameNodeVo.id) {
                    if ($node.frameNodeVo.receiveShadow) {
                        var $disA: ShadowDisplay3DSprite = <ShadowDisplay3DSprite>$node.sprite;
                        $disA.uxtxData[0] = $obj.width / 1024;
                        $disA.uxtxData[1] = $obj.height / 1024;
                        $disA.uxtxData[2] = $obj.x / 1024;
                        $disA.uxtxData[3] = $obj.y / 1024;
                    } else {
                        var $dis: LightDisplay3DSprite = <LightDisplay3DSprite>$node.sprite;
                        $dis.uxtxData[0] = $obj.width / 1024;
                        $dis.uxtxData[1] = $obj.height / 1024;
                        $dis.uxtxData[2] = $obj.x / 1024;
                        $dis.uxtxData[3] = $obj.y / 1024;
                    }
              
                }
            }
        }
    }
    public videoElem: HTMLVideoElement


    private getLightKeyFrmeArr($arr: Array<FrameFileNode>): Array<number>
    {
        var $dis: Dictionary = new Dictionary([])
        for (var i: number = 0; i < $arr.length; i++) {
            for (var j: number = 0; j < $arr[i].frameNodeVo.pointitem.length; j++) {
                if ($arr[i].frameNodeVo.pointitem[j].iskeyFrame&&j==0) {
                    var $frmeNum: number = $arr[i].frameNodeVo.pointitem[j].time
                    $dis[$frmeNum] = true
                }
            }
        }
        var $listNum: Array<number> = new Array;
        for (var $key in $dis) {
            if (!isNaN(Number($key))) {
                $listNum.push(Number($key))
            }
        }
        return $listNum
    }
}