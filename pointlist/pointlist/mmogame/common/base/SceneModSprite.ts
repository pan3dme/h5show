class SceneModSprite extends Display3DSprite {

    public setModelById($str: string): void {
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), (groupRes: GroupRes) => {
            for (var i: number = 0; i < groupRes.dataAry.length; i++) {
                var item: GroupItem = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    this.setObjUrl(item.objUrl);
                    this.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                    this.dynamic = true;
                    break;
                }
            }
        })
    }

}