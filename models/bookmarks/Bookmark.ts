/**
 * @file Declares bookmark data type representing relationship between
 * users and tuit, as in user bookmarks a tuit
 */
import Tuit from "../tuits/Tuit";
import User from "../users/User";

/**
 * @typedef Bookmark Represents bookmark relationship between a user and a tuit,
 * as in a user bookmarks a tuit
 * @property {Tuit} bookmarkedTuit tuit being bookmarked
 * @property {User} bookmarkedBy user bookmarking tuit
 */
export default interface Bookmark {
    bookmarkedTuit: Tuit,
    bookmarkedBy: User
}