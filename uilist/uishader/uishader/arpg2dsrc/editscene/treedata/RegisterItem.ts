module materialui {

    export class RegisterItem {
        public id: number;
        public  inUse: boolean;
        public  url: string;
        public  xUse: boolean;
        public  yUse: boolean;
        public  zUse: boolean;
        public  wUse: boolean;
        public hasInit: boolean;
        constructor($id: number) {
            this.id = $id;
        }
        public  getUse($nodeTree: NodeTree): boolean{
            var $type: String = $nodeTree.type;
            if($type == NodeTree.VEC3) {
                if (!this.xUse) {
                    this. xUse = true;
                    this. yUse = true;
                    this. zUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 0;
                    return true;
                }
            }else if($type == NodeTree.VEC2) {
                if (!this.xUse) {
                    this. xUse = true;
                    this.yUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 0;
                    return true;
                } else if (!this.yUse) {
                    this. yUse = true;
                    this.  zUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 1;
                    return true;
                } else if (!this.zUse) {
                    this. zUse = true;
                    this. wUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 2;
                    return true;
                }
            }else if($type == NodeTree.FLOAT) {
                if (!this.xUse) {
                    this. xUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 0;
                    return true;
                } else if (!this.yUse) {
                    this. yUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 1;
                    return true;
                } else if (!this.zUse) {
                    this. zUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 2;
                    return true;
                } else if (!this.wUse) {
                    this. wUse = true;
                    $nodeTree.regResultConst = this;
                    $nodeTree.regConstIndex = 3;
                    return true;
                }
            }
			
			return false;

        }
    }
}