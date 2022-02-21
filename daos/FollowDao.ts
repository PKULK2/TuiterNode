import FollowDaoI from "../interfaces/FollowDaoI";
import Follow from "../models/follow/Follow";
import FollowModel from "../mongoose/follow/FollowModel";

export default class FollowDao implements FollowDaoI {
    public static followDao: FollowDao | null = null
    public static getInstance = (): FollowDao => {
        if (FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}

    findAllUsers = async (): Promise<Follow[]> =>
        FollowModel.find().exec();

    findOneUser = async (userFollowed: string, userFollowing: string): Promise<any> =>
        FollowModel.findOne({userFollowed: userFollowed, userFollowing: userFollowing});

    followUser = async (userFollowed: string, userFollowing: string): Promise<Follow> =>
        FollowModel.create({userFollowed: userFollowed, userFollowing: userFollowing});

    unFollowUser = async (userFollowed: string, userFollowing: string): Promise<any> =>
        FollowModel.deleteOne({userFollowed: userFollowed, userFollowing: userFollowing});

    findAllUsersFollowing = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowing: uid})
            .populate("userFollowed")
            .exec();

    findAllUsersFollowers = async (uid: string): Promise<Follow[]> =>
        FollowModel.find({userFollowed: uid})
            .populate("userFollowing")
            .exec();

}