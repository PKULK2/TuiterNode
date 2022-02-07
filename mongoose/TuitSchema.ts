import mongoose, {Schema} from "mongoose";

const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postedOn: {type: Date, default: Date.now()},
    postedBy: String,
},{collection: 'tuits'});
export default TuitSchema;
