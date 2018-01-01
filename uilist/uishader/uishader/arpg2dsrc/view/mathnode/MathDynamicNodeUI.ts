module materialui {

    export class MathDynamicNodeUI extends BaseMaterialNodeUI
    {
        private  intAItem:ItemMaterialUI;
        private  intBItem:ItemMaterialUI;
        private  outItem:ItemMaterialUI;
        private  outRItem:ItemMaterialUI;
        private  outGItem:ItemMaterialUI;
        private  outBItem:ItemMaterialUI;
        private  outXYItem:ItemMaterialUI;
        private  outRGBItem:ItemMaterialUI;
        private  outAItem:ItemMaterialUI;
        public constructor() {
            super();
            this.gap = 20;
            this.width = 162;
            this.height = 60;
            this.resetBgSize()
        }
        protected  initItem():void{
            this.intAItem = new ItemMaterialUI("a", MaterialItemType.UNDEFINE);
            this.intBItem = new ItemMaterialUI("b", MaterialItemType.UNDEFINE);
            this.outItem = new ItemMaterialUI("out", MaterialItemType.UNDEFINE, false);
            this.outRItem = new ItemMaterialUI("r", MaterialItemType.FLOAT, false);
            this.outGItem = new ItemMaterialUI("g", MaterialItemType.FLOAT, false);
            this.outBItem = new ItemMaterialUI("b", MaterialItemType.FLOAT, false);
            this.outXYItem = new ItemMaterialUI("xy", MaterialItemType.VEC2, false);
            this.outRGBItem = new ItemMaterialUI("rgb", MaterialItemType.VEC3, false);
            this.outAItem = new ItemMaterialUI("a", MaterialItemType.FLOAT, false);
			
            this.addItems(this.intAItem);
            this.addItems(this.intBItem);
            this.addItems(this.outItem);

            this.addEvents(this.intAItem);
            this.addEvents(this.intBItem);
            this.addEvents(this.outItem);
			
 
        }
        public  addEvents($nodeUI:ItemMaterialUI):void{

            $nodeUI.addEventListener("Connect", this.onConnect, this);
        }

        public addDisEvent($nodeUI: ItemMaterialUI): void {
         
            $nodeUI.addEventListener("DisConnect", this.disConnect,this);
        }
        public disConnect(event: BaseEvent):void{
            this.checkItem();
        }
        protected onConnect(event: BaseEvent): void {
         
            var target: ItemMaterialUI = <ItemMaterialUI> event.target;
            var typets: string = target.typets;
            target.changeType(typets);

            this.checkItem();

            if (this.intAItem.typets != MaterialItemType.UNDEFINE && this.intBItem.typets != MaterialItemType.UNDEFINE) {
                if (this.intAItem.typets != MaterialItemType.FLOAT && this.intBItem.typets != MaterialItemType.FLOAT) {
                    if (this.intAItem.typets != this.intBItem.typets) {
                        target.removeAllLine();
                    }
                }
            }
        }
        public checkItem(): void{
            if (!this.intAItem.hasConnet) {
                this.intAItem.changeType(MaterialItemType.UNDEFINE);
            }
            if (!this.intBItem.hasConnet) {
                this.intBItem.changeType(MaterialItemType.UNDEFINE);
            }
            if (!this.outItem.hasConnet) {
                this.outItem.changeType(MaterialItemType.UNDEFINE);
            }

            if (this.outItem.typets == MaterialItemType.VEC3) {
                if (this.intAItem.typets == MaterialItemType.FLOAT) {
                    if (this.intBItem.typets == MaterialItemType.UNDEFINE) {
                        this.intBItem.changeType(MaterialItemType.VEC3);
                    }
                }
                if (this.intBItem.typets == MaterialItemType.FLOAT) {
                    if (this.intAItem.typets == MaterialItemType.UNDEFINE) {
                        this.intAItem.changeType(MaterialItemType.VEC3);
                    }
                }
            } else if (this.outItem.typets == MaterialItemType.VEC4) {
                if (this.intAItem.typets == MaterialItemType.FLOAT) {
                    if (this.intBItem.typets == MaterialItemType.UNDEFINE) {
                        this.intBItem.changeType(MaterialItemType.VEC4);
                    }
                }
                if (this.intBItem.typets == MaterialItemType.FLOAT) {
                    if (this.intAItem.typets == MaterialItemType.UNDEFINE) {
                        this.intAItem.changeType(MaterialItemType.VEC4);
                    }
                }
            } else if (this.outItem.typets == MaterialItemType.VEC2) {
                if (this.intAItem.typets == MaterialItemType.FLOAT) {
                    if (this.intBItem.typets == MaterialItemType.UNDEFINE) {
                        this.intBItem.changeType(MaterialItemType.VEC2);
                    }
                }
                if (this.intBItem.typets == MaterialItemType.FLOAT) {
                    if (this.intAItem.typets == MaterialItemType.UNDEFINE) {
                        this. intAItem.changeType(MaterialItemType.VEC2);
                    }
                }
            } else if (this.outItem.typets == MaterialItemType.FLOAT) {
                if (this.intAItem.typets == MaterialItemType.UNDEFINE) {
                    this.intAItem.changeType(MaterialItemType.FLOAT);
                }
                if (this.intBItem.typets == MaterialItemType.UNDEFINE) {
                    this.intBItem.changeType(MaterialItemType.FLOAT);
                }
            } else if (this.outItem.typets == MaterialItemType.UNDEFINE) {
                if (this.intAItem.typets == MaterialItemType.VEC4 || this.intBItem.typets == MaterialItemType.VEC4) {
                    this.outItem.changeType(MaterialItemType.VEC4);
                } else if (this.intAItem.typets == MaterialItemType.VEC3 || this.intBItem.typets == MaterialItemType.VEC3) {
                    this.outItem.changeType(MaterialItemType.VEC3);
                } else if (this.intAItem.typets == MaterialItemType.VEC2 || this.intBItem.typets == MaterialItemType.VEC2) {
                    this.outItem.changeType(MaterialItemType.VEC2);
                } else if (this.intAItem.typets == MaterialItemType.FLOAT && this.intBItem.typets == MaterialItemType.FLOAT) {
                    this. outItem.changeType(MaterialItemType.FLOAT);
                }
            }

            if (this.outItem.typets == MaterialItemType.VEC4) {
                this.addItems(this.outRItem);
                this.addItems(this.outGItem);
                this.addItems(this.outBItem);
                this.addItems(this.outXYItem);
                this.addItems(this.outRGBItem);
                this.addItems(this.outAItem);
                this.height = 180;
            } else if (this.outItem.typets == MaterialItemType.VEC3) {
                this.addItems(this.outRItem);
                this.addItems(this.outGItem);
                this.addItems(this.outBItem);
                this.addItems(this.outXYItem);
                this.height = 140;
                this.removeItem(this.outRGBItem);
                this. outRGBItem.removeAllLine();
                this.removeItem(this.outAItem);
                this. outAItem.removeAllLine();
            } else {
                this.removeItem(this.outRItem);
                this. outRItem.removeAllLine();
                this.removeItem(this.outGItem);
                this. outGItem.removeAllLine();
                this.removeItem(this.outBItem)
                this.outBItem.removeAllLine();
                this.removeItem(this.outXYItem);
                this. outXYItem.removeAllLine();
                this.removeItem(this.outRGBItem);
                this. outRGBItem.removeAllLine();
                this.removeItem(this.outAItem);
                this.outAItem.removeAllLine();
                this.height = 80;
            }
            this.resetBgSize()
        }

    }
} 