/**
 * @file Controller RESTful Web service API for message resource
 */
import {Express, Request, Response} from "express";
import MessageControllerI from "../interfaces/MessageControllerI";
import MessageDao from "../daos/MessageDao";

/**
 * @class MessageController Implements RESTful Web service API for bookmark resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/messages/:uid/send/:fid to send a message to a user
 *     </li>
 *     <li>DELETE /api/messages/:uid/delete/:fid to delete a message sent to a user
 *     </li>
 *     <li>GET /api/messages/:uid/sent to retrieve all sent messages
 *     </li>
 *     <li>GET /api/messages/:uid/received to retrieve all messages received
 *     </li>
 *     <li>GET /api/messages to retrieve all messages from the database
 *     </li>
 *     <li> PUT /api/messages/:uid/update/:fid to update a message sent to an user
 *     </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing message CRUD operations
 * @property {MessageController} messageController Singleton controller implementing
 * RESTful Web service API
 */
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
            app.get("/api/messages/:uid/sent", MessageController.messageController.viewMessagesSent);
            app.get("/api/messages/:uid/received", MessageController.messageController.viewMessagesReceived);
            app.get("/api/messages", MessageController.messageController.viewAllMessages);
            app.put("/api/messages/:uid/update/:fid", MessageController.messageController.updateMessage);
        }
        return MessageController.messageController;
    }

    /**
     * Delete a message sent to an user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and fid representing the current user who
     * is sent the message and user who received the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing confirmation of the delete operation
     */
    deleteMessage = (req: Request, res: Response) =>
        MessageController.messageDao.deleteMessage(req.params.uid, req.params.fid)
            .then((remove) => res.json(remove));

    /**
     * Send a message to an user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and fid representing the current user who
     * is sending the message and user who is receiving the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the message sent to the user
     */
    sendMessage = (req: Request, res: Response) =>
        MessageController.messageDao.sendMessage(req.params.uid, req.params.fid, req.body.message)
            .then((send) => res.json(send));

    /**
     * Retrieves all the messages from the database.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the messages
     */
    viewAllMessages = (req: Request, res: Response) =>
        MessageController.messageDao.viewAllMessages()
            .then((message) => res.json(message));

    /**
     * Update a message sent to an user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and fid representing the current user who
     * is sent the message and user who received the message
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the updated message sent to the user
     */
    updateMessage = (req: Request, res: Response) =>
        MessageController.messageDao.updateMessage(req.params.uid, req.params.fid, req.body.message)
            .then((update) => res.json(update));

    /**
     * Retrieve all the messages received by a given user
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user whose messages will be returned
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the received messages
     */
    viewMessagesReceived = (req: Request, res: Response) =>
        MessageController.messageDao.viewMessagesReceived(req.params.uid)
            .then((received) => res.json(received));

    /**
     * Retrieve all the messages sent by a given user
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user whose messages will be returned
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the received messages
     */
    viewMessagesSent = (req: Request, res: Response) =>
        MessageController.messageDao.viewMessagesSent(req.params.uid)
            .then((sent) => res.json(sent));
}

