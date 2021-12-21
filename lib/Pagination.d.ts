/**
 * Main Pagination file
 *
 * @module Pagination
 */
import { Client, MessageEmbed, TextChannel, CommandInteraction, Snowflake } from "discord.js";
import { PaginationOptions } from "./types";
/** Pagination class */
declare class Pagination {
    /**
     * The discord.js Client
     * @type {Client}
     */
    readonly client: Client;
    /**
     * Pagination Options
     * @type {PaginationOptions}
     * @private
     */
    private options;
    /**
     * Unique key for those buttons
     * @type {string}
     * @private
     */
    private _key;
    /**
     * The page number
     * @type {number}
     */
    page: number;
    /**
     * The the action row which will contain the buttons
     * @type {MessageActionRow}
     * @private
     */
    private _actionRow;
    /**
     * The same _actionRow but with all buttons disabled
     */
    private _actionRowEnd;
    /**
     * Pages
     * @type {Array<MessageEmbed>}
     */
    pages: Array<MessageEmbed>;
    /**
     * Authorized Users
     * @type {Array<Snowflake>}
     */
    authorizedUsers: Array<Snowflake>;
    constructor(client: Client, options: PaginationOptions);
    /**
     * Generate random string
     * https://stackoverflow.com/a/1349426
     * @private
     */
    private _generateString;
    /**
     * Get page label
     * @private
     */
    private _getPageLabel;
    /**
     * Set Array of pages to paginate
     * @param array - Those pages
     * @return {boolen}
     */
    setPages(array: Array<MessageEmbed>): boolean;
    /**
     * Set an array of user IDs who can switch pages
     * @param users - A array of user IDs
     * @return {boolen}
     */
    setAuthorizedUsers(users: Array<Snowflake>): boolean;
    /**
     * Send the embed
     * @param channel - If you want to send it to a channel instead of repling to interaction, give the channel here
     * @param interaction - If you are not providing channel, set channel to false and provide a command interaction here
     * @return {boolen}
     */
    send(channel: TextChannel, i: CommandInteraction): Promise<boolean>;
}
export { Pagination };
