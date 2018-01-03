module materialui {

    export class NodeTreeOP extends NodeTree {
        public blendMode: number;
        public killNum: number;
        public  backCull: boolean;
        public writeZbuffer: boolean = true;
        public isUseLightMap: boolean = true;
        public useDynamicIBL: boolean;
        public normalScale: number;
        public lightProbe: boolean;
        public directLight: boolean;
        public noLight: boolean;
        public fogMode: number;
        public scaleLightMap: boolean;
        public hdr: boolean;
        public constructor() {

            super();

        }
         public  checkInput(): boolean {
            return true;
        }

    }
}