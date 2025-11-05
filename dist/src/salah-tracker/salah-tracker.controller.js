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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalahTrackerController = void 0;
const common_1 = require("@nestjs/common");
const salah_tracker_service_1 = require("./salah-tracker.service");
const create_salah_tracker_dto_1 = require("./dto/create-salah-tracker.dto");
const update_salah_tracker_dto_1 = require("./dto/update-salah-tracker.dto");
let SalahTrackerController = class SalahTrackerController {
    constructor(salahTrackerService) {
        this.salahTrackerService = salahTrackerService;
    }
    async create(createSalahTrackerDto) {
        return await this.salahTrackerService.create(createSalahTrackerDto);
    }
    async findAll() {
        return await this.salahTrackerService.findAll();
    }
    async findBymonth(month) {
        return await this.salahTrackerService.findByMonth(month);
    }
    async findByDate(date) {
        return await this.salahTrackerService.findByDate(date);
    }
    async findOne(id) {
        return await this.salahTrackerService.findOne(id);
    }
    async update(id, updateSalahTrackerDto) {
        return await this.salahTrackerService.update(id, updateSalahTrackerDto);
    }
    async remove(id) {
        return await this.salahTrackerService.remove(id);
    }
};
exports.SalahTrackerController = SalahTrackerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_salah_tracker_dto_1.CreateSalahTrackerDto]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('month'),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "findBymonth", null);
__decorate([
    (0, common_1.Get)('date/:date'),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_salah_tracker_dto_1.UpdateSalahTrackerDto]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalahTrackerController.prototype, "remove", null);
exports.SalahTrackerController = SalahTrackerController = __decorate([
    (0, common_1.Controller)('salah-tracker'),
    __metadata("design:paramtypes", [salah_tracker_service_1.SalahTrackerService])
], SalahTrackerController);
//# sourceMappingURL=salah-tracker.controller.js.map