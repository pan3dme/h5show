class LoginEvent extends BaseEvent {
    public static LOGIN_CONNET_EVENT: string = "login_connet_event";
    public static CREAT_LOGIN_UI_EVENT: string = "creat_login_ui_event";
    public static REMOVE_LOGIN_UI_EVENT: string = "remove_login_ui_event";
    public static LOGIN_RECONNET_EVENT: string = "login_reconnet_event";
    public static LOGIN_OUTLINE_RECONNET_EVENT: string = "login_outline_reconnet_event"
    public static LOGIN_ENTER_EVENT: string = "login_enter_event";
}
class LoginModule extends Module {
    public getModuleName(): string {
        return "LoginModule";
    }

    protected listProcessors(): Array<Processor> {
        return [new LoginProcessor()];
    }
}  

class LoginProcessor extends BaseProcessor {
    public getName(): string {
        return "LoginProcessor";
    }



    protected receivedModuleEvent($event: BaseEvent): void {
        if ($event instanceof LoginEvent) {
            if (!GameData.mergeServerMsgVo) {
                GameData.mergeServerMsgVo = new MergeServerMsgVo()
            }
            var evt: LoginEvent = <LoginEvent>$event;
            if (evt.type == LoginEvent.CREAT_LOGIN_UI_EVENT) {
            } else if (evt.type == LoginEvent.LOGIN_CONNET_EVENT) {
                FpsMc.tipStr = "正在连接服务器.."
                if (GameData.mergeServerMsgVo.type == SharedDef.MERGE_TYPE_GAME_TO_PK) { //跨服
                    console.log("跨服进行中$$$$$$$$$$$$$$$$$$$")
                    console.log(GameData.mergeServerMsgVo.host, GameData.mergeServerMsgVo.port)
                    console.log(GameData.mergeServerMsgVo)

                }
                NetManager.getInstance().connect(GameData.mergeServerMsgVo.host, GameData.mergeServerMsgVo.port, () => { this.onConnet() });
            } else if (evt.type == LoginEvent.LOGIN_RECONNET_EVENT) {
                this.onConnet();
            } else if (evt.type == LoginEvent.LOGIN_OUTLINE_RECONNET_EVENT) {//最小化断线重连机制
                this.reConnet();
            } else if (evt.type == LoginEvent.LOGIN_ENTER_EVENT) {
                if (!this._scList) {
                    return;
                }
                TimeUtil.addTimeOut(300, () => {
                    this.sendEnterServer();
                });
            }
        }
    
    }
    public reConnet(): void {

    }
    public onConnet(): void {
        if (GuidData.map) {
            GuidData.map.dispose();
            GuidData.map = null;
        }
        FpsMc.tipStr = "服务器连接成功.."
        var userName: string = sessionStorage.getItem("name");
        
        if (!Boolean(userName)) {
            userName = localStorage.getItem("name");
        }
        if (GameStart.outNet) {
            if (!userName) { //外网如果没有名字，给默认地址
                userName = "test" + float2int(Math.random() * 10000);
                localStorage.setItem("name", userName);
            }
        }
        if (userName) {
            if (userName.search("MO") != -1) {
                Scene_data.isPanGm = true
            } 


            if (!GameData.mergeServerMsgVo.key) { //没有KEY的时候
                GameData.mergeServerMsgVo.makeBaseKey()
            } else {
                console.log("跨服的key", "----------------------")
                console.log(GameData.mergeServerMsgVo.key)

            }
            console.log("#############################发送", GameData.mergeServerMsgVo.key)
            NetManager.getInstance().protocolos.get_session(GameData.mergeServerMsgVo.key, "", "");
        } else {
            window.location.href = "login.html"
        }
    }

    private loadSceneCom(): void {

    }

