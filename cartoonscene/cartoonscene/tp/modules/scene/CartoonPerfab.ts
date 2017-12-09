

class CartoonDisplay3dSprite extends Display3DSprite {

    constructor() {
        super();
    }
    public update(): void {
        this.updateOutLine()
    }
    private setMaztion(): void {
        var tf: boolean = Scene_data.context3D.pushVa(this.objData.vertexBuffer);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", Scene_data.viewMatrx3D.m);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
        Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", this.posMatrix.m);

        Scene_data.context3D.setVaOffset(0, 3, this.objData.stride, 0);
        Scene_data.context3D.setVaOffset(1, 3, this.objData.stride, this.objData.normalsOffsets);
        if (!this._rotationData) {
            this._rotationData = new Float32Array(9)
        }
    }
    public updateOutLine(): void {
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(true);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CCW);
        ProgrmaManager.getInstance().registe(OurLineRoundShader.OurLineRoundShader, new OurLineRoundShader);
        this.shader = ProgrmaManager.getInstance().getProgram(OurLineRoundShader.OurLineRoundShader);
        Scene_data.context3D.setProgram(this.shader.program);

        this.setMaztion();

        var $rotationM: Matrix3D = Scene_data.cam3D.cameraMatrix.clone();
        $rotationM.prepend(this.posMatrix)
        $rotationM.getRotaion(this._rotationData);
        Scene_data.context3D.setVcMatrix3fv(this.shader, "rotationMatrix3D", this._rotationData);

        var nt: number = 1 / ((this.scaleX + this.scaleZ + this.scaleZ) / 3);

        //this.Factor= nt
        //this.Outline = nt*2
        Scene_data.context3D.setVc4fv(this.shader, "datainfo", [this.Factor, this.Outline,1,1]);

        Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);


    }
   
    public Factor: number = 0.5;
    public Outline: number = 0.5;

    public updateCortoon(): void {
   
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(false);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CW);
        if (this.objData && this.objData.indexBuffer) {
            ProgrmaManager.getInstance().registe(OutCortoonShader.OutCortoonShader, new OutCortoonShader);
            this.shader = ProgrmaManager.getInstance().getProgram(OutCortoonShader.OutCortoonShader);
            Scene_data.context3D.setProgram(this.shader.program);

            this.setMaztion()

            var $m: Matrix3D = this.posMatrix.clone()
           // $m.appendTranslation(30,0,0)
            Scene_data.context3D.setVcMatrix4fv(this.shader, "posMatrix3D", $m.m);
       
            this.posMatrix.getRotaion(this._rotationData);
            Scene_data.context3D.setVcMatrix3fv(this.shader, "rotationMatrix3D", this._rotationData);
            Scene_data.context3D.setVc3fv(this.shader, "lightNrm", [1, 2, 3]);

            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);


        }
    }
}


class CartoonPerfab extends ScenePerfab {

    protected loadPartRes($bindSocket: string, groupRes: GroupRes, ary: Array<any>): void {

        for (var i: number = 0; i < groupRes.dataAry.length; i++) {
            var item: GroupItem = groupRes.dataAry[i];

            if (item.types == BaseRes.PREFAB_TYPE) {
                var display: CartoonDisplay3dSprite = new CartoonDisplay3dSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                display.dynamic = true;
                ary.push(display);
                display.setBind(this, $bindSocket);
                SceneManager.getInstance().addDisplay(display);
            }

        }

        this.updateRotationMatrix();
        this.changeCartoonData()
        /*
       var _Factor: number = nt
        var _Outline: number = nt*2
        */
    }
    private changeCartoonData(): void
    {
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: CartoonDisplay3dSprite = <CartoonDisplay3dSprite>this.item[i];
            $dis.Factor = this._Factor
            $dis.Outline = this._Outline
        }
    }
    private _Factor: number = 0.5;
    public set Factor(value: number) {
        this._Factor = value;
        this.changeCartoonData()
    }

    private _Outline: number = 0.5;
    public set Outline(value: number) {
        this._Outline = value
        this.changeCartoonData()
    }
    public updateRotationMatrix(): void {
        super.updateRotationMatrix();
        for (var i: number = 0; i < this.item.length; i++) {
            var $dis: Display3DSprite = <Display3DSprite>this.item[i];
            $dis.posMatrix = this.posMatrix;
        }
    }
    protected item: Array<Display3D>
    public setPerfabName($str: string): void {
        this.item = new Array;
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), (groupRes: GroupRes) => {
            this.loadPartRes("", groupRes, this.item)
        })
    }

}