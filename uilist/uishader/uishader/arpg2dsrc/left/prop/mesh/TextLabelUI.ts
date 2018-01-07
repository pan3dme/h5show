module prop {
    class TextLabelUIMeshVo extends bloodTittle.baseMeshVo {
        private _name: string;
        public needDraw: boolean;
        public set name(value: string) {
            this._name = value;
            this.needDraw = true;
        }
        public get name(): string {
            return this._name;
        }
        public destory(): void {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true
        }
        public textLabelUIDisp2D:TextLabelUIDisp2D
    }
    export class TextLabelUIDisp2D extends Disp2DBaseText {
        private labelNameMeshVo: TextLabelUIMeshVo
        public makeData(): void {
            if (this._data) {
                this.labelNameMeshVo = <TextLabelUIMeshVo>this.data;
                if (this.lastKey != this.labelNameMeshVo.name) {
                    this.ui.width = 128 * 0.7;
                    this.ui.height = 22 * 0.7;
                    this.lastKey = this.labelNameMeshVo.name
                    LabelTextFont.writeSingleLabel(this.parent.uiAtlas, this.textureStr, this.labelNameMeshVo.name, 20, TextAlign.LEFT, "#ffffff", "#27262e");
                }
                this.labelNameMeshVo.needDraw = false;
            }
        }
        private tempMatrix: Matrix3D = new Matrix3D;
        public update(): void {
            if (this.labelNameMeshVo) {
                if (this.labelNameMeshVo.needDraw) {
                    this.makeData();
                }
                if (this.labelNameMeshVo.pos) {
                    if (this.labelNameMeshVo.visible) {
                        if (this.needUpData(this.labelNameMeshVo.pos) || this.labelNameMeshVo.visibleChange) {
                      
                            this.ui.x = this.labelNameMeshVo.pos.x;
                            this.ui.y = this.labelNameMeshVo.pos.y;

                            this.oldPos.x = this.labelNameMeshVo.pos.x;
                            this.oldPos.y = this.labelNameMeshVo.pos.y;
                            this.labelNameMeshVo.visibleChange = false;
                        }
                    } else {
                        this.ui.x = 10000
                    }
                }
                if (this.labelNameMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        }
    }


    export class TextLabelUI extends EventDispatcher{
        private static _dis2DUIContianer: Dis2DUIContianerPanel
        public constructor() {
            super();
            if (!TextLabelUI._dis2DUIContianer) {
                TextLabelUI._dis2DUIContianer = new Dis2DUIContianerPanel(TextLabelUIDisp2D, new Rectangle(0, 0, 128, 24), 50);
                TextLabelUI._dis2DUIContianer.left = 0;
                TextLabelUI._dis2DUIContianer.top = 0;
                TextLabelUI._dis2DUIContianer.layer = 999;
                UIManager.getInstance().addUIContainer(TextLabelUI._dis2DUIContianer);
                TimeUtil.addFrameTick((t: number) => { this.upFrame(t) });
 
            }
            this.textLabelUIMeshVo = this.getCharNameMeshVo();

            this.initView();
            this.resize();
        }
        public destory(): void {
            this.textLabelUIMeshVo.clear=true
        }
        protected initView(): void
        {
            this.textLabelUIMeshVo.name = "Vec3:";
        }
        private resize(): void
        {
            this.textLabelUIMeshVo.pos.x = this._x;
            this.textLabelUIMeshVo.pos.y = this._y;
        }
        private upFrame(t: number): void {
            TextLabelUI._dis2DUIContianer.update(t);
        }
        public get label(): string {
            return "";
        }
        public set label(value: string) {
            this.textLabelUIMeshVo.name = value;
       
        }
    
        protected textLabelUIMeshVo: TextLabelUIMeshVo
        public getCharNameMeshVo(value: string = "测试名"): TextLabelUIMeshVo {
            var $vo: TextLabelUIMeshVo = new TextLabelUIMeshVo;
            $vo.name = value
            $vo.pos = new Vector3D(0, 50, 0);
            $vo.textLabelUIDisp2D = <TextLabelUIDisp2D>TextLabelUI._dis2DUIContianer.showTemp($vo);
            return $vo;
        }
        private _x: number=0
        private _y: number=0;
        public set x(value: number) {
            this._x = value;
            this.resize()
        }
        public get x(): number {
            return this._x
        }

        public set y(value: number) {
            this._y = value;
            this.resize()
        }
        public get y(): number {
            return this._y
        }

    }
} 