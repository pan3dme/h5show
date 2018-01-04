module materialui {

    export class MaterialBaseData   {
        public baseColorUrl: string;
        public normalUrl: string;
        public url: string
        public baseColor: Vector3D = new Vector3D;
        public roughness: number = 0;
        public specular: number = 0;
        public metallic: number = 0;
        public  usePbr: boolean = false;
        public setData(obj: any): void {
            if(!obj) {
                return;
            }
			
			this.baseColorUrl = obj.baseColorUrl;
            if(obj.baseColor) {
                this.baseColor = new Vector3D(obj.baseColor.x, obj.baseColor.y, obj.baseColor.z);
            }
			this.roughness = obj.roughness;
            this.specular = obj.specular;
            this.metallic = obj.metallic;
            this.normalUrl = obj.normalUrl;
            this.usePbr = obj.usePbr;

            this.url = obj.url;

        }
    }
}