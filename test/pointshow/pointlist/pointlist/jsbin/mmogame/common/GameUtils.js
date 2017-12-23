var keyProp = [
    "生命", "攻击", "防御", "命中", "闪避", "暴击", "坚韧", "攻速", "移速", "忽视防御", "忽视闪避", "生命值回复", "伤害加深", "伤害减免", "反弹伤害", "吸血", "回复效率", "暴击率", "抗暴率", "暴击伤害倍数", "降暴伤害倍数", "命中率", "闪避率", "眩晕", "定身", "沉默", "混乱", "魅惑", "控制增强", "控制减免"
];
function getKeyProById($id) {
    return keyProp[$id - 1];
}
var costProp = [
    "元宝", "绑定元宝", "银币", "", "", "", "真气", "兽灵", "宝石精华", "帮贡", "荣誉", "斗魂"
];
//消耗类资源名
function getKeyCostById($id) {
    return costProp[$id];
}
var costItemProp = [
    "", "元宝", "绑定元宝", "银币", "绑定银币", "声望", "家族贡献", "荣誉", "斗魂", "功勋"
];
function getKeyCostItem($id) {
    return costItemProp[$id];
}
var quaColorAry = [ColorType.color2daa35, ColorType.color4392ff, ColorType.colorb759ff, ColorType.colorff7200, ColorType.colorce0a00];
function getColorQua(qua) {
    return this.quaColorAry[qua];
}
function getRoleUrl(name) {
    if (name.search("2242") != -1) {
        console.log("2242224222422242");
    }
    if (name == "0") {
        console.log("没有这个装备");
    }
    return "role/" + name + getBaseUrl() + ".txt";
}
function getRoleUIUrl(name) {
    if (name.search("6013") != -1) {
        console.log("6013");
    }
    if (name == "0") {
        console.log("没有这个装备");
    }
    return "role/ui/" + name + getBaseUrl() + ".txt";
}
function getSkillUrl(name) {
    if (!name || name.length == 0) {
        console.log("没有技能");
    }
    var str = "skill/" + name + getBaseUrl() + ".txt";
    return str.replace(".txt", "_byte.txt");
}
function getModelUrl(name) {
    return "model/" + name + getBaseUrl() + ".txt";
}
function getModelUIUrl(name) {
    return "model/" + name + getBaseUrl() + ".txt";
}
function getMapUrl(name) {
    return "map/" + name + ".txt";
}
function getfactionmapUrl(name) {
    return "ui/load/map/world/" + name + ".png";
}
function getZipMapUrl(name) {
    return "map/" + name + "/";
}
function getactivityIconUrl(name) {
    return "ui/load/activity/at/" + name + ".png";
}
//玩家头像
function getTouPic(gender) {
    return gender == 1 ? "ui/touA.png" : "ui/touB.png";
}
function getVipIconUrl(name) {
    return "ui/load/Vip/" + name + ".png";
}
function getFactionBuildMapUrl(name) {
    return "ui/load/map/factionbuildmap/" + name + ".png";
}
function geteqiconIconUrl(name) {
    return "ui/eqicon/" + name + ".png";
}
function getstrongerIconUrl(name) {
    return "ui/load/stronger/" + name + ".png";
}
function getgemIconUrl(name) {
    return "ui/load/gem/" + name + ".png";
}
function getRoleIconUrl(name) {
    return "ui/load/role/" + name + ".png";
}
function getTeamcopyIconUrl(name) {
    return "ui/load/teamcopy/" + name + ".png";
}
function getSuccesspromptUrl(name) {
    return "ui/load/toptip/txt/" + name + ".png";
}
function getSkillIconUrl(name) {
    return "ui/skillicon/" + name + ".png";
}
function getMountIconUrl(name) {
    return "ui/load/mount/photo/" + name + ".png";
}
function getload_IconUrl(name) {
    return "ui/load/icon/" + name + ".png";
}
function getload_LogingiftUrl(name) {
    return "ui/load/Logingift/Name/" + name + ".png";
}
function getload_LogingiftInfoUrl(name) {
    return "ui/load/Logingift/Info/" + name + ".png";
}
function getUIIconUrl(name) {
    return "ui/uiicon/" + name + ".png";
}
function getQueenIconUrl(id) {
    return Scene_data.fileRoot + "ui/load/queen/" + id + ".jpg";
}
function getUItimeOutUrl(name) {
    return "ui/load/timeOut/" + name + ".png";
}
function getUIpkGradeUrl(name) {
    return "ui/load/pkGrade/" + name + ".png";
}
function getUItittleUrl(name) {
    return "ui/load/tittle/" + name + ".png";
}
function getOutBossUiUrl(name, pre) {
    if (pre) {
        return "ui/tittlename/oboss/t_" + name + ".png";
    }
    else {
        return "ui/tittlename/oboss/" + name + ".png";
    }
}
/**前端战斗力计算 */
function getForceByAtt(att_id, att_val) {
    var num = 0;
    return num;
}
/**标准化数字 */
function Snum($num) {
    if ($num > 999999) {
        return float2int($num / 10000) + "万";
    }
    else if ($num > 999999999) {
        return float2int($num / 100000000) + "亿";
    }
    else {
        return String($num);
    }
}
function converItem2Cost(ary) {
    var m = TableData.getInstance().getData(TableData.tb_item_template, ary[0])["money_type"];
    return [m, ary[1]];
}
/**将道具中的资源类，转换为消耗资源id */
function getresIdByreward($itemid) {
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
function getServerAndName(name) {
    var ary = name.split(",");
    if (ary.length == 3) {
        return ary[1] + ary[2];
    }
    else {
        return name;
    }
}
/**将后台名称 2.1001.张三 解析成 张三 */
function getBaseName(name) {
    var ary = name.split(",");
    if (ary.length == 3) {
        return ary[2];
    }
    else {
        return name;
    }
}
function getAvataByID($id) {
    var $aa = tb.TB_creature_template.get_TB_creature_template($id);
    return $aa.avatar;
}
//# sourceMappingURL=GameUtils.js.map