class TpGame {
    public static getArrByStr(str: String): Array<string> {
        var boneNameAry: Array<string> = str.split(/\s+/g);
        for (var i: number = boneNameAry.length - 1; i >= 0; i--) {
            if (String(boneNameAry[i]).length < 1) {
                boneNameAry.splice(i, 1);
            }
        }
        return boneNameAry;
    }


    /**是否是外网 */
    public static outNet: boolean = false;
    public static GM: boolean = true
    public static ready: boolean = false;
    public uiReadyNum: number = 0;
    public uiAllNum: number = 0;
    public init(): void {

        this.loadDataComplet();
    }
    private loadDataComplet(): void {
  
        Scene_data.fileRoot = "res/";
      // GameInstance.initData();
    // Engine.initPbr();
        Md5MouseManager.getInstance().addMouseEvent();
        Md5MouseEventModel.getInstance().initSceneFocueEvent();

        this.addGridLineSprite();
        this.makeMd5MoveSprite();
        Scene_data.cam3D.distance = 250;
    }
    private makeMd5MeshSprite(): void {
        var $sc: md5list.Md5MeshSprite = new md5list.Md5MeshSprite();
        $sc.setMd5BodyUrl("2/body.md5mesh");
        SceneManager.getInstance().addSpriteDisplay($sc);
    }

    private makeMd5MoveSprite(): void {
        var $sc: md5list.Md5MoveSprite = new md5list.Md5MoveSprite();
        $sc.setMd5url("2/body.md5mesh", "2/stand.md5anim", "shuangdaonv.jpg")
        SceneManager.getInstance().addSpriteDisplay($sc);
    }
    private addGridLineSprite(): void {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;

    }
}