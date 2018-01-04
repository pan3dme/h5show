module materialui {

    export class ResultNodeUI extends BaseMaterialNodeUI {

        private diffuseItem: ItemMaterialUI;
        private metallicItem: ItemMaterialUI;
        private normalItem: ItemMaterialUI;
        private specularItem: ItemMaterialUI;
        private specularPowerItem: ItemMaterialUI;
        private reflectItem: ItemMaterialUI;
        private subsurfaceColorItem: ItemMaterialUI;
        private alphaItem: ItemMaterialUI;
        private killItem: ItemMaterialUI;
        private emissiveItem: ItemMaterialUI;


        private _blenderMode: number = 0;
        private _killNum: number = 0;
        private _backCull: boolean = true;
        private _writeZbuffer: boolean = true;
        private _useDynamicIBL: boolean = false;
        private _normalScale: number = 0;
        private _lightProbe: boolean = false;
        private _directLight: boolean = false;
        private _noLight: boolean = false;
        private _fogMode: number = 0;
        private _scaleLightMap: boolean = false;
        private _hdr: boolean = false;
        public constructor() {
            super();
            this.name = "ResultNodeUI" + random(9999999);
            this.left = 900
            this.top = 300;
            this.gap = 30;
            this.width = 162;
            this.height = 310;

            this.nodeTree = new NodeTreeOP;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.OP;

            this.initItem();


            var $a_resultNodeUItxt: UICompenent = this.addChild(this._midRender.getComponent("a_resultNodeUItxt"));
            $a_resultNodeUItxt.x = 30;
            this.resetBgSize()
        }
        private initItem(): void {
            this.diffuseItem = new ItemMaterialUI("漫反射(Diffuse)", MaterialItemType.VEC3);
            this.metallicItem = new ItemMaterialUI("金属(metallic)", MaterialItemType.FLOAT);
            this.specularItem = new ItemMaterialUI("高光(Specular)", MaterialItemType.FLOAT);
            this.specularPowerItem = new ItemMaterialUI("粗糙度(Roughness)", MaterialItemType.FLOAT);
            this.normalItem = new ItemMaterialUI("法线(Normal)", MaterialItemType.VEC3);
            this.reflectItem = new ItemMaterialUI("反射(Reflection)", MaterialItemType.VEC3);
            this.subsurfaceColorItem = new ItemMaterialUI("表面散射(subsurface)", MaterialItemType.VEC3);
            this.alphaItem = new ItemMaterialUI("透明度(alpha)", MaterialItemType.FLOAT);
            this.killItem = new ItemMaterialUI("不透明蒙版(alphaMask)", MaterialItemType.FLOAT);
            this.emissiveItem = new ItemMaterialUI("自发光(emissive)", MaterialItemType.VEC3);

            this.addItems(this.diffuseItem);
            this.addItems(this.metallicItem);
            this.addItems(this.specularItem);
            this.addItems(this.specularPowerItem);
            this.addItems(this.normalItem);
            this.addItems(this.reflectItem);
            this.addItems(this.subsurfaceColorItem);
            this.addItems(this.alphaItem);
            this.addItems(this.killItem);
            this.addItems(this.emissiveItem);
        }
        public get blenderMode(): number {
            return this._blenderMode;
        }

        public set blenderMode(value: number) {
            this._blenderMode = value;
            (<NodeTreeOP>this.nodeTree).blendMode = value;
        }
        public get normalScale(): number {
            return this._normalScale;
        }

        public set normalScale(value: number) {
            this._normalScale = value;
            (<NodeTreeOP>this.nodeTree).normalScale = value;
        }
        public get lightProbe(): boolean {
            return this._lightProbe;
        }

        public set lightProbe(value: boolean) {
            this._lightProbe = value;
            (<NodeTreeOP>this.nodeTree).lightProbe = value;
        }
        public get directLight(): boolean {
            return this._directLight;
        }

        public set directLight(value: boolean) {
            this._directLight = value;
            (<NodeTreeOP>this.nodeTree).directLight = value;
        }

        public get noLight(): boolean {
            return this._noLight;
        }

        public set noLight(value: boolean) {
            this._noLight = value;
            (<NodeTreeOP>this.nodeTree).noLight = value;
        }
        public get fogMode(): number {
            return this._fogMode;
        }
        public set fogMode(value: number) {
            this._fogMode = value;
            (<NodeTreeOP>this.nodeTree).fogMode = value;
        }
        public get scaleLightMap(): boolean {
            return this._scaleLightMap;
        }

        public set scaleLightMap(value: boolean) {
            this._scaleLightMap = value;
            (<NodeTreeOP>this.nodeTree).scaleLightMap = value;
        }
        public get writeZbuffer(): boolean {
            return this._writeZbuffer;
        }
        public set writeZbuffer(value: boolean) {
            this._writeZbuffer = value;
            (<NodeTreeOP>this.nodeTree).writeZbuffer = value;
        }
        public get hdr(): boolean {
            return this._hdr;
        }
        public set hdr(value: boolean) {
            this._hdr = value;
            (<NodeTreeOP>this.nodeTree).hdr = value;
        }
        public getData(): Object {
            var obj: any = super.getData();
            obj.blenderMode = this.blenderMode;
            obj.killNum = this._killNum;
            obj.backCull = this._backCull;
            obj.useDynamicIBL = this._useDynamicIBL;
            obj.normalScale = this.normalScale;
            obj.lightProbe = this.lightProbe;
            obj.directLight = this.directLight;
            obj.noLight = this.noLight;
            obj.fogMode = this.fogMode;
            obj.scaleLightMap = this.scaleLightMap;
            obj.writeZbuffer = this.writeZbuffer;
            obj.hdr = this.hdr;
            return obj;
        }

        public setData(obj: any): void {
            super.setData(obj);
            this.blenderMode = obj.blenderMode;
            this._killNum = obj.killNum;
            this._backCull = obj.backCull;
            this._useDynamicIBL = obj.useDynamicIBL;
            this._normalScale = obj.normalScale;
            this._lightProbe = obj.lightProbe;
            this._directLight = obj.directLight;
            this._noLight = obj.noLight;
            this._fogMode = obj.fogMode;
            this._scaleLightMap = obj.scaleLightMap;
            this.hdr = obj.hdr;
            if (obj.hasOwnProperty("writeZbuffer")) {
                this._writeZbuffer = obj.writeZbuffer;
            }
            if (isNaN(this._killNum)) {
                this._killNum = 0;
            }
            if (isNaN(this._normalScale)) {
                this._normalScale = 1;
            }
            (<NodeTreeOP>this.nodeTree).blendMode = this.blenderMode;
            (<NodeTreeOP>this.nodeTree).killNum = this._killNum;
            (<NodeTreeOP>this.nodeTree).backCull = this._backCull;
            (<NodeTreeOP>this.nodeTree).useDynamicIBL = this._useDynamicIBL;
            (<NodeTreeOP>this.nodeTree).normalScale = this._normalScale;
            (<NodeTreeOP>this.nodeTree).lightProbe = this._lightProbe;
            (<NodeTreeOP>this.nodeTree).directLight = this._directLight;
            (<NodeTreeOP>this.nodeTree).noLight = this._noLight;
            (<NodeTreeOP>this.nodeTree).fogMode = this._fogMode;
            (<NodeTreeOP>this.nodeTree).scaleLightMap = this._scaleLightMap;
            (<NodeTreeOP>this.nodeTree).writeZbuffer = this._writeZbuffer;
            (<NodeTreeOP>this.nodeTree).hdr = this._hdr;
        }

    }
} 