module left {

    export class BuildMaterialShader extends MaterialShader {
        public static BuildMaterialShader: string = "BuildMaterialShader";
        constructor() {
            super();
            this.name = "BuildMaterialShader";
        }
        public buildParamAry($material: materialui.MaterialTree): void {
               this.paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
        }

  
    }

}