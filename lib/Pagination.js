"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
/**
 * Main Pagination file
 *
 * @module Pagination
 */
const discord_js_1 = require("discord.js");
/** Pagination class */
class Pagination {
    constructor(client, options) {
        /**
         * Pagination Options
         * @type {PaginationOptions}
         * @private
         */
        this.options = {
            buttons: {
                back: {
                    label: "Back",
                    style: "SUCCESS",
                },
                next: {
                    label: "Next",
                    style: "PRIMARY",
                },
                page: "Page {{page}} / {{total_pages}}",
            },
            timeout: 30000, //30 seconds
        };
        this.client = client;
        if (options && options.buttons)
            options.buttons = Object.assign(this.options.buttons, options.buttons);
        this.options = Object.assign(this.options, options);
        this.page = 0;
        this._key = this._generateString(5);
    }
    /**
     * Generate random string
     * https://stackoverflow.com/a/1349426
     * @private
     */
    _generateString(length) {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     * Get page label
     * @private
     */
    _getPageLabel() {
        const label = this.options.buttons.page
            .replace("{{page}}", `${this.page + 1}`)
            .replace("{{total_pages}}", `${this.pages.length}`);
        return label;
    }
    /**
     * Set Array of pages to paginate
     * @param array - Those pages
     * @return {boolen}
     */
    setPages(array) {
        this.pages = array;
        return true;
    }
    /**
     * Set an array of user IDs who can switch pages
     * @param users - A array of user IDs
     * @return {boolen}
     */
    setAuthorizedUsers(users) {
        this.authorizedUsers = users;
        return true;
    }
    /**
     * Send the embed
     * @param channel - If you want to send it to a channel instead of repling to interaction, give the channel here
     * @param interaction - If you are not providing channel, set channel to false and provide a command interaction here
     * @return {boolen}
     */
    send(channel, i) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pages)
                throw new Error("Pages not set");
            if (!this.authorizedUsers)
                throw new Error("Authorized Users not set");
            if (!channel && !(i && ((_a = i === null || i === void 0 ? void 0 : i.isCommand) === null || _a === void 0 ? void 0 : _a.call(i)))) {
                throw new Error("You should either provide channel or command interaction, set channel to false if you are providing interaction");
            }
            if (i && !i.deferred && !i.replied)
                yield i.deferReply();
            const { buttons } = this.options;
            this._actionRow = new discord_js_1.MessageActionRow();
            const backButton = new discord_js_1.MessageButton()
                .setLabel(`${buttons.back.label}`)
                .setStyle(buttons.back.style)
                .setCustomId(`back-${this._key}`);
            if (buttons.back.emoji !== "")
                backButton.setEmoji(buttons.back.emoji);
            const pageButton = new discord_js_1.MessageButton()
                .setLabel(this._getPageLabel())
                .setStyle("SECONDARY")
                .setCustomId(`page-${this._key}`)
                .setDisabled(true);
            const nextButton = new discord_js_1.MessageButton()
                .setLabel(`${buttons.next.label}`)
                .setStyle(buttons.next.style)
                .setCustomId(`next-${this._key}`);
            if (buttons.next.emoji)
                nextButton.setEmoji(buttons.next.emoji);
            this._actionRow.addComponents(backButton, pageButton, nextButton);
            let msg;
            if (channel) {
                msg = yield channel.send({
                    embeds: [this.pages[this.page]],
                    components: [this._actionRow],
                });
            }
            else if (i) {
                msg = yield i.followUp({
                    embeds: [this.pages[this.page]],
                    components: [this._actionRow],
                });
            }
            else {
                return false;
            }
            msg = msg;
            const ids = [`next-${this._key}`, `back-${this._key}`];
            const filter = ((i) => ids.includes(i.customId) &&
                this.authorizedUsers.includes(i.user.id)).bind(this);
            const collector = msg.createMessageComponentCollector({
                filter,
                componentType: "BUTTON",
                time: this.options.timeout,
            });
            collector.on("collect", (interaction) => {
                if (interaction == undefined)
                    return;
                const handlePage = (() => {
                    if (this._actionRow.components[1] instanceof discord_js_1.MessageButton)
                        this._actionRow.components[1].setLabel(this._getPageLabel());
                }).bind(this); //Update page label
                switch (interaction.customId) {
                    case `next-${this._key}`:
                        this.page =
                            this.page + 1 < this.pages.length ? ++this.page : 0;
                        handlePage();
                        interaction
                            .update({
                            embeds: [this.pages[this.page]],
                            components: [this._actionRow],
                        })
                            .catch(() => true);
                        break;
                    case `back-${this._key}`:
                        this.page =
                            this.page > 0 ? --this.page : this.pages.length - 1;
                        handlePage();
                        interaction
                            .update({
                            embeds: [this.pages[this.page]],
                            components: [this._actionRow],
                        })
                            .catch(() => true);
                        break;
                }
            });
            collector.on("end", (collected) => __awaiter(this, void 0, void 0, function* () {
                const interaction = collected.last();
                for (let i = 0; i < this._actionRow.components.length; i++) {
                    this._actionRow.components[i].setDisabled(true);
                }
                if (interaction == undefined)
                    return;
                yield interaction
                    .update({
                    embeds: [this.pages[this.page]],
                    components: [this._actionRow],
                })
                    .catch(() => true);
            }));
            return true;
        });
    }
}
exports.Pagination = Pagination;
