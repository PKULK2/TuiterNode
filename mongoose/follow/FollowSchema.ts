/**
 * @file implements the mongoose schema for the follow
 * CRUD operations
 */
import mongoose, {Schema} from "mongoose";
import Follow from "../../models/follow/Follow";

const FollowSchema = new mongoose.Schema<Follow>({
    userFollowed: {type: Schema.Types.ObjectId, ref:"UserModel"},
    userFollowing: {type: Schema.Types.ObjectId, ref:"UserModel"},
}, {collection: "follow"});
export default FollowSchema;

