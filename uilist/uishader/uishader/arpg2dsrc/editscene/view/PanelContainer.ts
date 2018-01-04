module materialui {

    export class PanelContainer  {

        private uiRender: UIRenderComponent
        private panel: UIPanel
        public constructor($panel:UIPanel,$render:UIRenderComponent) {

            this.panel = $panel;
            this.uiRender = $render;
        }
        public removeChild($ui: ItemMaterialUI): void
        {
            this.panel.removeChild($ui.pointframe);
            this.panel.removeChild($ui.labelframe);
            $ui.pointframe = null
            $ui.labelframe = null
            $ui.parent=null
        }
        
        public addChild($ui: ItemMaterialUI): void
        {
            if (!$ui.pointframe) {
                $ui.pointframe = this.panel.addEvntBut("a_point_frame", this.uiRender);
                $ui.labelframe = this.panel.addEvntBut("a_label_txt", this.uiRender);
                $ui.pointframe.data = $ui
            } 
            switch ($ui.titleLabeltext) {
                case "UV":
                    $ui.labelframe.goToAndStop(7)
                    break
                case "rgb":
                    $ui.labelframe.goToAndStop(1)
                    break
                case "r":
                    $ui.labelframe.goToAndStop(2)
                    break
                case "g":
                    $ui.labelframe.goToAndStop(3)
                    break
                case "b":
                    $ui.labelframe.goToAndStop(4)
                    break
                case "a":
                    $ui.labelframe.goToAndStop(5)
                    break
                case "xy":
                    $ui.labelframe.goToAndStop(8)
                    break
                case "rgba":
                    $ui.labelframe.goToAndStop(6)
                    break
                case "out":
                    $ui.labelframe.goToAndStop(0)
                    break
                default:
                    $ui.labelframe.goToAndStop(14)
                   // this.setResultNodelUiPointColor($ui)
                    break;
            }
            
            $ui.drawSp();

        }
        private setResultNodelUiPointColor($ui: ItemMaterialUI): void
        {

            //this.diffuseItem = new ItemMaterialUI("漫反射(Diffuse)", MaterialItemType.VEC3);
            //this.metallicItem = new ItemMaterialUI("金属(metallic)", MaterialItemType.FLOAT);
            //this.specularItem = new ItemMaterialUI("高光(Specular)", MaterialItemType.FLOAT);
            //this.specularPowerItem = new ItemMaterialUI("粗糙度(Roughness)", MaterialItemType.FLOAT);
            //this.normalItem = new ItemMaterialUI("法线(Normal)", MaterialItemType.VEC3);
            //this.reflectItem = new ItemMaterialUI("反射(Reflection)", MaterialItemType.VEC3);
            //this.subsurfaceColorItem = new ItemMaterialUI("表面散射(subsurface)", MaterialItemType.VEC3);
            //this.alphaItem = new ItemMaterialUI("透明度(alpha)", MaterialItemType.FLOAT);
            //this.killItem = new ItemMaterialUI("不透明蒙版(alphaMask)", MaterialItemType.FLOAT);
            //this.emissiveItem = new ItemMaterialUI("自发光(emissive)", MaterialItemType.VEC3);
            switch ($ui.titleLabeltext) {
                case "漫反射(Diffuse)":
                    $ui.pointframe.goToAndStop(0)
                    break
                case "金属(metallic)":
                    $ui.pointframe.goToAndStop(2)
                    break
                case "高光(Specular)":
                    $ui.pointframe.goToAndStop(2)
                    break
                case "粗糙度(Roughness)":
                    $ui.pointframe.goToAndStop(2)
                    break
                case "法线(Normal)":
                    $ui.pointframe.goToAndStop(0)
                    break
                case "反射(Reflection)":
                    $ui.pointframe.goToAndStop(0)
                    break
                case "表面散射(subsurface)":
                    $ui.pointframe.goToAndStop(0)
                    break
                case "透明度(alpha)":
                    $ui.pointframe.goToAndStop(2)
                    break
                case "不透明蒙版(alphaMask)":
                    $ui.pointframe.goToAndStop(2)
                    break
                case "自发光(emissive)":
                    $ui.pointframe.goToAndStop(0)
                    break
                default:
   
                    break;
            }
        }
        
    }
}