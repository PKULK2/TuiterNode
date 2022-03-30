import DisLikeDaoI from "../interfaces/DislikeDaoI";
import DisLikeModel from "../mongoose/Dislike/DislikeModel";
import DisLike from '../models/dislikes/Dislikes';

export default class DisLikeDao implements DisLikeDaoI {

    findAllUsersThatDisLikedTuit = async (tid: string): Promise<DisLike[]> =>
        DisLikeModel.find({tuit: tid})
            .populate("dislikedBy")
            .exec();

    findAllTuitsDislikedByUser = async (uid: string): Promise<DisLike[]> =>
        DisLikeModel
            .find({dislikedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();
    countHowManyUnLikedTuit = async (tid: string): Promise<any> =>
        DisLikeModel.count({tuit: tid});

    DeleteUserDislikesTuit = async (uid: string, tid: string): Promise<any> =>
        DisLikeModel.deleteOne({tuit: tid, dislikedBy: uid});

    CreateUserDisLikesTuit = async (uid: string, tid: string): Promise<any> =>
        DisLikeModel.create({tuit: tid, dislikedBy: uid});

    findUserDisLikesTuit = async (uid: string, tid: string): Promise<any> =>
        DisLikeModel.findOne({tuit: tid, dislikedBy: uid});
}
