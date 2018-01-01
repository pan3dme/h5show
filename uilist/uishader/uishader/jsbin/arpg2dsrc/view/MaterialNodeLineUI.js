var materialui;
(function (materialui) {
    var MaterialNodeLineUI = (function () {
        function MaterialNodeLineUI() {
            this.lineRender = new materialui.NodeLineLinkComponent;
        }
        MaterialNodeLineUI.prototype.setFromNode = function ($node) {
            if ($node.inOut) {
                this.endNode = $node;
            }
            else {
                this.fromNode = $node;
            }
            this.currentHasNode = $node;
            this.needNodeType = !$node.inOut;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
        };
        MaterialNodeLineUI.prototype.onMove = function ($e) {
            this.mousePos = $e;
            this.draw();
        };
        MaterialNodeLineUI.prototype.setEndNode = function ($node) {
            if ($node.inOut) {
                this.endNode = $node;
            }
            else {
                this.fromNode = $node;
            }
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            this.draw();
            this.setNodeLine();
        };
        MaterialNodeLineUI.prototype.setNodeLine = function () {
            if (this.endNode.inLine) {
                var evt = new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE);
                evt.line = this.endNode.inLine;
                ModuleEventManager.dispatchEvent(evt);
            }
            if (this.endNode.typets == materialui.MaterialItemType.UNDEFINE) {
                this.endNode.changeType(this.fromNode.typets);
            }
            this.fromNode.outLineList.push(this);
            this.endNode.inLine = this;
            this.fromNode.setConnect();
            this.endNode.setConnect();
            this.endNode.nodeTreeItem.parentNodeItem = this.fromNode.nodeTreeItem;
            this.fromNode.nodeTreeItem.pushSunNode(this.endNode.nodeTreeItem);
        };
        MaterialNodeLineUI.prototype.removeStage = function () {
            if (this.parent) {
                if (this.parent) {
                    Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
                }
                this.parent.removeRender(this.lineRender);
                this.parent = null;
            }
        };
        MaterialNodeLineUI.prototype.draw = function () {
            if (this.fromNode) {
                this.startPoint = this.parent.globalToLocal(this.fromNode.getStagePoint());
            }
            else {
                this.startPoint = this.parent.getMouse(this.mousePos);
            }
            if (this.endNode) {
                this.endPoint = this.parent.globalToLocal(this.endNode.getStagePoint());
            }
            else {
                this.endPoint = this.parent.getMouse(this.mousePos);
            }
            var $arr = new Array();
            $arr.push(this.startPoint);
            $arr.push(this.endPoint);
            this.lineRender.makeLineUiItem($arr);
        };
        return MaterialNodeLineUI;
    })();
    materialui.MaterialNodeLineUI = MaterialNodeLineUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=MaterialNodeLineUI.js.map