


module md5list {

    export class Md5Analysis {

        constructor() {

        }

        public addMesh(str: string): Md5MeshData {
            var arr: Array<string>;
            if (str.indexOf("mesh") != -1) {
                //存入没一个元件MESH;
                var meshData: Md5MeshData = new Md5MeshData();
                var meshSmaple: Dictionary = new Dictionary([]);



                arr = str.split(/[\n\r]{2}/);

                var numverts: Boolean = false;

                var numvertsIndex: number = 0;

                var currentnumvertsIndex: number = 0;

                var numvertsArray: Array<any> = new Array();

                var numtris: Boolean = false;

                var numtrisIndex: number = 0;

                var currentnumtrisIndex: number = 0;

                var numtrisArray: Array<any> = new Array();

                var numweights: Boolean = false;

                var numweightsIndex: number = 0;

                var currentnumweightsIndex: number = 0;

                var numweightsArray: Array<any> = new Array();

                var joints: Boolean;

                var jointAry: Array<any> = new Array;

                var reg: RegExp = /\d+/;


                for (var m: number = 0; m < arr.length; m++) {


                    if (numverts) {

                        if (currentnumvertsIndex < numvertsIndex) {

                            numvertsArray.push(arr[m]);

                            currentnumvertsIndex++;

                        } else {

                            //mesh["numverts"] = numvertsArray;
                            meshSmaple["numverts"] = numvertsArray;


                            numverts = false;
                        }
                    }

                    if (numtris) {

                        if (currentnumtrisIndex < numtrisIndex) {

                            numtrisArray.push(arr[m]);

                            currentnumtrisIndex++;

                        } else {

                            //mesh["numtris"] = numtrisArray;
                            meshSmaple["numtris"] = numtrisArray;

                            numtris = false;
                        }
                    }

                    if (numweights) {

                        if (currentnumweightsIndex < numweightsIndex) {

                            numweightsArray.push(arr[m]);

                            currentnumweightsIndex++;

                        } else {

                            //mesh["numweights"] = numweightsArray;
                            meshSmaple["numweights"] = numweightsArray;

                            numweights = false;
                        }
                    }

                    if (joints) {

                        jointAry.push(arr[m]);

                    }

                    if (String(arr[m]).indexOf("numverts") != -1) {

                        numverts = true;

                        numvertsIndex = Number(arr[m].match(reg)[0]);

                    }

                    if (String(arr[m]).indexOf("numtris") != -1) {

                        numtris = true;



                        numtrisIndex = Number(arr[m].match(reg)[0])



                    }

                    if (String(arr[m]).indexOf("numweights") != -1) {

                        numweights = true;

                        numweightsIndex = Number(arr[m].match(reg)[0]);

                    }

                    if (String(arr[m]).indexOf("joints") != -1) {

                        joints = true;

                    }

                    if (String(arr[m]).indexOf("mesh") != -1) {

                        joints = false;
                        meshSmaple["joints"] = jointAry;
                    }
                    if (String(arr[m]).indexOf("commandline") != -1) {


                    }


                }

                meshData.mesh = meshSmaple;
                this.joinTri(meshData);
                this.joinPoint(meshData);
                this.joinUV(meshData);
                this.joinJoints(meshData);


                // console.log(meshData)

                return meshData;
            }
            return null;
        }

        public joinJoints(meshData: Md5MeshData): void {
            var jointAry: Array<string> = meshData.mesh["joints"];
            meshData.boneItem = new Array;

            for (var i: number = 0; i < jointAry.length; i++) {
                var line: String = jointAry[i];
                if (line.length < 9) {
                    break;
                }
                var boneName: string = line.match(/\".+\"/)[0]
                line = line.replace(boneName, "")
                var boneNameAry: Array<string> = TpGame.getArrByStr(line);
                if (boneNameAry.length == 1) {
                    break;
                }

                var bone: ObjectBone = new ObjectBone();
                bone.name = boneName
                bone.father = Number(boneNameAry[0]);
                bone.tx = Number(boneNameAry[2]);
                bone.ty = Number(boneNameAry[3]);
                bone.tz = Number(boneNameAry[4]);

                bone.qx = Number(boneNameAry[7]);
                bone.qy = Number(boneNameAry[8]);
                bone.qz = Number(boneNameAry[9]);
                meshData.boneItem.push(bone);
            }
        }
        private joinUV(meshData: Md5MeshData): void {
            var _meshNumverts: Array<string> = meshData.mesh["numverts"];
            meshData.uvItem = new Array()
            var _str: string = "";
            var _arr: Array<string> = new Array();
            var i: number = 0;
            for (i = 0; i < _meshNumverts.length; i++) {
                _str = this.genewStr(_meshNumverts[i]);
                _arr = _str.split(" ");
                var _temp: ObjectUv = new ObjectUv();
                _temp.id = Number(_arr[1]);
                _temp.x = Number(_arr[2]);
                _temp.y = Number(_arr[3]);
                _temp.a = Number(_arr[4]);
                _temp.b = Number(_arr[5]);

                meshData.uvItem.push(_temp);
            }
        }

        private joinPoint(meshData: Md5MeshData): void {
            var _meshNumweights: Array<string> = meshData.mesh["numweights"];
            meshData.weightItem = new Array;
            var _str: string = "";
            var _arr: Array<string> = new Array();
            var i: number = 0;
            for (i = 0; i < _meshNumweights.length; i++) {
                _str = this.genewStr(_meshNumweights[i]);
                _arr = _str.split(" ");
                var _temp: ObjectWeight = new ObjectWeight();
                _temp.id = Number(_arr[1]);
                _temp.boneId = Number(_arr[2]);
                _temp.w = Number(_arr[3]);
                _temp.x = Number(_arr[4]);
                _temp.y = Number(_arr[5]);
                _temp.z = Number(_arr[6]);
                meshData.weightItem.push(_temp);
            }
        }
        public joinTri(meshData: Md5MeshData): void {
            var _meshNumtris: Array<string> = meshData.mesh["numtris"];
            meshData.triItem = new Array
            var _str: String = "";
            var _arr: Array<string> = new Array();
            var i: number = 0;
            for (i = 0; i < _meshNumtris.length; i++) {
                _str = this.genewStr(_meshNumtris[i]);
                _arr = _str.split(" ");
                var _temp: ObjectTri = new ObjectTri();
                _temp.id = Number(_arr[1]);
                _temp.t0 = Number(_arr[2]);
                _temp.t1 = Number(_arr[3]);
                _temp.t2 = Number(_arr[4]);
                meshData.triItem.push(_temp);
            }
        }
        private genewStr(_str: string): string {
            var _s: string = "";
            var _t: string = "";
            var _e: string = " ";
            var i: number = 0;
            while (i < _str.length) {
                _t = _str.charAt(i);
                switch (_t) {
                    case "(":
                        break;
                    case ")":
                        break;
                    case "\"":
                        break;
                    case "	":
                        if (_e != " ") {
                            _s = _s + " ";
                        }
                        _e = " ";
                        break;
                    case " ":
                        if (_e != " ") {
                            _s = _s + " ";
                        }
                        _e = " ";
                        break;
                    default:
                        _s = _s + _t;
                        _e = _t;
                        break;
                }

                i++;
            }

            return _s;
        }

    }
}