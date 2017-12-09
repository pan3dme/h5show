var TpGame = /** @class */ (function () {
    function TpGame() {
        this.uiReadyNum = 0;
        this.uiAllNum = 0;
    }
    TpGame.getArrByStr = function (str) {
        var boneNameAry = str.split(/\s+/g);
        for (var i = boneNameAry.length - 1; i >= 0; i--) {
            if (String(boneNameAry[i]).length < 1) {
                boneNameAry.splice(i, 1);
            }
        }
        return boneNameAry;
    };
    TpGame.prototype.init = function () {
        this.loadDataComplet();
    };
    TpGame.prototype.loadDataComplet = function () {
        Scene_data.fileRoot = "res/";
        // GameInstance.initData();
        // Engine.initPbr();
        Md5MouseManager.getInstance().addMouseEvent();
        Md5MouseEventModel.getInstance().initSceneFocueEvent();
        this.addGridLineSprite();
        this.makeMd5MoveSprite();
        Scene_data.cam3D.distance = 250;
    };
    TpGame.prototype.makeMd5MeshSprite = function () {
        var $sc = new md5list.Md5MeshSprite();
        $sc.setMd5BodyUrl("2/body.md5mesh");
        SceneManager.getInstance().addSpriteDisplay($sc);
    };
    TpGame.prototype.makeMd5MoveSprite = function () {
        var $sc = new md5list.Md5MoveSprite();
        $sc.setMd5url("2/body.md5mesh", "2/stand.md5anim", "shuangdaonv.jpg");
        SceneManager.getInstance().addSpriteDisplay($sc);
    };
    TpGame.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
    };
    /**是否是外网 */
    TpGame.outNet = false;
    TpGame.GM = true;
    TpGame.ready = false;
    return TpGame;
}());
//# sourceMappingURL=TpGame.js.map