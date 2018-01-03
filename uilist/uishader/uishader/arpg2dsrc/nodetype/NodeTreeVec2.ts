module materialui {

    export class NodeTreeVec2 extends NodeTree {
        public constValue: Vector2D = new Vector2D;
        public constructor() {

            super();
            this.canDynamic = true;
        }



    }
}