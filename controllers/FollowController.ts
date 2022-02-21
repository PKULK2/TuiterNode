/**
* @file Controller RESTful Web service API for follow resource
*/
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";
import Follow from "../models/follow/Follow";

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

    findAllUsers = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsers()
            .then((follow) => res.json(follow));

    findAllUsersFollowers = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersFollowers(req.params.uid)
            .then((followers) => res.json(followers));


    findAllUsersFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersFollowing(req.params.uid)
            .then((following) => res.json(following));

    findOneUser = (req: Request, res: Response) =>
        FollowController.followDao.findOneUser(req.params.uid, req.params.fid)
            .then((user) => res.json(user));

    followUser = (req: Request, res: Response) =>
        FollowController.followDao.followUser(req.params.uid, req.params.fid)
            .then((follow) => res.json(follow));

    unFollowUser = (req: Request, res: Response) =>
        FollowController.followDao.unFollowUser(req.params.uid, req.params.fid)
            .then((unfollow) => res.json(unfollow));
}