    private initUI(): void {
      
        alert("没有角色需要设置")
        var $name: string = this.getRandomName()
        if ($name.length) {
            var info: char_create_info = new char_create_info();
            info.faction = 0;
            info.hair_id = 0;
            info.head_id = 0;
            info.level = 1;
            info.race = 0;
            info.gender = random(6)+1;
            //alert(info.gender)
            info.name = $name;
            info.inviteGuid = "";
            //L1.2_1003
            if (getUrlParam("inviteGuid")) {
                info.inviteGuid = getUrlParam("inviteGuid");
            } else {
                info.faction_name = $name + "的家族";
            }
            console.log(" info.inviteGuid=======>", info.inviteGuid)
            NetManager.getInstance().protocolos.char_create(info);
        }

    }
    private getRandomName(): string {
        var str: string
    
            var s1: Array<string> = ['陈', '成', '程', '池', '褚', '淳于', '崔', '代', '单', '单于', '福', '澹台', '狄', '帝', '东', '龚', '东方', '东郭', '独孤', '杜', '端木', '段', '朵', '樊', '范'];
            var s2: Array<string> = ['傲风', '傲之', '霸', '柏舟', '半夏', '邦少', '彼岸', '伯光', '伯雷', '伯庸', '博风', '不败', '不悔', '展天', '残夜', '残竹', '沧海', '浩云', '皓轩', '皓月', '和风'];

            str = s1[float2int(s1.length * Math.random())] + s2[float2int(s2.length * Math.random())];
      


        return str
    }
    private loadProgress(num: number): void {
  
    }
    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new LoginEvent(LoginEvent.CREAT_LOGIN_UI_EVENT),
            new LoginEvent(LoginEvent.LOGIN_CONNET_EVENT),
            new LoginEvent(LoginEvent.LOGIN_RECONNET_EVENT),
            new LoginEvent(LoginEvent.LOGIN_ENTER_EVENT),
            new UIPanelEvent(UIPanelEvent.DISPOSE_PANEL_EVENT),
        ];
    }
    private _scList: s2c_chars_list;
    private _time: number;
    public getCharList($byte: ByteArray): void {
        console.log("getUrlParam", getUrlParam("name"));
        this._scList = new s2c_chars_list();
        s2c_chars_list.read(this._scList, $byte);
        this._time = TimeUtil.getTimer();
        if (!GameStart.ready) {
            return;
        }
        if (GameData.mergeServerMsgVo.type == SharedDef.MERGE_TYPE_GAME_TO_PK) { //跨服
       
        } else {
            TimeUtil.addTimeOut(300, () => {
                console.log("直接发送登录")
                this.sendEnterServer();
            });
        }

    }

    public sendEnterServer(): void {
        if (!this._scList) {
            return;
        }
        if (this._scList.list.length == 0) {//创建角色
            this.initUI();
            GameData.initGMbg = true;
        } else {
            var info: char_create_info = this._scList.list[0];
            NetManager.getInstance().protocolos.player_login(info.guid);
        }
        FpsStage.getInstance().removeShowLoad();


    }

    public enterServer($byte: ByteArray): void {

        var enterInfo: s2c_join_or_leave_server = new s2c_join_or_leave_server();
        s2c_join_or_leave_server.read(enterInfo, $byte);
        console.log("进入服务器：" + enterInfo.server_fd + "," + enterInfo.server_pid + "," + (new Date(enterInfo.time)).toDateString());
        // this.setGmBg();

    }
    private gmGood: any;
    private gmFun: Function;
    public setGmBg(): void {
        if (GuidData.player && GameData.initGMbg) {

            //    NetManager.getInstance().protocolos.chat_world(GuidData.player.getGuid(), 0, GuidData.player.getName(), "@CUSTOM");

            // var num: number = GuidData.player.getPlayerType();
            // this.gmFun = () => {
            //     if (this.gmGood.length == 0){
            //         TimeUtil.removeTimeTick(this.gmFun);
            //         return;
            //     }
            //     var item: number = this.gmGood.pop();
            //     NetManager.getInstance().protocolos.chat_world(GuidData.player.getGuid(), 0, GuidData.player.getName(), "@制造 " + item + " 1 1");
            // };

            // if (num == 1) {
            //     this.gmGood = [10001, 10002, 10021, 10022, 10041];
            // } else if (num = 2) {
            //     this.gmGood = [10011, 10012, 10031, 10032, 10051]; 
            // }

            // TimeUtil.addTimeTick(1000, this.gmFun);

            GameData.initGMbg = false;
        }

    }

    public smsgMergeServerMsg($byte: ByteArray): void {
        NetManager.getInstance().close();
        GuidObjManager.getInstance().dispose();
        UIManager.getInstance().removeAll();

        GameData.mergeServerMsgVo = new MergeServerMsgVo()
        GameData.mergeServerMsgVo.readData($byte)
        ModuleEventManager.dispatchEvent(new LoginEvent(LoginEvent.LOGIN_CONNET_EVENT))

    }

    public getHanderMap(): Object {
        var obj: Object = new Object;
        obj[Protocols.SMSG_CHARS_LIST] = ($byte: ByteArray) => { this.getCharList($byte) };
        obj[Protocols.SMSG_JOIN_OR_LEAVE_SERVER] = ($byte: ByteArray) => { this.enterServer($byte) };
        obj[Protocols.SMSG_MERGE_SERVER_MSG] = ($byte: ByteArray) => { this.smsgMergeServerMsg($byte) };
        return obj;
    }


} 