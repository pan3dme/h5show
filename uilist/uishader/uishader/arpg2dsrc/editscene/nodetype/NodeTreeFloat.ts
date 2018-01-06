module materialui {

    export class NodeTreeFloat extends NodeTree {
        public constValue: number;
        public constructor() {

            super();
            this.canDynamic = true;
        }
        public  getComponentID($id: number): string {
            if ($id == 0) {
                var str: string = CompileOne.FC + NodeTree.getID(this.regResultConst.id);
                if (this.regConstIndex == 0) {
                    str += ".x";
                } else if (this.regConstIndex == 1) {
                    str += ".y";
                } else if (this.regConstIndex == 2) {
                    str += ".z";
                } else if (this.regConstIndex == 3) {
                    str += ".w";
                }
                return str;
            }
            return null;
        }


    }
}