module materialui {

    export class NodeTreeVec3 extends NodeTree {
        public  constVec3: Vector3D = new Vector3D;
        public constructor() {

            super();
            this.canDynamic = true;
        }

        public getComponentID($id: number): string {
            if ($id == 0) {
                return CompileOne.FC + NodeTree.getID(this.regResultConst.id) + ".xyz";
            } else if ($id == 1) {
                return CompileOne.FC + NodeTree.getID(this.regResultConst.id) + ".w";
            } else if ($id == 2) {
                return CompileOne.FC + NodeTree.getID(this.regResultConst.id);
            }
            return null;
        }

    }
}