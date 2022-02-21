import User from "../users/User";

export default interface Message {
    message: string,
    sentTo: User,
    SentFrom: User,
    sentOn: Date
};