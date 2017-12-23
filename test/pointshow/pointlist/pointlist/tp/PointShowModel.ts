class PointShowModel {
    /**是否是外网 */

    public constructor() {

    }
    public static PointSize: number = 2
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
    public static hasMouseEvent: boolean = false;
    public static showGridline: boolean = false;

    private static _hitBoxSprite: LineDisplaySprite;
    private static loadDataComplet(): void {

        this._pointListSpriter = new PointListSpriter()
        SceneManager.getInstance().addDisplay(this._pointListSpriter)

        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        this._hitBoxSprite = new LineDisplaySprite();
        SceneManager.getInstance().addDisplay(this._hitBoxSprite)
        this.setBoxScale(100, 100, 100)


        SceneManager.getInstance().ready = true

        if (this.hasMouseEvent) {
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();
        }
        if (this.showGridline) {
            this.addGridLineSprite()
        }

    }
    public static setBoxScale($x: number, $y: number, $z: number, $color: Array<number> = null): void {
        $x /= 2;
        $y /= 2;
        $z /= 2;
        this._hitBoxSprite.clear()
        this._hitBoxSprite.baseColor = new Vector3D(1, 0, 0)
        if ($color && $color.length>=3) {
            this._hitBoxSprite.baseColor = new Vector3D($color[0], $color[1], $color[2])
        }

        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(+$x, +$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, +$z), new Vector3D(+$x, -$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(-$x, -$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, +$z), new Vector3D(+$x, -$y, +$z));

        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, -$z), new Vector3D(+$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, -$z), new Vector3D(+$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, -$z), new Vector3D(-$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, -$z), new Vector3D(+$x, -$y, -$z));

        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(-$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, +$z), new Vector3D(+$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, +$z), new Vector3D(-$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, -$y, +$z), new Vector3D(+$x, -$y, -$z));


        this._hitBoxSprite.upToGpu()

    }
    private static _pointListSpriter: PointListSpriter
    public static setPointData($point: Array<number>, $color: Array<number> = null): void {
        this._pointListSpriter.setNewItemData($point, $color)
    }
}