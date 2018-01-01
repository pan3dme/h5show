var materialui;
(function (materialui) {
    var NodeTree = (function () {
        function NodeTree() {
            this.inputVec = new Array;
            this.outputVec = new Array;
        }
        NodeTree.prototype.addInput = function ($in) {
            var initem = $in;
            if (!initem) {
                throw new Error("转换失败");
            }
            this.inputVec.push(initem);
            initem.node = this;
            this.refreshID();
        };
        NodeTree.prototype.removeInput = function ($in) {
            for (var i = 0; i < this.inputVec.length; i++) {
                if (this.inputVec[i] == $in) {
                    this.inputVec.splice(i, 1);
                    break;
                }
            }
            this.refreshID();
        };
        NodeTree.prototype.addOutput = function ($in) {
            var initem = $in;
            if (!initem) {
                throw new Error("转换失败");
            }
            this.outputVec.push(initem);
            initem.node = this;
            this.refreshID();
        };
        NodeTree.prototype.removeOutput = function ($out) {
            for (var i = 0; i < this.outputVec.length; i++) {
                if (this.outputVec[i] == $out) {
                    this.outputVec.splice(i, 1);
                    break;
                }
            }
            this.refreshID();
        };
        NodeTree.prototype.refreshID = function () {
        };
        NodeTree.TEX = "tex";
        NodeTree.OP = "op";
        NodeTree.ADD = "add";
        NodeTree.SUB = "sub";
        NodeTree.MUL = "mul";
        NodeTree.DIV = "div";
        NodeTree.RCP = "rcp";
        NodeTree.MIN = "min";
        NodeTree.MAX = "max";
        NodeTree.FRC = "frc";
        NodeTree.SQT = "sqt";
        NodeTree.RSQ = "rsq";
        NodeTree.POW = "pow";
        NodeTree.LOG = "log";
        NodeTree.EXP = "exp";
        NodeTree.NRM = "nrm";
        NodeTree.SIN = "sin";
        NodeTree.COS = "cos";
        NodeTree.CRS = "crs";
        NodeTree.DP3 = "dp3";
        NodeTree.DP4 = "dp4";
        NodeTree.ABS = "abs";
        NodeTree.NEG = "neg";
        NodeTree.SAT = "sat";
        NodeTree.LERP = "lerp";
        NodeTree.VEC3 = "vec3";
        NodeTree.VEC2 = "vec2";
        NodeTree.FLOAT = "float";
        NodeTree.TIME = "time";
        NodeTree.TEXCOORD = "texcoord";
        NodeTree.DYNVEC3 = "dynvec3";
        NodeTree.PTCOLOR = "ptColor";
        NodeTree.VERCOLOR = "verColor";
        NodeTree.HEIGHTINFO = "heightinfo";
        NodeTree.FRESNEL = "fresnel";
        NodeTree.REFRACTION = "refraction";
        NodeTree.PANNER = "panner";
        return NodeTree;
    })();
    materialui.NodeTree = NodeTree;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTree.js.map