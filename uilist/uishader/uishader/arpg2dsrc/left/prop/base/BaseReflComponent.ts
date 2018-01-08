module prop {

    export class BaseReflComponent {




        protected _width: number=1;
        protected _height: number=1;
        protected _x: number=0
        protected _y: number=0;
        protected _data: any

        //public changFun: Function;
        //public getFun: Function;
        //public setFun: Function;
        public target: any;
        public FunKey: string;
        public KeyStep: number=1;

    
        public constructor() {

            this.width = 100;
            this.height = 100;

            this.initView();
        }

        public set data(value: any) {
            this._data = value;
        }
        public get data(): any {
            return this._data
        }
        public set x(value: number) {
            this._x = value;
        }
        public get x(): number {
            return this._x
        }
        public set y(value: number) {
            this._y = value;
        }
        public get y(): number {
            return this._y
        }


        public set width(value: number) {
            this._width = value;
        }
        public get width(): number {
            return this._width
        }
        public set height(value: number) {
            this._height = value;
        }
        public get height(): number {
            return this._height
        }
  
        public  setTarget(obj:any):void{
            this.target = obj;
            this.refreshViewValue();

        }
        public refreshViewValue(): void
        {

        }
        protected initView(): void
        {
         
        }
        public destory(): void {
        }


    }
}