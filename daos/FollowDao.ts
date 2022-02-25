/**
 * @file Implements DAO managing data storage of follow. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import Follow from "../models/follow/Follow";
import FollowModel from "../mongoose/follow/FollowModel";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of follow
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI {
    public static followDao: FollowDao | null = null
    /**
     * Creates singleton DAO instance
     * @returns FollowDao
     */
    public static getInstance = (): FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    /**
     * Uses FollowModel to retrieve all the users
     * @returns Promise To be notified when the users are retrieved from the database
     */
    findAllUsers = async (): Promise<Follow[]> =>
        FollowModel.find().exec();

    /**
     * Uses FollowModel to retrieve one of the user's followers
     * @param {string} userFollowing user following primary key
     * @param {string} userFollowed user followed primary key
     * @returns Promise To be notified when the user is retrieved from the database
     */
    findOneUser = async (userFollowed: string, userFollowing: string): Promise<any> =>
        FollowModel.findOne({userFollowed: userFollowed, userFollowing: userFollowing});

    /**
     * Creates a follow instance in the database
     * @param {string} userFollowed user followed primary key
     * @param {string} userFollowing user following primary key
     * @returns Promise To be notified when user is followed in
     * the database
     */
    followUser = async (userFollowed: string, userFollowing: string): Promise<Follow> =>
        FollowModel.create({userFollowed: userFollowed, userFollowing: userFollowing});

    /**
     * Creates a unfollow instance in the database
     * @param {string} userFollowed user followed primary key
     * @param {string} userFollowing user following primary key
     * @returns Promise To be notified when user is unfollowed in
     * the database
     */
    unFollowUser = async (userFollowed: string, userFollowing: string): Promise<any> =>
        FollowModel.deleteOne({userFollowed: userFollowed, userFollowing: userFollowing});

    /**
     * Uses FollowModel to retrieve all of the following of a given user
     * @param {string} userFollowing user following primary key
     * @param {string} userFollowed user followed primary key
     * @returns Promise To be notified when the user's following is retrieved from the database
     */
    findAllUsersFollowing = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowing: uid})
            .populate("userFollowed")
            .exec();

    /**
     * Uses FollowModel to retrieve all of the followers of a given user
     * @param {string} userFollowing user following primary key
     * @param {string} userFollowed user followed primary key
     * @returns Promise To be notified when the user's followers are retrieved from the database
     */
    findAllUsersFollowers = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowed: uid})
            .populate("userFollowing")
            .exec();

}