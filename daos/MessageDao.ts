import MessageDaoI from "../interfaces/MessageDaoI";
import Message from "../models/messages/Message";
import MessageModel from "../mongoose/messages/MessageModel";

export default class MessageDao implements MessageDaoI {
    public static messageDao: MessageDao | null = null
    public static getInstance = (): MessageDao => {
        if (MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }
    private constructor() {}

    viewAllMessages = async (): Promise<Message[]> =>
        MessageModel.find()
            .exec();

    deleteMessage = async (sentTo: string, sentFrom: string): Promise<any> =>
        MessageModel.deleteOne({sentTo: sentTo, SentFrom: sentFrom});

    sendMessage = async (sentTo: string, sentFrom: string, message: Message): Promise<Message> =>
        MessageModel.create({sentTo: sentTo, SentFrom: sentFrom, message: message});

    viewMessageByUser = async (sentTo: string, sentFrom: string): Promise<any> =>
        MessageModel.findOne({sentTo: sentTo, SentFrom: sentFrom});

    viewMessagesReceived = async (uid: string): Promise<Message[]> =>
        MessageModel.find({sentFrom: uid})
            .populate("sentTo")
            .exec();

    viewMessagesSent = async (uid: string): Promise<Message[]> =>
        MessageModel.find({sentTo: uid})
            .populate("sentFrom")
            .exec();
}