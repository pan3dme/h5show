

var keyProp: Array<string> = [
    "生命", "攻击", "防御", "命中", "闪避", "暴击", "坚韧", "攻速", "移速", "忽视防御", "忽视闪避", "生命值回复", "伤害加深", "伤害减免", "反弹伤害", "吸血", "回复效率", "暴击率", "抗暴率", "暴击伤害倍数", "降暴伤害倍数", "命中率", "闪避率", "眩晕", "定身", "沉默", "混乱", "魅惑", "控制增强", "控制减免"
];
function getKeyProById($id: number): string {
    return keyProp[$id - 1];
}
var costProp: Array<string> = [
    "元宝", "绑定元宝", "银币", "", "", "", "真气", "兽灵", "宝石精华", "帮贡", "荣誉", "斗魂"
];
//消耗类资源名
function getKeyCostById($id: number): string {
    return costProp[$id];
}
var costItemProp: Array<string> = [
    "", "元宝", "绑定元宝", "银币", "绑定银币", "声望", "家族贡献", "荣誉", "斗魂", "功勋"
];
function getKeyCostItem($id: number): string {
    return costItemProp[$id];
}

var quaColorAry: Array<string> = [ColorType.color2daa35, ColorType.color4392ff, ColorType.colorb759ff, ColorType.colorff7200, ColorType.colorce0a00];
function getColorQua(qua: number): string {
    return this.quaColorAry[qua]
}



function getRoleUrl(name: string): string {
    if (name.search("2242") != -1) {
        console.log("2242224222422242")
    }
    if (name == "0") {
        console.log("没有这个装备")
    }
    return "role/" + name + getBaseUrl() + ".txt";
}

function getRoleUIUrl(name: string): string {
    if (name.search("6013") != -1) {
        console.log("6013")
    }
    if (name == "0") {
        console.log("没有这个装备")
    }
    return "role/ui/" + name + getBaseUrl() + ".txt";
}


function getSkillUrl(name: string): string {
    if (!name || name.length == 0) {
        console.log("没有技能")
    }
    var str: string = "skill/" + name + getBaseUrl() + ".txt";
    return str.replace(".txt", "_byte.txt")
}

function getModelUrl(name: string): string {
    return "model/" + name + getBaseUrl() + ".txt";
}

function getModelUIUrl(name: string): string {
    return "model/" + name + getBaseUrl() + ".txt";
}
function getMapUrl(name: string): string {
    return "map/" + name + ".txt";
}

function getfactionmapUrl(name: number): string {
    return "ui/load/map/world/" + name + ".png";
}
function getZipMapUrl(name: string): string {
    return "map/" + name + "/";
}
function getactivityIconUrl(name: string): string {
    return "ui/load/activity/at/" + name + ".png";
}
//玩家头像
function getTouPic(gender: number): string {
    return gender == 1 ? "ui/touA.png" : "ui/touB.png";
}

function getVipIconUrl(name: number): string {
    return "ui/load/Vip/" + name + ".png";
}

function getFactionBuildMapUrl(name: number): string {
    return "ui/load/map/factionbuildmap/" + name + ".png";
}

function geteqiconIconUrl(name: string): string {
    return "ui/eqicon/" + name + ".png";
}

function getstrongerIconUrl(name: string): string {
    return "ui/load/stronger/" + name + ".png";
}

function getgemIconUrl(name: number): string {
    return "ui/load/gem/" + name + ".png";
}

function getRoleIconUrl(name: string): string {
    return "ui/load/role/" + name + ".png";
}

function getTeamcopyIconUrl(name: string): string {
    return "ui/load/teamcopy/" + name + ".png";
}
function getSuccesspromptUrl(name: string): string {
    return "ui/load/toptip/txt/" + name + ".png";
}
function getSkillIconUrl(name: string): string {
    return "ui/skillicon/" + name + ".png";
}
function getMountIconUrl(name: string): string {
    return "ui/load/mount/photo/" + name + ".png";
}
function getload_IconUrl(name: string): string {
    return "ui/load/icon/" + name + ".png";
}
function getload_LogingiftUrl(name: string): string {
    return "ui/load/Logingift/Name/" + name + ".png";
}
function getload_LogingiftInfoUrl(name: string): string {
    return "ui/load/Logingift/Info/" + name + ".png";
}
function getUIIconUrl(name: string): string {
    return "ui/uiicon/" + name + ".png";
}
function getQueenIconUrl(id: number): string {
    return Scene_data.fileRoot + "ui/load/queen/" + id + ".jpg";
}

function getUItimeOutUrl(name: string): string {
    return "ui/load/timeOut/" + name + ".png"
}
function getUIpkGradeUrl(name: string): string {
    return "ui/load/pkGrade/" + name + ".png"
}
function getUItittleUrl(name: string): string {

    return "ui/load/tittle/" + name + ".png";
}
function getOutBossUiUrl(name: string, pre: boolean): string {
    if (pre) {
        return "ui/tittlename/oboss/t_" + name + ".png";
    } else {
        return "ui/tittlename/oboss/" + name + ".png";
    }

}
/**前端战斗力计算 */
function getForceByAtt(att_id: Array<number>, att_val: Array<number>): number {
    var num: number = 0;

    return num;
}

/**标准化数字 */
function Snum($num: number): string {
    if ($num > 999999) {
        return float2int($num / 10000) + "万";
    } else if ($num > 999999999) {
        return float2int($num / 100000000) + "亿";
    } else {
        return String($num);
    }
}

function converItem2Cost(ary: Array<number>): Array<number> {
    var m: number = TableData.getInstance().getData(TableData.tb_item_template, ary[0])["money_type"];
    return [m, ary[1]];
}
/**将道具中的资源类，转换为消耗资源id */
function getresIdByreward($itemid: number): number {
    switch ($itemid) {
        case 1:
            //元宝
            return 0;
        case 3:
            //身上的银子
            return 2;
        case 11:
            //荣誉
            return 10;
        case 10:
            //帮贡
            return 9;
        case 7:
            //真气
            return 6;
        case 8:
            //兽灵
            return 12;
        case 9:
            //宝石精华
            return 8;
        case 12:
            //斗魂
            return 11;
    }
}

/**将后台名称 2.1001.张三 解析成 1001.张三  跨服使用 */
function getServerAndName(name: string): string {
    var ary: Array<string> = name.split(",");
    if (ary.length == 3) {
        return ary[1] + ary[2];
    } else {
        return name;
    }

}



/**将后台名称 2.1001.张三 解析成 张三 */
function getBaseName(name: string): string {
    var ary: Array<string> = name.split(",");
    if (ary.length == 3) {
        return ary[2];
    } else {
        return name;
    }

}

function getAvataByID($id): number {
    var $aa: tb.TB_creature_template = tb.TB_creature_template.get_TB_creature_template($id)
    return $aa.avatar
}

