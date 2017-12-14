class Camera3D extends Object3D {
    public cameraMatrix: Matrix3D;
    private _distance: number = 500;
    public lookAtTarget: Object3D;
    private _astarRect: Rectangle;
    constructor() {
        super()
        this.cameraMatrix = new Matrix3D;
 
    }
 
    public get distance(): number
    {
        return this._distance;
    }

    public set distance(value: number) {
        this._distance = value;
    }

    public lookAt($target:Object3D): void {
        this.lookAtTarget = $target;
    }
    private _midPos: Vector3D;
    private _scaleVec: Vector3D;
    public set astarRect(value: Rectangle) {
  
        this._astarRect = new Rectangle();
        this._astarRect.x = value.x;
        this._astarRect.y = value.y;
        this._astarRect.width = value.width;
        this._astarRect.height = value.height;

        this._midPos = new Vector3D();
        this._midPos.x = this._astarRect.x + this._astarRect.width / 2
        this._midPos.z = this._astarRect.y + this._astarRect.height / 2


        this._scaleVec = new Vector3D();
        this._scaleVec.x = (this._astarRect.width - 100) / this._astarRect.width 
        this._scaleVec.z = (this._astarRect.height - 100) / this._astarRect.height 



    }

    public needChange:boolean=true
    public update(): void {
        if (this.lookAtTarget) {
         
        }
    }
 

    public get postion(): Vector3D
    {
        return new Vector3D(this.x,this.y,this.z)
    }
}