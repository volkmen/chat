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
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Chat_entity_1 = require("./Chat.entity");
const Message_entity_1 = require("./Message.entity");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false, unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "email_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Message_entity_1.MessageEntity, msg => msg.owner),
    __metadata("design:type", Array)
], UserEntity.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Chat_entity_1.ChatEntity),
    (0, typeorm_1.JoinTable)({
        name: 'UsersChats'
    }),
    __metadata("design:type", Array)
], UserEntity.prototype, "chats", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'Users' })
], UserEntity);
