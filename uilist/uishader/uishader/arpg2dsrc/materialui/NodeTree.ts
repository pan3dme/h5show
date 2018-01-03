module materialui {

    export class NodeTree {
        public static TEX: string = "tex";
        public static OP: string = "op";
        public static ADD:string = "add";
        public static SUB:string = "sub";
        public static MUL:string = "mul";
        public static DIV:string = "div";
        public static RCP:string = "rcp";
        public static MIN:string = "min";
        public static MAX:string = "max";
        public static FRC:string = "frc";
        public static SQT:string = "sqt";
        public static RSQ:string = "rsq";
        public static POW:string = "pow";
        public static LOG:string = "log";
        public static EXP:string = "exp";
        public static NRM:string = "nrm";
        public static SIN:string = "sin";
        public static COS:string = "cos";
        public static CRS:string = "crs";
        public static DP3:string = "dp3";
        public static DP4:string = "dp4";
        public static ABS:string = "abs";
        public static NEG:string = "neg";
        public static SAT:string = "sat";
        public static LERP:string = "lerp";

        public static VEC3:string = "vec3";
        public static VEC2:string = "vec2";
        public static FLOAT:string = "float";
        public static TIME:string = "time";
        public static TEXCOORD:string = "texcoord";
        public static DYNVEC3:string = "dynvec3";
        public static PTCOLOR:string = "ptColor";
        public static VERCOLOR:string = "verColor";
        public static HEIGHTINFO:string = "heightinfo";
        public static FRESNEL:string = "fresnel";
        public static REFRACTION:string = "refraction";
        public static PANNER:string = "panner";


        public inputVec:Array<NodeTreeInputItem>;
        public outputVec: Array<NodeTreeOutoutItem>;
        public ui: BaseMaterialNodeUI;
        public type: string;
        public paramName: string;
        public canDynamic: boolean;
        public regResultTemp: RegisterItem;
        public regResultConst: RegisterItem;
        public regResultTex: RegisterItem;
        public regConstIndex: number;
        public priority: number = -1;
        public  shaderStr: string;
        public static  jsMode: boolean = false;
        public constructor() {
            this.inputVec = new Array
            this.outputVec = new Array
        }
   
        public addInput($in: NodeTreeItem): void {
            var initem: NodeTreeInputItem = $in as NodeTreeInputItem;
            if (!initem) {
                throw new Error("转换失败");
            }
            this.inputVec.push(initem);
            initem.node = this;
            this.refreshID();
        }
        public removeInput($in: NodeTreeItem): void {
            for (var i: number=0; i < this.inputVec.length; i++) {
                if (this.inputVec[i] == $in) {
                    this.inputVec.splice(i, 1);
                    break;
                }
            }
           this.refreshID();
        }

        public addOutput($in: NodeTreeItem): void {
            var initem: NodeTreeOutoutItem = $in as NodeTreeOutoutItem;
            if (!initem) {
                throw new Error("转换失败");
            }
            this.outputVec.push(initem);
            initem.node = this;
            this.refreshID();
        }
        public removeOutput($out: NodeTreeItem): void {
            for (var i: number = 0; i < this.outputVec.length; i++) {
                if (this.outputVec[i] == $out) {
                    this.outputVec.splice(i, 1);
                    break;
                }
            }

            this. refreshID();
        }
		
        public refreshID(): void {
            for (var i: number; i < this.inputVec.length; i++) {
                this. inputVec[i].id = i;
            }
            for (i = 0; i < this.outputVec.length; i++) {
                this. outputVec[i].id = i;
            }
        }
        public id: number = -1;
        public getObj(): Object {
            var obj: any = new Object;
            obj.id = this.id;
            obj.type = this.type;
            obj.data = this.ui.getData();

            var inAry: Array<any> = new Array;
            for (var i: number; i < this.inputVec.length; i++) {
                inAry.push(this.inputVec[i].getObj());
            }
            obj.inAry = inAry;

            var outAry: Array<any> = new Array;
            for (i = 0; i < this.outputVec.length; i++) {
                outAry.push(this.outputVec[i].getObj())
            }
            obj.outAry = outAry;

            return obj;
        }
        public  get isDynamic():boolean {
            return this._isDynamic;
        }
        private  _isDynamic: boolean;
        public  set isDynamic(value: boolean) {
            this._isDynamic = value;
        }
        public checkInput(): Boolean {
            for (var i: number=0; i < this.inputVec.length; i++) {
                if (!this.inputVec[i].parentNodeItem) {
                    return false;
                }
            }
            return true;
        }

        public getComponentID($id: number): string{
            if($id == 0) {
                return CompileOne.FT + this.regResultTemp.id + ".xyz";
            }else if($id == 1) {
                return CompileOne.FT + this.regResultTemp.id + ".x";
            }else if($id == 2) {
                return CompileOne.FT + this.regResultTemp.id + ".y";
            }else if($id == 3) {
                return CompileOne.FT + this.regResultTemp.id + ".z";
            }else if($id == 4) {
                return CompileOne.FT + this.regResultTemp.id + ".w";
            }else{
                return CompileOne.FT + this.regResultTemp.id;
            }
			
        }
        public releaseUse(): void {
            var allCompilde: boolean = true;
            for (var i: number=0; i < this.outputVec.length; i++) {
                var sunAry: Array<NodeTreeInputItem> =this. outputVec[i].sunNodeItems;
                var breakAble: boolean = false;
                for (var j: number = 0; j < sunAry.length; j++) {
                    if (!sunAry[j].hasCompiled) {
                        allCompilde = false;
                        breakAble = true;
                        break;
                    }
                }
                if (breakAble) {
                    break;
                }
            }
            if (allCompilde) {
                if (this.regResultTemp) {
                    this.regResultTemp.inUse = false;
                }
            }
        }

    }
}