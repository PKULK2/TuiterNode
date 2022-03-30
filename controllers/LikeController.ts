/**
 * @file Controller RESTful Web service API for likes resource
 */
import {Express, Request, Response} from "express";
import LikeDao from "../daos/LikeDao";
import LikeControllerI from "../interfaces/LikeControllerI";
import TuitDao from "../daos/TuitDao";
import DislikeDao from "../daos/DislikeDao";

/**
 * @class TuitController Implements RESTful Web service API for likes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/likes to retrieve all the tuits liked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/likes to retrieve all users that liked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/likes/:tid to record that a user likes a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/unlikes/:tid to record that a user
 *     no londer likes a tuit</li>
 * </ul>
 * @property {LikeDao} likeDao Singleton DAO implementing likes CRUD operations
 * @property {LikeController} LikeController Singleton controller implementing
 * RESTful Web service API
 */

export default class LikeController implements LikeControllerI {
    app: Express;
    likeDao: LikeDao;
    tuitDao: TuitDao;
    dislikeDao: DislikeDao;
    constructor(app: Express, likeDao: LikeDao, tuitDao: TuitDao, dislikeDao: DislikeDao) {
        this.app = app;
        this.likeDao = likeDao;
        this.tuitDao = tuitDao;
        this.dislikeDao = dislikeDao;

        this.app.get("/api/users/:uid/likes", this.findAllTuitsLikedByUser);
        this.app.get("/api/users/:uid/dislikes", this.findAllTuitsDislikedByUser);
        this.app.get("/api/tuits/:tid/likes", this.findAllUsersThatLikedTuit);
        this.app.post("/api/users/:uid/likes/:tid", this.userLikesTuit);
        this.app.delete("/api/users/:uid/unlikes/:tid", this.userUnlikesTuit);
        this.app.put("/api/users/:uid/likes/:tid", this.userTogglesTuitLikes);
        this.app.put("/api/users/:uid/unlikes/:tid", this.userTogglesTuitDisLikes);
        this.app.post("/api/users/:uid/find-like/:tid", this.findUserLikesTuit);
        this.app.post("/api/users/:uid/find-dislike/:tid", this.findUserDisLikesTuit);
    }

    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        this.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));

    findAllTuitsLikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "my" && profile ?
            profile._id : uid;

        this.likeDao.findAllTuitsLikedByUser(userId)
            .then(likes => {
                const likesNonNullTuits = likes.filter(like => like.tuit);
                const tuitsFromLikes = likesNonNullTuits.map(like => like.tuit);
                res.json(tuitsFromLikes);
            });
    }
    findAllTuitsDislikedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "my" && profile ?
            profile._id : uid;

        this.dislikeDao.findAllTuitsDislikedByUser(userId)
            .then(dislikes => {
                const dislikesNonNullTuits = dislikes.filter(dislike => dislike.tuit);
                const tuitsFromDislikes = dislikesNonNullTuits.map(dislike => dislike.tuit);
                res.json(tuitsFromDislikes);
            });
    }
    userLikesTuit = (req: Request, res: Response) =>
        this.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then(likes => res.json(likes));
    userUnlikesTuit = (req: Request, res: Response) =>
        this.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));
    findUserLikesTuit = (req: Request, res: Response) =>
        this.likeDao.findUserLikesTuit(req.params.uid, req.params.tid)
            .then(like => res.json(like));
    findUserDisLikesTuit = (req: Request, res: Response) =>
        this.dislikeDao.findUserDisLikesTuit(req.params.uid, req.params.tid)
            .then(like => res.json(like));

    userTogglesTuitLikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await this.likeDao
                .findUserLikesTuit(userId, tid);
            const userAlreadyDisLikedTuit = await this.dislikeDao
                .findUserDisLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            const howManyDisLikedTuit = await this.dislikeDao
                .countHowManyUnLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (!userAlreadyLikedTuit && !userAlreadyDisLikedTuit) {
                await this.likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else if (userAlreadyLikedTuit && !userAlreadyDisLikedTuit){
                await this.likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
                tuit.stats.likeByFlag = false;
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid)
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else if(!userAlreadyLikedTuit && userAlreadyDisLikedTuit){
                await this.dislikeDao.DeleteUserDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit - 1;
                tuit.stats.dislikeByFlag = false;
                await this.likeDao.userLikesTuit(userId, tid)
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else {
                tuit.stats.dislikes = howManyDisLikedTuit;
                tuit.stats.likes = howManyLikedTuit;
            }
            await this.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    userTogglesTuitDisLikes = async (req: any, res: any) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await this.likeDao
                .findUserLikesTuit(userId, tid);
            const userAlreadyDisLikedTuit = await this.dislikeDao
                .findUserDisLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            const howManyDisLikedTuit = await this.dislikeDao
                .countHowManyUnLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (!userAlreadyLikedTuit && !userAlreadyDisLikedTuit) {
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else if (!userAlreadyLikedTuit && userAlreadyDisLikedTuit){
                await this.dislikeDao.DeleteUserDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit - 1;
                tuit.stats.dislikeByFlag = false;
                await this.likeDao.userLikesTuit(userId, tid)
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else if(userAlreadyLikedTuit && !userAlreadyDisLikedTuit){
                await this.likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
                tuit.stats.likeByFlag = false;
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid)
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else {
                tuit.stats.dislikes = howManyDisLikedTuit;
                tuit.stats.likes = howManyLikedTuit;
            }
            await this.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }


};







/*export default class LikeController implements LikeControllerI {
    private static likeDao: LikeDao = LikeDao.getInstance();
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static likeController: LikeController | null = null;
    /!**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     *!/
    public static getInstance = (app: Express): LikeController => {
        if(LikeController.likeController === null) {
            LikeController.likeController = new LikeController();
            app.get("/api/users/:uid/likes", LikeController.likeController.findAllTuitsLikedByUser);
            app.get("/api/tuits/:tid/likes", LikeController.likeController.findAllUsersThatLikedTuit);
            app.put("/api/users/:uid/likes/:tid", LikeController.likeController.userTogglesTuitLikes);
            app.post("/api/users/:uid/likes/:tid", LikeController.likeController.userLikesTuit);
            app.delete("/api/users/:uid/unlikes/:tid", LikeController.likeController.userUnlikesTuit);
        }
        return LikeController.likeController;
    }

    private constructor() {}

    /!**
     * Retrieves all users that liked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the liked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the user objects
     *!/
    findAllUsersThatLikedTuit = (req: Request, res: Response) =>
        LikeController.likeDao.findAllUsersThatLikedTuit(req.params.tid)
            .then(likes => res.json(likes));

    /!**
     * Retrieves all tuits liked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user liked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were liked
     *!/
    findAllTuitsLikedByUser = (req: Request, res: Response) =>
        LikeController.likeDao.findAllTuitsLikedByUser(req.params.uid)
            .then(likes => res.json(likes));

    /!**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is liking the tuit
     * and the tuit being liked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new likes that was inserted in the
     * database
     *!/
    userLikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userLikesTuit(req.params.uid, req.params.tid)
            .then(likes => res.json(likes));

    /!**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unliking
     * the tuit and the tuit being unliked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the like was successful or not
     *!/
    userUnlikesTuit = (req: Request, res: Response) =>
        LikeController.likeDao.userUnlikesTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    userTogglesTuitLikes = async (req: Request, res: Response) => {
        const dislikeDao = LikeController.dislikeDao;
        const likeDao = LikeController.likeDao;
        const tuitDao = LikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        // if logged in, get ID from profile, otherwise use parameter
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            // check if user already has liked tuit
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const likeNumber = await likeDao.countHowManyLikedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyLikedTuit) {
                // user unlikes tuit
                await likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = likeNumber - 1;
            } else {
                // user likes tuit
                await LikeController.likeDao.userLikesTuit(userId, tid);
                tuit.stats.likes = likeNumber + 1;

                const userAlreadyDislikedTuit = await dislikeDao.findUserDislikesTuit(userId, tid);
                const dislikeNumber = await dislikeDao.countHowManyDislikedTuit(tid);
                if(userAlreadyDislikedTuit){
                    await dislikeDao.userUndislikesTuit(userId, tid);
                    tuit.stats.dislikes = dislikeNumber - 1;
                }
            }
            // update tuit stats
            await tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }

    userTuitDisLikes = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === "me" && profile ?
            profile._id : uid;
        try {
            const userAlreadyLikedTuit = await likeDao.findUserLikesTuit(userId, tid);
            const userAlreadyDisLikedTuit = await this.dislikeDao
                .findUserDisLikesTuit(userId, tid);
            const howManyLikedTuit = await this.likeDao
                .countHowManyLikedTuit(tid);
            const howManyDisLikedTuit = await this.dislikeDao
                .countHowManyUnLikedTuit(tid);
            let tuit = await this.tuitDao.findTuitById(tid);
            if (!userAlreadyLikedTuit && !userAlreadyDisLikedTuit) {
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else if (!userAlreadyLikedTuit && userAlreadyDisLikedTuit){
                await this.dislikeDao.DeleteUserDislikesTuit(userId, tid);
                tuit.stats.dislikes = howManyDisLikedTuit - 1;
                tuit.stats.dislikeByFlag = false;
                await this.likeDao.userLikesTuit(userId, tid)
                tuit.stats.likes = howManyLikedTuit + 1;
                tuit.stats.likeByFlag = true;
            }
            else if(userAlreadyLikedTuit && !userAlreadyDisLikedTuit){
                await this.likeDao.userUnlikesTuit(userId, tid);
                tuit.stats.likes = howManyLikedTuit - 1;
                tuit.stats.likeByFlag = false;
                await this.dislikeDao.CreateUserDisLikesTuit(userId, tid)
                tuit.stats.dislikes = howManyDisLikedTuit + 1;
                tuit.stats.dislikeByFlag = true;
            }
            else {
                tuit.stats.dislikes = howManyDisLikedTuit;
                tuit.stats.likes = howManyLikedTuit;
            }
            await this.tuitDao.updateLikes(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
            res.sendStatus(404);
        }
    }





};*/
