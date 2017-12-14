class PointShowModel {
    /**是否是外网 */

    public constructor() {
       
    }
    public static PointSize: number=2
    public static init(): void {

  
        Engine.init(document.getElementById('ArpgStageCanvas'));
        UIManager.getInstance().regEvent(null);

        this.loadDataComplet();
        setInterval(() => { this.upFrameData() }, 1000 / 60);

     
    }

    private static upFrameData(): void {
        PointListSpriter.PointSize = this.PointSize;
        Engine.update();

  
    }
    private static addGridLineSprite(): void {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        SceneManager.getInstance().addDisplay($GridLineSprite);

    }
    public static hasMouseEvent: boolean = false
    public static showGridline: boolean = false
    private static loadDataComplet(): void {

        this._pointListSpriter = new PointListSpriter()
        SceneManager.getInstance().addDisplay(this._pointListSpriter)
        SceneManager.getInstance().ready = true

        if (this.hasMouseEvent) {
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();
        }
        if (this.showGridline) {
            this.addGridLineSprite()
        }

    }
    private static _pointListSpriter: PointListSpriter
    public static setPointData($point: Array<number>, $color: Array<number> = null): void {
        this._pointListSpriter.setNewItemData($point, $color)
    }
}