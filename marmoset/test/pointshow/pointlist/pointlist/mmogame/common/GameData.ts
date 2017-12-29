
class ModulePageManager {
    public constructor() {

    }
    public static showResTittle($arr: Array<number>): void {

    }
}
class GameData {



    public static publicbgUiAtlas: UIAtlas
    public static getPublicUiAtlas($fun: Function): void {
        if (!this.publicbgUiAtlas) {
            this.publicbgUiAtlas = new UIAtlas;
            this.publicbgUiAtlas.setInfo("ui/uidata/public/publicbg.xml", "ui/uidata/public/publicbg.png", () => {
                $fun(this.publicbgUiAtlas)
            });
        } else {
            $fun(this.publicbgUiAtlas)
        }

    }

}