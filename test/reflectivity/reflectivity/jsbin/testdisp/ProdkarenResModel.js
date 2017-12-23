var ProdkarenResModel = /** @class */ (function () {
    function ProdkarenResModel() {
    }
    ProdkarenResModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new ProdkarenResModel();
        }
        return this._instance;
    };
    ProdkarenResModel.prototype.loadTexturelByBoldUrl = function ($url, $fun) {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE, function ($data) {
            var _stritem = $data.split(",");
            var imgAryBuffer = new ArrayBuffer(_stritem.length);
            var bdata = new Uint8Array(imgAryBuffer);
            for (var i = 0; i < _stritem.length; i++) {
                bdata[i] = Number(_stritem[i]);
            }
            var useImgData = bdata;
            var d = new Image();
            var a = new Blob([useImgData], {
                type: "image/jpeg"
            });
            var e = URL.createObjectURL(a);
            d.onload = function (evt) {
                var $jpgurl = $url.replace(".txt", ".jpg");
                console.log($jpgurl);
                TextureManager.getInstance().addRes($jpgurl, d);
                var etimg = evt.target;
                URL.revokeObjectURL(etimg.src);
                TextureManager.getInstance().getTexture($jpgurl, $fun);
            };
            d.src = e;
        });
    };
    ProdkarenResModel.prototype.loadBuffByTxtUrl = function ($url, $fun) {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE, function ($dtstr) {
            var configText = $dtstr.split(",");
            var $dataArr = new Array();
            for (var i = 0; i < configText.length; i++) {
                $dataArr.push(Number(configText[i]));
            }
            console.log($dataArr.length);
            var $buffData = Scene_data.context3D.renderContext.createBuffer();
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $buffData);
            Scene_data.context3D.renderContext.bufferData(Scene_data.context3D.renderContext.ARRAY_BUFFER, new Uint8Array($dataArr), Scene_data.context3D.renderContext.STATIC_DRAW);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, null);
            $fun($buffData);
        });
    };
    return ProdkarenResModel;
}());
//# sourceMappingURL=ProdkarenResModel.js.map