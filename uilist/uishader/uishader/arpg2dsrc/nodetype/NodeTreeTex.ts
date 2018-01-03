module materialui {

    export class NodeTreeTex extends NodeTree {

        public  url: string;
        public isMain: boolean;
        public wrap: number;
        public mipmap: number;// 0=disable、1=nearest、2=linear
        public filter: number;// 1=nearest、0=linear

        public  permul: boolean;
        public constructor() {
       
            super();
        }
         public  checkInput(): boolean {
            return true;
        }

    }
}