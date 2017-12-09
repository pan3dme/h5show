var LightBmpModel = /** @class */ (function () {
    function LightBmpModel() {
    }
    LightBmpModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new LightBmpModel();
        }
        return this._instance;
    };
    LightBmpModel.prototype.upLightTexture = function ($frameVoItem) {
        var $frame = Math.floor(Frame3dRes.frameNum);
        for (var i = 0; $frameVoItem && i < $frameVoItem.length; i++) {
            var $node = $frameVoItem[i];
            var $isVisible = $node.isVisible($frame);
            if ($isVisible && !$node.frameNodeVo.noLight) {
                var $dis = $node.sprite;
                var $ctx = UIManager.getInstance().getContext2D(1024, 1024, false);
                $ctx.drawImage(this.videoElem, 0, 0, this.videoElem.videoWidth, this.videoElem.videoHeight, 0, 0, 1024, 1024);
                if (!this.videoTextureRes) {
                    this.videoTextureRes = TextureManager.getInstance().getCanvasTexture($ctx);
                }
                TextureManager.getInstance().updateTexture(this.videoTextureRes.texture, 0, 0, $ctx);
                $dis.lightMapTextureRes = this.videoTextureRes;
                this.setVdeoLightUvData($node, $frame);
            }
        }
    };
    LightBmpModel.prototype.setVdeoLightUvData = function ($node, $frame) {
        if (this.videoLightUvData) {
            for (var i = 0; i < this.videoLightUvData[$frame].length; i++) {
                var $obj = this.videoLightUvData[$frame][i];
                if ($obj.id == $node.frameNodeVo.id) {
                    if ($node.frameNodeVo.receiveShadow) {
                        var $disA = $node.sprite;
                        $disA.uxtxData[0] = $obj.width / 1024;
                        $disA.uxtxData[1] = $obj.height / 1024;
                        $disA.uxtxData[2] = $obj.x / 1024;
                        $disA.uxtxData[3] = $obj.y / 1024;
                    }
                    else {
                        var $dis = $node.sprite;
                        $dis.uxtxData[0] = $obj.width / 1024;
                        $dis.uxtxData[1] = $obj.height / 1024;
                        $dis.uxtxData[2] = $obj.x / 1024;
                        $dis.uxtxData[3] = $obj.y / 1024;
                    }
                }
            }
        }
    };
    LightBmpModel.prototype.getLightKeyFrmeArr = function ($arr) {
        var $dis = new Dictionary([]);
        for (var i = 0; i < $arr.length; i++) {
            for (var j = 0; j < $arr[i].frameNodeVo.pointitem.length; j++) {
                if ($arr[i].frameNodeVo.pointitem[j].iskeyFrame && j == 0) {
                    var $frmeNum = $arr[i].frameNodeVo.pointitem[j].time;
                    $dis[$frmeNum] = true;
                }
            }
        }
        var $listNum = new Array;
        for (var $key in $dis) {
            if (!isNaN(Number($key))) {
                $listNum.push(Number($key));
            }
        }
        return $listNum;
    };
    return LightBmpModel;
}());
//# sourceMappingURL=LightBmpModel.js.map