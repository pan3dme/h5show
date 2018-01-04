module materialui {

    export class NodeTreeVec3 extends NodeTree {
        public  constVec3: Vector3D = new Vector3D;
        public constructor() {

            super();
            this.canDynamic = true;
        }

    

    }
}