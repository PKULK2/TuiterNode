import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @file Declares API for bookmarks related data access object methods
 */

export default interface BookmarkDaoI {
    bookmarkTuit(tid: string, uid: string): Promise<Bookmark>;
    unBookmarkTuit(tid: string, uid: string): Promise<any>;
    viewAllBookmarkedTuitsByUser(uid: string): Promise<Bookmark[]>;
    viewAllBookmarkedTuits(): Promise<Bookmark[]>;
    viewOneBookmarkedTuit(uid: string): Promise<Bookmark>;


}