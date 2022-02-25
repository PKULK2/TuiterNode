/**
 * @file Declares Like data type representing relationship between
 * users and messages, as in user sends a tuit
 */
import User from "../users/User";

/**
 * @typedef Message Represents message relationship between a user and a message,
 * as in a user sends a tuit
 * @property {string} message the message users want to send
 * @property {User} sentTo receiver of the message
 * @property {User} sentFrom sender of the message
 * @property {Date} sentOn date when message was sent
 */
export default interface Message {
    message: string,
    sentTo: User,
    sentFrom: User,
    sentOn: Date
};