/**
 * @file Implements DAO managing data storage of messages. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import Message from "../models/messages/Message";
import MessageModel from "../mongoose/messages/MessageModel";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of bookmarks
 * @property {MessageDao} messageDao Private single instance of BookmarkDao
 */
export default class MessageDao implements MessageDaoI {
    public static messageDao: MessageDao | null = null
    /**
     * Creates singleton DAO instance
     * @returns MessageDao
     */
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }
    private constructor() {}

    /**
     * Uses MessageModel to retrieve all the messages from message collection
     * @returns Promise To be notified when the messages are retrieved from the database
     */
    viewAllMessages = async (): Promise<Message[]> =>
        MessageModel.find().exec();

    /**
     * Creates a delete instance in the database
     * @param {string} sentFrom senders primary key
     * @param {string} sentTo receivers primary key
     * @returns Promise To be notified when messages is deleted in
     * the database
     */
    deleteMessage = async (sentTo: string, sentFrom: string): Promise<any> =>
        MessageModel.deleteOne({sentTo: sentTo, sentFrom: sentFrom});

    /**
     * Creates a send instance in the database
     * @param {string} sentFrom senders primary key
     * @param {string} sentTo receivers primary key
     * @param {string} message the message to be sent
     * @returns Promise To be notified when messages is sent in
     * the database
     */
    sendMessage = async (sentTo: string, sentFrom: string, message: Message): Promise<Message> =>
        MessageModel.create({sentTo: sentTo, sentFrom: sentFrom, message: message});

    /**
     * Creates a update instance in the database
     * @param {string} sentFrom senders primary key
     * @param {string} sentTo receivers primary key
     * @param {string} message the updated message
     * @returns Promise To be notified when messages is updated in
     * the database
     */
    updateMessage = async (sentTo: string, sentFrom: string, message: Message): Promise<any> =>
        MessageModel.updateOne({sentTo: sentTo, sentFrom: sentFrom}, {$set: {message: message}});

    /**
     * Uses MessageModel to retrieve all the messages received
     * @param {string} uid user's primary key
     * @returns Promise To be notified when messages are retrieved
     * from the database
     */
    viewMessagesReceived = async (uid: string): Promise<Message[]> =>
        MessageModel.find({sentTo: uid})
            .populate("sentFrom")
            .exec();

    /**
     * Uses MessageModel to retrieve all the messages sent
     * @param {string} uid user's primary key
     * @returns Promise To be notified when messages are retrieved
     * from the database
     */
    viewMessagesSent = async (uid: string): Promise<Message[]> =>
        MessageModel.find({sentFrom: uid})
            .populate("sentTo")
            .exec();
}