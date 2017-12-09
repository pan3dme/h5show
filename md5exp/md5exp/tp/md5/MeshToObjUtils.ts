module md5list {

    export class MeshToObjUtils {

        public getObj(mesh: Md5MeshData): ObjData {
            var objData: ObjData = new ObjData;
            objData.vertices = new Array;
            objData.uvs = new Array;
            objData.normals = new Array;
            objData.indexs = new Array;

            var bindPosAry: Array<Matrix3D> = new Array;
            var invertAry: Array<Matrix3D> = new Array;

            var meshItemAry: Array<MeshItem> = new Array;
            var boneItemAry: Array<ObjectBone> = this.processBoneNew(mesh.boneItem);

            for (var i: number = 0; i < boneItemAry.length; i++) {
                var objbone: ObjectBone = boneItemAry[i];
                var OldQ: Quaternion = new Quaternion(objbone.qx, objbone.qy, objbone.qz);
                OldQ.w = this.getW(OldQ.x, OldQ.y, OldQ.z);
                var newM: Matrix3D = OldQ.toMatrix3D();
                newM.appendTranslation(objbone.tx, objbone.ty, objbone.tz);
                objbone.matrix = newM;

                bindPosAry.push(newM)
                var inverMatrix: Matrix3D = newM.clone();
                inverMatrix.invert();
                invertAry.push(inverMatrix);
            }

            for (i = 0; i < mesh.uvItem.length; i++) {
                var objuv: ObjectUv = mesh.uvItem[i];
                var v3d: Vector3D = new Vector3D;

                var wAry: Array<any> = new Array;

                for (var j: number = 0; j < objuv.b; j++) {
                    var weightID: number = objuv.a + j;
                    var objWeight: ObjectWeight = mesh.weightItem[weightID];
                    var ma: Matrix3D = boneItemAry[objWeight.boneId].matrix;

                    var tempV3d: Vector3D = new Vector3D(objWeight.x, objWeight.y, objWeight.z);
                    tempV3d = ma.transformVector(tempV3d);
                    tempV3d.scaleBy(objWeight.w);
                    v3d = v3d.add(tempV3d);
                    wAry.push(objWeight.w);
                }
                objData.vertices.push(v3d.x, v3d.y, v3d.z);
                objData.uvs.push(objuv.x, objuv.y);
                var meshitem: MeshItem = new MeshItem;
                meshitem.verts = new Vector3D(v3d.x, v3d.y, v3d.z);
                meshitem.uvInfo = objuv;

                meshItemAry.push(meshitem);
            }

            for (i = 0; i < mesh.triItem.length; i++) {
                objData.indexs.push(mesh.triItem[i].t0, mesh.triItem[i].t1, mesh.triItem[i].t2);
            }

            objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(objData.vertices);
            objData.uvBuffer = Scene_data.context3D.uploadBuff3D(objData.uvs);
            objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(objData.indexs);
            objData.bindPosAry = bindPosAry;
            objData.invertAry = invertAry;



            return objData;
        }
        private getW(x: number, y: number, z: number): number {
            var t: number = 1 - (x * x + y * y + z * z);
            if (t < 0) {
                t = 0
            } else {
                t = -Math.sqrt(t);
            }
            return t;
        }
        public processBoneNew(targetAry: Array<ObjectBone>): Array<ObjectBone> {

            var newTargetAry: Array<ObjectBone> = MeshToObjUtils.getStorNewTargerArr(targetAry);
            //添加bip骨骼到新数组
            var mapkeyAry: Array<any> = new Array;//新旧ID映射关系
            for (var i: number = 0; i < targetAry.length; i++) {
                var index: number = newTargetAry.indexOf(targetAry[i]);
                mapkeyAry.push(index);
            }
            var resultAry: Array<ObjectBone> = new Array;//最终更新的数据
            for (i = 0; i < newTargetAry.length; i++) {//数据复制
                var $kkkk: ObjectBone = newTargetAry[i];
                resultAry.push($kkkk.clone());
            }

            for (i = 0; i < resultAry.length; i++) {//从映射关系更新父级id
                index = resultAry[i].father;
                if (index != -1) {
                    resultAry[i].father = mapkeyAry[index];
                }
            }

            return resultAry;

        }

        public static getStorNewTargerArr(targetAry: Array<ObjectBone>): Array<ObjectBone> {
            var newTargetAry: Array<ObjectBone> = new Array;
            var i: number
            /*
               for (i = 0; i < targetAry.length; i++) {
                   if (targetAry[i].name.indexOf("origin") != -1) {
                       newTargetAry.push(targetAry[i]);
                   }
               }
       
               for (i = 0; i < targetAry.length; i++) {
                   if (targetAry[i].name.indexOf("Bip") != -1) {
                       newTargetAry.push(targetAry[i]);
                   }
               }
               //添加weapon骨骼到新数组
               for (i = 0; i < targetAry.length; i++) {
                   if (targetAry[i].name.indexOf("weapon") != -1) {
                       newTargetAry.push(targetAry[i]);
                   }
               }
       
               */

            //添加剩余的骨骼到新数组
            for (i = 0; i < targetAry.length; i++) {
                if (newTargetAry.indexOf(targetAry[i]) == -1) {
                    newTargetAry.push(targetAry[i]);
                }
            }
            return newTargetAry
        }
    }
}