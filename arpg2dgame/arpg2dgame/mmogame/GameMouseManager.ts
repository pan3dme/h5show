
class GameMouseManager {
    private static _instance: GameMouseManager;
    public static getInstance(): GameMouseManager {
        if (!this._instance) {
            this._instance = new GameMouseManager();
        }
        return this._instance;
    }
    public constructor() {
    }
    public addMouseEvent(): void {
        if (Scene_data.isPc) {
            document.addEventListener(MouseType.MouseDown, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseUp, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseMove, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onMouseWheel($evt) });
        } else {
            document.addEventListener(MouseType.TouchMove, ($evt: TouchEvent) => { this.mouseToEvent($evt) });
            document.addEventListener(MouseType.TouchEnd, ($evt: TouchEvent) => { this.mouseToEvent($evt) });
            document.addEventListener(MouseType.TouchStart, ($evt: TouchEvent) => { this.mouseToEvent($evt) });
        }
        document.addEventListener(MouseType.KeyDown, ($evt: KeyboardEvent) => { this.onKeyDown($evt) })
    }
  
    public onKeyDown($evt: KeyboardEvent): void {
        if (!$evt.shiftKey) {
            if ($evt.keyCode == KeyboardType.G) {
                AotuSkillManager.getInstance().aotuBattle = !AotuSkillManager.getInstance().aotuBattle;
            }
            if ($evt.keyCode == KeyboardType.F) {
                AppDataArpg.lockMainChar = true;
                AppDataArpg.resetSelfPosCenter()
            }
            if ($evt.keyCode == KeyboardType.L) {
                SceneAstarModel.getInstance().showAstarLine()
            }

            if ($evt.keyCode == KeyboardType.T) {
                if (!this._cammandPanel) {
                    this._cammandPanel = new camand.CammandPanel();
                }
                this._cammandPanel.show()

            }
            if ($evt.keyCode == KeyboardType.A) {
                fightui.FightSkillPanel.getInstance();
            }
        }
    }
    private _cammandPanel: camand.CammandPanel

    public onMouseWheel($evt: MouseWheelEvent): void {

    }
    private onMouse($e: MouseEvent): void {
        var evt: InteractiveEvent;
        var point: Vector2D = new Vector2D();
        if ($e instanceof MouseEvent) {
            if ($e.type == MouseType.MouseDown) {
                evt = new InteractiveEvent(InteractiveEvent.Down);
            } else if ($e.type == MouseType.MouseUp) {
                evt = new InteractiveEvent(InteractiveEvent.Up);
            } else if ($e.type == MouseType.MouseMove) {
                evt = new InteractiveEvent(InteractiveEvent.Move);
            } else if ($e.type == MouseType.MouseClick) {

            }
            point.x = $e.pageX;
            point.y = $e.pageY;
        }
        if (Scene_data.isPc) {
            point.x -= Number(Scene_data.canvas3D.style.left.replace("px", ""));
            point.y -= Number(Scene_data.canvas3D.style.top.replace("px", ""));
        }

        this.makeMouseEvent(evt, point);
    }
    private mouseToEvent($touchEvent: TouchEvent): void {
        var evt: InteractiveEvent;
        var point: Vector2D = new Vector2D();
        if ($touchEvent.type == MouseType.TouchStart) {
            evt = new InteractiveEvent(InteractiveEvent.Down);
        } else if ($touchEvent.type == MouseType.TouchEnd) {
            evt = new InteractiveEvent(InteractiveEvent.Up);
            point.x = $touchEvent.changedTouches[0].pageX;
            point.y = $touchEvent.changedTouches[0].pageY;
        } else if ($touchEvent.type == MouseType.TouchMove) {
            evt = new InteractiveEvent(InteractiveEvent.Move);
        }
        if ($touchEvent.touches.length) {
            point.x = $touchEvent.touches[$touchEvent.touches.length - 1].clientX;
            point.y = $touchEvent.touches[$touchEvent.touches.length - 1].clientY;
        }
        this.makeMouseEvent(evt, point);
    }
    private makeMouseEvent(evt: InteractiveEvent, point: Vector2D): void {
        var temp: boolean = UIManager.getInstance().mouseEvetData(evt, point);

        if (!temp) {
            if (evt.type == InteractiveEvent.Up) {
                 this.clikSceneGround(point)
            }
         
        }
    
    }

    private clikSceneGround($pos: Vector2D): void
    {
 


    }
    public walkPathComplete(): void {


    }





}