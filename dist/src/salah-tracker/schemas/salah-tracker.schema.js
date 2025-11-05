"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalahRecordSchema = exports.SalahRecord = exports.PrayerSchema = exports.Prayer = exports.RakatSchema = exports.Rakat = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Rakat = class Rakat {
};
exports.Rakat = Rakat;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], Rakat.prototype, "farz", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Rakat.prototype, "number", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Rakat.prototype, "markAsOffered", void 0);
exports.Rakat = Rakat = __decorate([
    (0, mongoose_1.Schema)()
], Rakat);
exports.RakatSchema = mongoose_1.SchemaFactory.createForClass(Rakat);
let Prayer = class Prayer {
};
exports.Prayer = Prayer;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Prayer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.RakatSchema], required: true }),
    __metadata("design:type", Array)
], Prayer.prototype, "rakats", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Prayer.prototype, "key", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Prayer.prototype, "subtext", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Prayer.prototype, "active", void 0);
exports.Prayer = Prayer = __decorate([
    (0, mongoose_1.Schema)()
], Prayer);
exports.PrayerSchema = mongoose_1.SchemaFactory.createForClass(Prayer);
let SalahRecord = class SalahRecord extends mongoose_2.Document {
};
exports.SalahRecord = SalahRecord;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalahRecord.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.PrayerSchema], required: true }),
    __metadata("design:type", Array)
], SalahRecord.prototype, "prayers", void 0);
exports.SalahRecord = SalahRecord = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SalahRecord);
exports.SalahRecordSchema = mongoose_1.SchemaFactory.createForClass(SalahRecord);
exports.SalahRecordSchema.index({
    date: 1,
}, { unique: true });
//# sourceMappingURL=salah-tracker.schema.js.map