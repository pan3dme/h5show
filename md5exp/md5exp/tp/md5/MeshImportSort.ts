
module md5list {

    export class ObjectTri {
        public id: number = 0;
        public t0: number = 0;
        public t1: number = 0;
        public t2: number = 0;
        constructor() {

        }
    }

    export class ObjectWeight {
        public x: number = 0;
        public y: number = 0;
        public z: number = 0;
        public w: number = 0;
        public weight: number = 0;
        public boneId: number = 0;
        public id: number = 0;
        constructor() {

        }
        public clone(): ObjectWeight {
            var obj: ObjectWeight = new ObjectWeight;
            obj.x = this.x;
            obj.y = this.y;
            obj.z = this.z;
            obj.w = this.w;
            obj.weight = this.weight;
            obj.boneId = this.boneId;
            obj.id = this.id;
            return obj;
        }
    }
    export  class ObjectUv {
        public x: number = 0;
        public y: number = 0;
        public z: number = 0;
        public a: number = 0;
        public b: number = 0;
        public w: number = 0;
        public id: number = 0;
        constructor() {

        }
    }
    export class MeshItem {
        public verts: Vector3D;
        public normal: Vector3D = new Vector3D;
        public uvInfo: ObjectUv;
        public num: number;
    }

    export  class Md5MeshData extends MeshData {
        public mesh: Dictionary;
        public triItem: Array<ObjectTri>
        public weightItem: Array<ObjectWeight>
        public uvItem: Array<ObjectUv>
        public boneItem: Array<ObjectBone>
        public faceNum: number;

        public dataAry: Array<number>;
        public uvArray: Array<number>;
        public boneWeightAry: Array<number>;
        public bonetIDAry: Array<number>;
        public indexAry: Array<number>;
    }

    export  class MeshImportSort {
        public processMesh(meshData: Md5MeshData): void {
            var weightAry: Array<ObjectWeight> = new Array
            var i: number = 0
            for (i = 0; i < meshData.weightItem.length; i++) {
                weightAry.push(meshData.weightItem[i].clone());
            }

            var mapkeyAry: Array<number> = this.getMapValue(meshData.boneItem);


            for (i = 0; i < weightAry.length; i++) {
                //trace(weightAry[i].boneId,mapkeyAry[weightAry[i].boneId])
                weightAry[i].boneId = mapkeyAry[weightAry[i].boneId]
            }
            //			meshData.souceBoneItem
            meshData.weightItem = weightAry;

            this.processForAgal(meshData);

        }
        public beginKey: number = 20;
        public bindWidth: number = 4;
        private processForAgal(meshData: Md5MeshData): void {

            var beginKey: number = 1;

            var uvItem: Array<ObjectUv> = meshData.uvItem;
            var weightItem: Array<ObjectWeight> = meshData.weightItem;
            var triItem: Array<ObjectTri> = meshData.triItem;

            var uvArray: Array<number> = new Array();
            var ary: Array<Array<number>> = [[], [], [], []];
            var boneWeightAry: Array<number> = new Array;
            var bonetIDAry: Array<number> = new Array;
            var indexAry: Array<number> = new Array;

            var skipNum: number;
            var beginIndex: number;
            var allNum: number;

            var boneUseAry: Array<number> = new Array;

            for (var i: number = 0; i < uvItem.length; i++) {
                beginIndex = uvItem[i].a;
                allNum = uvItem[i].b;
                for (skipNum = 0; skipNum < 4; skipNum++) {
                    if (skipNum < allNum) {
                        boneUseAry.push((weightItem[beginIndex + skipNum].boneId));
                    } else {
                        boneUseAry.push(boneUseAry[0]);
                    }
                }
            }

            boneUseAry = this.getboneNum(boneUseAry);

            for (i = 0; i < uvItem.length; i++) {
                beginIndex = uvItem[i].a;
                allNum = uvItem[i].b;
                for (skipNum = 0; skipNum < 4; skipNum++) {
                    if (skipNum < allNum) {
                        ary[skipNum].push(weightItem[beginIndex + skipNum].x, weightItem[beginIndex + skipNum].y, weightItem[beginIndex + skipNum].z);
                        bonetIDAry.push(boneUseAry.indexOf((weightItem[beginIndex + skipNum].boneId)));
                        boneWeightAry.push(weightItem[beginIndex + skipNum].w);
                    } else {
                        ary[skipNum].push(0, 0, 0);
                        bonetIDAry.push(boneUseAry.indexOf(0));
                        boneWeightAry.push(0);
                    }
                }
                uvArray.push(uvItem[i].x);
                uvArray.push(uvItem[i].y);
            }

            meshData.boneNewIDAry = boneUseAry;

            for (i = 0; i < triItem.length; i++) {
                indexAry.push(triItem[i].t0, triItem[i].t1, triItem[i].t2);
            }
            meshData.faceNum = indexAry.length / 3;

            meshData.treNum = indexAry.length;
            // console.log(meshData, uvArray, ary, boneWeightAry, bonetIDAry, indexAry)
            this.uplodToGpu(meshData, uvArray, ary, boneWeightAry, bonetIDAry, indexAry);

        }

        public uplodToGpu(meshData: MeshData, uvArray: Array<number>, ary3: Array<Array<number>>,
            boneWeightAry: Array<number>, bonetIDAry: Array<number>, indexAry: Array<number>): void {

            meshData.uvBuffer = Scene_data.context3D.uploadBuff3D(uvArray);
            meshData.boneWeightBuffer = Scene_data.context3D.uploadBuff3D(boneWeightAry);
            var arrA: Array<number> = new Array;
            for (var i: number = 0; i < bonetIDAry.length; i++) {
                arrA.push(Math.max(bonetIDAry[i], 0))
            }
            meshData.boneIdBuffer = Scene_data.context3D.uploadBuff3D(arrA);
            meshData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(indexAry);


        }

        private getboneNum(ary: Array<number>): Array<number> {
            var numAry: Array<number> = new Array;
            for (var i: number = 0; i < ary.length; i++) {
                if (numAry.indexOf(ary[i]) == -1) {
                    numAry.push(ary[i]);
                }
            }

            return numAry;
        }

        /**
     * 返回映射关系列表 
     * @param targetAry
     * @return 
     * 
     */
        private getMapValue(targetAry: Array<ObjectBone>): Array<number> {
            var newTargetAry: Array<ObjectBone> = MeshToObjUtils.getStorNewTargerArr(targetAry);
            var mapkeyAry: Array<number> = new Array;//新旧ID映射关系
            for (var i: number = 0; i < targetAry.length; i++) {
                var index: number = newTargetAry.indexOf(targetAry[i]);
                mapkeyAry.push(index);
            }
            return mapkeyAry;
        }

    }
}