class FrameBuildSprite extends DirectShadowDisplay3DSprite {
    constructor() {
        super();
    }
    public setFrameNodeUrl($vo: FrameNodeVo): void {
        this.groupItem = new Array()
        var $dis: Display3DSprite = new Display3DSprite();
        $dis._rotationData = new Float32Array(9)
        $dis.setObjUrl($vo.resurl)
        $dis.setPicUrl($vo.materialInfoArr[0].url)
        $dis.sceneVisible = false
        this.groupItem.push($dis);
    }
    public update(): void {
        if (this.sceneVisible) {
            Scene_data.context3D.setWriteDepth(true);
            super.update()
        }
    }

}