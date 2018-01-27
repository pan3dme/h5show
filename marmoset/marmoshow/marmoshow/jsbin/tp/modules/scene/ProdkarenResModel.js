var ProdkarenResModel = (function () {
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
                var $img = d;
                var $textureRect = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
                var $ctx = UIManager.getInstance().getContext2D($textureRect.width, $textureRect.height, false);
                $ctx.scale(1, -1);
                $ctx.drawImage($img, 0, 0, $textureRect.width, $textureRect.height, 0, 0, $textureRect.width, -$textureRect.height);
                var $textureRes = new TextureRes();
                $textureRes.texture = Scene_data.context3D.getTexture($ctx.canvas, 0, 0);
                $textureRes.width = $img.width;
                $textureRes.height = $img.height;
                $textureRes.useNum = 1;
                $ctx.scale(1, 1);
                $fun($textureRes);
            };
            d.src = e;
        });
    };
    ProdkarenResModel.prototype.loadSkyTextureByUrl = function ($url, $fun) {
        var _this = this;
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE, function ($dtstr) {
            var configText = $dtstr.split(",");
            var $dataArr = new Array();
            for (var i = 0; i < configText.length; i++) {
                $dataArr.push(Number(configText[i]));
            }
            var $textureRes = new TextureRes();
            $textureRes.texture = _this.loadArray(new Uint8Array($dataArr), null, null);
            $textureRes.width = 256;
            $textureRes.height = 2048;
            $textureRes.useNum = 1;
            $fun($textureRes);
        });
    };
    ProdkarenResModel.prototype.loadArray = function (a, b, c) {
        var gl = Scene_data.context3D.renderContext;
        var $texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, $texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, a);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return $texture;
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
    ProdkarenResModel.prototype.flectAlphaByUrl = function (rgburl, alphaurl, $fun) {
        var _this = this;
        LoadManager.getInstance().load(rgburl, LoadManager.XML_TYPE, function ($rgbstr) {
            var $rgbItem = _this.getArrByStr($rgbstr);
            LoadManager.getInstance().load(alphaurl, LoadManager.XML_TYPE, function ($alphastr) {
                var $alphaItem = _this.getArrByStr($alphastr);
                _this.getImageDataByItemData($rgbItem, function ($rgbimageData) {
                    _this.getImageDataByItemData($alphaItem, function ($alphaimageData) {
                        for (var i = 0; i < $rgbimageData.data.length; i += 4) {
                            $rgbimageData.data[i + 3] = $alphaimageData.data[i + 0];
                        }
                        var $textureRes = new TextureRes();
                        $textureRes.texture = _this.getTexture($rgbimageData);
                        $textureRes.width = $rgbimageData.width;
                        $textureRes.height = $rgbimageData.height;
                        $textureRes.useNum = 1;
                        $fun && $fun($textureRes);
                    });
                });
            });
        });
    };
    ProdkarenResModel.prototype.getTexture = function ($img) {
        // $mipmap=0
        this.renderContext = Scene_data.context3D.renderContext;
        var $textureRect = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
        var textureObject = this.renderContext.createTexture();
        this.renderContext.bindTexture(this.renderContext.TEXTURE_2D, textureObject);
        this.renderContext.texImage2D(this.renderContext.TEXTURE_2D, 0, this.renderContext.RGBA, this.renderContext.RGBA, this.renderContext.UNSIGNED_BYTE, $img);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_MAG_FILTER, this.renderContext.LINEAR);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_MIN_FILTER, this.renderContext.LINEAR_MIPMAP_LINEAR);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_WRAP_S, this.renderContext.CLAMP_TO_EDGE);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_WRAP_T, this.renderContext.CLAMP_TO_EDGE);
        this.renderContext.generateMipmap(this.renderContext.TEXTURE_2D);
        return textureObject;
    };
    ProdkarenResModel.prototype.getImageDataByItemData = function ($numItem, $fun) {
        var imgAryBuffer = new ArrayBuffer($numItem.length);
        var bdata = new Uint8Array(imgAryBuffer);
        for (var i = 0; i < $numItem.length; i++) {
            bdata[i] = Number($numItem[i]);
        }
        var useImgData = bdata;
        var d = new Image();
        var a = new Blob([useImgData], {
            type: "image/jpeg"
        });
        var e = URL.createObjectURL(a);
        d.onload = function (evt) {
            var $img = d;
            var $textureRect = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
            var $ctx = UIManager.getInstance().getContext2D($textureRect.width, $textureRect.height, false);
            $ctx.scale(1, 1);
            $ctx.drawImage($img, 0, 0, $textureRect.width, $textureRect.height, 0, 0, $textureRect.width, $textureRect.height);
            var $imageData = $ctx.getImageData(0, 0, $textureRect.width, $textureRect.height);
            $ctx.scale(1, 1);
            $fun && $fun($imageData);
        };
        d.src = e;
    };
    ProdkarenResModel.prototype.getArrByStr = function ($dtstr) {
        var configText = $dtstr.split(",");
        var $dataArr = new Array();
        for (var i = 0; i < configText.length; i++) {
            $dataArr.push(Number(configText[i]));
        }
        return $dataArr;
    };
    return ProdkarenResModel;
})();
//# sourceMappingURL=ProdkarenResModel.js.map