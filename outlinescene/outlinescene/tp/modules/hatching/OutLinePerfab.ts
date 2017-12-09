
class OutLinePerfab extends ScenePerfab {
    constructor() {
        super();
        this._uvscaleData = [1, 1]
    }
    protected loadPartRes($bindSocket: string, groupRes: GroupRes, ary: Array<any>): void {
        for (var i: number = 0; i < groupRes.dataAry.length; i++) {
            var item: GroupItem = groupRes.dataAry[i];
            if (item.types == BaseRes.PREFAB_TYPE) {
                var display: OutLineSprite = new OutLineSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                display.dynamic = true;
                ary.push(display);
                display.setBind(this, $bindSocket);
                SceneManager.getInstance().addDisplay(display);
            }
        }

        this.updateMatrix();

        this.uvscaleData = this._uvscaleData;
    }
    public set uvscaleData(value: Array<number>) {
        this._uvscaleData = value;
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: OutLineSprite = <OutLineSprite>this.item[i];
            if ($dis) {
                $dis.uvscaleData = this._uvscaleData
            }
        }
    }
    private _uvscaleData: Array<number>
    public get uvscaleData(): Array<number> {
        return this._uvscaleData;
    }

    public updateMatrix(): void {
        super.updateMatrix();
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: Display3DSprite = <Display3DSprite>this.item[i];
            if ($dis) {
                $dis.posMatrix = this.posMatrix.clone()
            }
        }
    }

    protected item: Array<Display3D>
    public setPerfabName($str: string): void {
        this.item = new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), (groupRes: GroupRes) => {
            this.loadPartRes("", groupRes, this.item)
        })
    }
    public updateRotationMatrix(): void {
        super.updateRotationMatrix();
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: Display3DSprite = <Display3DSprite>this.item[i];
            if ($dis && $dis._rotationData) {
                if ($dis._rotationData) {
                    this._rotationMatrix.getRotaion($dis._rotationData);
                }
            }
        }
    }

}