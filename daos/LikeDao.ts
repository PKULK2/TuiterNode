/**
 * @file Implements DAO managing data storage of likes. Uses mongoose UserModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Users
 * @property {LikeDao} likeDao Private single instance of UserDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;
    /**
     * Creates singleton DAO instance
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }
    private constructor() {}

    /**
     * Uses LikeModel to retrieve all the users that liked a tuit
     * @param tid tuit primary key
     * @return Promise To be notified when the user are retrieved
     * from the database
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel.find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Uses LikeModel to retrieve all the tuits that a user has liked
     * @param uid user primary key
     * @return Promise To be notified when the tuits are retrieved
     * from the database
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel.find({likedBy: uid})
            .populate("tuit")
            .exec();

    /**
     * User can like a tuit
     * @param uid user primary key
     * @param tid tuit primary key
     * @return Promise To be notifed when the like is inserted
     * into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * User can un-like a tuit
     * @param uid user primary key
     * @param tid tuit primary key
     * @return Promise To be notifed when the like is removed
     * into the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});
}