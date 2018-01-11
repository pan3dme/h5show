module materialui {

    export class NodeTreeFresnel extends NodeTree {

        public constructor() {

            super();

        }
        public getComponentID($id: number): string {
            if ($id == 0) {
                var str: string = CompileOne.FT + this.regResultTemp.id + ".x";
                return str;
            }
            return null;
        }


    }
}