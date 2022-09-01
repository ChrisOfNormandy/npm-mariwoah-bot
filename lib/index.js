"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Output = exports.MessageData = exports.CommandGroup = exports.Command = exports.Bot = exports.handlers = exports.groups = exports.DiscordVoice = exports.Discord = void 0;
const Discord = __importStar(require("discord.js"));
exports.Discord = Discord;
const DiscordVoice = __importStar(require("@discordjs/voice"));
exports.DiscordVoice = DiscordVoice;
const groups = __importStar(require("./app/groups"));
exports.groups = groups;
const handlers = __importStar(require("./app/handlers"));
exports.handlers = handlers;
const objects_1 = require("./app/objects");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return objects_1.Bot; } });
Object.defineProperty(exports, "Command", { enumerable: true, get: function () { return objects_1.Command; } });
Object.defineProperty(exports, "CommandGroup", { enumerable: true, get: function () { return objects_1.CommandGroup; } });
Object.defineProperty(exports, "MessageData", { enumerable: true, get: function () { return objects_1.MessageData; } });
Object.defineProperty(exports, "Output", { enumerable: true, get: function () { return objects_1.Output; } });
