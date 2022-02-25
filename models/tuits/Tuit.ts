/**
 * @file Declares Tuit data type representing relationship between
 * users and tuits, as in user posts a tuit
 */
import User from "../users/User";

/**
 * @typedef Tuit Represents tuits relationship between a user and a tuit,
 * as in a user posts a tuit
 * @property {Tuit}
 * @property {User} postedBy User posting the tuit
 * @property {Date} postedOn Date tuit was posted
 */

export default interface Tuit {
    tuit: string,
    postedBy: User,
    postedOn?: Date,
};