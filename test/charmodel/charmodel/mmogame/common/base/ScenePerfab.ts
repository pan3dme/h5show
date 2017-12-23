class ScenePerfab extends Display3dMovie {

    public infoObj:any
    public setPerfabName($str: string): void {
        this.addPart("abcdef", "abcdef", getModelUrl($str));
    }


}