/**
 * @file implements the mongoose schema for the message
 * CRUD operations
 */
import mongoose, {Schema} from "mongoose";
import Message from "../../models/messages/Message";

const MessageSchema = new mongoose.Schema<Message>({
    message: {type: String, required: true},
    sentTo: {type: Schema.Types.ObjectId, ref:"UserModel"},
    sentFrom: {type: Schema.Types.ObjectId, ref:"UserModel"},
    sentOn: Date
},{collection: "messages"});
export default MessageSchema;
