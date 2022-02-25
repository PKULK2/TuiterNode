/**
 * @file Declares Like data type representing relationship between
 * users and follow, as in user follow another user
 */
import User from "../users/User";

/**
 * @typedef Follow Represents follow relationship between two users,
 * as in a user follows another tuit
 * @property {User} userFollowed user being followed
 * @property {User} userFollowing user to follow
 */
export default interface Follow {
    userFollowed: User,
    userFollowing: User
};