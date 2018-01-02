module materialui {

    export class NodeTreeItem {
        public static  IN:string = "in";
        public static  OUT:string = "out"
        public  node:NodeTree;
        public  inoutType:string;
        public  id:number;
        public  type:string;
        public constructor() {


        }

        public getObj(): Object{
            var obj: any = new Object;
            obj.inoutType = this.inoutType;
            obj.id = this. id;
            obj.type = this.type;
            return obj;
        }

        public otherNeedObj(): Object{
            var obj: any = new Object;
            obj.id = this. id;
            obj.inoutType = this. inoutType;
            obj.pid = this.node.id;
            return obj;
        }
    }

}