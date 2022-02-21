import {Request, Response} from "express";

export default interface FollowControllerI{
    findAllUsersFollowing (req: Request, res: Response): void;
    findAllUsersFollowers (req: Request, res: Response): void;
    followUser (req: Request, res: Response): void;
    unFollowUser (req: Request, res: Response): void;
    findAllUsers (req: Request, res: Response): void;
    findOneUser (req: Request, res: Response): void;
}