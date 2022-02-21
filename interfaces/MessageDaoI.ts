import Message from "../models/messages/Message";

/**
 * @file Declares API for Messages related data access object methods
 */

export default interface MessageDaoI {
    sendMessage(sentTo: string, sentFrom: string, message: Message): Promise<Message>;
    deleteMessage(sentTo: string, sentFrom: string): Promise<any>;
    viewMessagesSent(uid: string): Promise<Message[]>;
    viewMessagesReceived(uid: string): Promise<Message[]>;
    viewAllMessages(uid: string): Promise<Message[]>;
    viewMessageByUser(sentTo: string, sentFrom: string): Promise<any>;
}