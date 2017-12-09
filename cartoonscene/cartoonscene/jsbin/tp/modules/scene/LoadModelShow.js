var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LoadModelShow = (function (_super) {
    __extends(LoadModelShow, _super);
    function LoadModelShow() {
        _super.call(this);
        this.loadObjByUrl("box.obj");
    }
    LoadModelShow.prototype.loadObjByUrl = function ($url) {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE, function ($str) {
            console.log($str);
        });
    };
    LoadModelShow.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(BaseDiplay3dShader.BaseDiplay3dShader, new BaseDiplay3dShader);
        this.shader = ProgrmaManager.getInstance().getProgram(BaseDiplay3dShader.BaseDiplay3dShader);
        this.program = this.shader.program;
        this.objData = new ObjData;
        this.objData.vertices = new Array();
        this.objData.vertices.push(0, 0, 0);
        this.objData.vertices.push(100, 0, 0);
        this.objData.vertices.push(50, 50, 100);
        this.objData.uvs = new Array();
        this.objData.uvs.push(0, 0);
        this.objData.uvs.push(1, 0);
        this.objData.uvs.push(0, 1);
        this.objData.indexs = new Array();
        this.objData.indexs.push(0, 1, 2);
        this.loadTexture();
        this.upToGpu();
    };
    return LoadModelShow;
})(BaseDiplay3dSprite);
//# sourceMappingURL=LoadModelShow.js.map