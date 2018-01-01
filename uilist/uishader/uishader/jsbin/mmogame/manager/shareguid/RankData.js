var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RankData = (function (_super) {
    __extends(RankData, _super);
    function RankData() {
        _super.apply(this, arguments);
    }
    RankData.prototype.getRankGuid = function () {
        return this.GetStr(SharedDef.RANK_LIST_CURRENT_OBJ_STR_FIELD_PLAYER_GUID);
    };
    RankData.prototype.getRankName = function () {
        return this.GetStr(SharedDef.RANK_LIST_CURRENT_OBJ_STR_FIELD_PLAYER_NAME);
    };
    RankData.prototype.getRankFaction = function () {
        return this.GetStr(SharedDef.RANK_LIST_CURRENT_OBJ_STR_FIELD_FACTION_NAME);
    };
    RankData.prototype.getRankPower = function () {
        return this.GetDouble(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_FORCE);
    };
    RankData.prototype.getRankCoat = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_SHOW);
    };
    RankData.prototype.getRankWeapon = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_SHOW + 1);
    };
    RankData.prototype.getRankVip = function () {
        return this.GetByte(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE, 2);
    };
    RankData.prototype.getRankGender = function () {
        return this.GetByte(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE, 0);
    };
    RankData.prototype.getLevel = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_LEVEL);
    };
    RankData.prototype.getMoney = function () {
        return this.GetDouble(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_MONEY);
    };
    RankData.prototype.getDivineNum = function () {
        return this.GetByte(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE, 2);
    };
    RankData.prototype.getFactionActive = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE2);
    };
    RankData.prototype.getFactionIcon = function () {
        return this.GetUInt16(SharedDef.RANK_LIST_INT_FIELD_FACTION_BYTE, 0);
    };
    RankData.prototype.getRank = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_RANKING);
    };
    RankData.prototype.getTitle = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_TITLE);
    };
    RankData.prototype.getMountLev = function () {
        return this.GetByte(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE2, 0);
    };
    RankData.prototype.getMountStart = function () {
        return this.GetByte(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_BYTE2, 1);
    };
    RankData.prototype.getLike = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_LIKE);
    };
    RankData.prototype.getWingId = function () {
        return this.GetUInt32(SharedDef.RANK_LIST_CURRENT_OBJ_INT_FIELD_WING);
    };
    return RankData;
})(GuidObject);
//# sourceMappingURL=RankData.js.map