/**
 * @file Controller RESTful Web service API for follow resource
 */
import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";

export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance()
    private static messageController: MessageController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MessageController
     */

    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.post("/api/messages/:uid/send/:fid", MessageController.messageController.sendMessage);
            app.delete("/api/messages/:uid/delete/:fid", MessageController.messageController.deleteMessage);
            app.get("/api/messages/sent/:uid", MessageController.messageController.viewMessagesSent);
            app.get("/api/messages/:uid/received", MessageController.messageController.viewMessagesReceived);
            app.get("/api/messages", MessageController.messageController.viewAllMessages);
            app.get("/api/messages/:uid/:fid", MessageController.messageController.viewMessageByUser);
        }
        return MessageController.messageController;
    }

    deleteMessage = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessage(req.params.uid, req.params.fid)
            .then((remove) => res.json(remove));

    sendMessage = (req: Request, res: Response) =>
        MessageController.messageDao.sendMessage(req.params.uid, req.params.fid, req.body.message)
            .then((send) => res.json(send));

    viewAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.viewAllMessages()
            .then((message) => res.json(message));

    viewMessageByUser = (req: Request, res: Response) =>
        MessageController.messageDao.viewMessageByUser(req.params.uid, req.params.fid)
            .then((user) => res.json(user));

    viewMessagesReceived = (req: Request, res: Response) =>
        MessageController.messageDao.viewMessagesReceived(req.params.uid)
            .then((received) => res.json(received));

    viewMessagesSent = (req: Request, res: Response) =>
        MessageController.messageDao.viewMessagesReceived(req.params.uid)
            .then((sent) => res.json(sent));
}