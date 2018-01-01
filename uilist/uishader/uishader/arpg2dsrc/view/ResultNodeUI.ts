module materialui {

    export class ResultNodeUI extends BaseMaterialNodeUI {

        private  diffuseItem:ItemMaterialUI;
        private  metallicItem:ItemMaterialUI;
        private  normalItem:ItemMaterialUI;
        private  specularItem:ItemMaterialUI;
        private  specularPowerItem:ItemMaterialUI;
        private  reflectItem:ItemMaterialUI;
        private  subsurfaceColorItem:ItemMaterialUI;
        private  alphaItem:ItemMaterialUI;
        private  killItem:ItemMaterialUI;
        private  emissiveItem:ItemMaterialUI;
		

        public constructor() {
            super();
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
        private  initItem():void{
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
		
    }
} 