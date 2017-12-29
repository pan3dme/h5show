class ScenePerfab extends Display3dMovie {

    private item:Array<Display3D>
    public setPerfabName($str: string): void {
        this.item= new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), (groupRes: GroupRes) => {
            this.loadPartRes("", groupRes, this.item)
        })
    }
    public updateRotationMatrix(): void {
        super.updateRotationMatrix();
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: Display3DSprite = <Display3DSprite>this.item[i];
            if ($dis && $dis.rotationData) {
                if ($dis.rotationData) {
                    this._rotationMatrix.getRotaion($dis.rotationData);
                }
            }
        }
    }
}