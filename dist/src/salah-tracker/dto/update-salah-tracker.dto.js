"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSalahTrackerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_salah_tracker_dto_1 = require("./create-salah-tracker.dto");
class UpdateSalahTrackerDto extends (0, mapped_types_1.PartialType)(create_salah_tracker_dto_1.CreateSalahTrackerDto) {
}
exports.UpdateSalahTrackerDto = UpdateSalahTrackerDto;
//# sourceMappingURL=update-salah-tracker.dto.js.map