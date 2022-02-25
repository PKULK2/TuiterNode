/**
* @file Controller RESTful Web service API for follow resource
*/
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";

/**
 * @class FollowController Implements RESTful Web service API for follow resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/follow/:uid/following to retrieve all the following  of
 *     a given user</li>
 *     <li>GET /api/follow/:uid/followers to retrieve all the followers of
 *     a given user</li>
 *     <li>POST /api/users/:uid/follow/:fid to follow a user</li>
 *     <li>DELETE /api/users/:uid/unfollow/:fid to unfollow a user </li>
 *     <li>GET /api/follow to retrieve all users</li>
 *     <li>GET /api/follow/:uid to retrieve any one user</li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follow CRUD operations
 * @property {FollowController} followController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance()
    private static followController: FollowController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if (FollowController.followController === null){
            FollowController.followController = new FollowController();
            app.get("/api/follow/:uid/following", FollowController.followController.findAllUsersFollowing);
            app.get("/api/follow/:uid/followers", FollowController.followController.findAllUsersFollowers);
            app.post("/api/users/:uid/follow/:fid", FollowController.followController.followUser);
            app.delete("/api/users/:uid/unfollow/:fid", FollowController.followController.unFollowUser);
            app.get("/api/follow", FollowController.followController.findAllUsers);
            app.get("/api/follow/:uid", FollowController.followController.findOneUser);
        }
        return FollowController.followController;
    }

    /**
     * Retrieves all the users from the database and returns an array of users.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the users
     */
    findAllUsers = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsers()
            .then((follow) => res.json(follow));

    /**
     * Retrieves all the followers of a given user.
     * @param {Request} req Represents request from client, including
     * the path parameter uid representing the user whose followers
     * will be returned
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the users' followers
     */
    findAllUsersFollowers = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersFollowers(req.params.uid)
            .then((followers) => res.json(followers));

    /**
     * Retrieves all the following of a given user.
     * @param {Request} req Represents request from client, including
     * the path parameter uid representing the user whose following
     * will be returned
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the users' following
     */
    findAllUsersFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersFollowing(req.params.uid)
            .then((following) => res.json(following));

    /**
     * Retrieves one of the followers of a given user.
     * @param {Request} req Represents request from client, including
     * the path parameter uid representing the user whose follower
     * will be returned
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing one of the users' followers
     */
    findOneUser = (req: Request, res: Response) =>
        FollowController.followDao.findOneUser(req.params.uid, req.params.fid)
            .then((user) => res.json(user));

    /**
     * Follow a user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and fid representing the current user who
     * wants to follow and fid representing the user to be followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing showing the confirmation of the follow
     */
    followUser = (req: Request, res: Response) =>
        FollowController.followDao.followUser(req.params.uid, req.params.fid)
            .then((follow) => res.json(follow));

    /**
     * Un-Follow a user
     * @param {Request} req Represents request from client, including the
     * path parameters uid and fid representing the current user who
     * wants to un-follow and fid representing the user to be un-followed
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing showing the confirmation of the unfollow
     */
    unFollowUser = (req: Request, res: Response) =>
        FollowController.followDao.unFollowUser(req.params.uid, req.params.fid)
            .then((unfollow) => res.json(unfollow));
}