"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalahTrackerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const salah_tracker_service_1 = require("./salah-tracker.service");
const salah_tracker_controller_1 = require("./salah-tracker.controller");
const salah_tracker_schema_1 = require("./schemas/salah-tracker.schema");
let SalahTrackerModule = class SalahTrackerModule {
};
exports.SalahTrackerModule = SalahTrackerModule;
exports.SalahTrackerModule = SalahTrackerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: salah_tracker_schema_1.SalahRecord.name, schema: salah_tracker_schema_1.SalahRecordSchema },
            ]),
        ],
        controllers: [salah_tracker_controller_1.SalahTrackerController],
        providers: [salah_tracker_service_1.SalahTrackerService],
    })
], SalahTrackerModule);
//# sourceMappingURL=salah-tracker.module.js.map