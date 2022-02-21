import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @file Declares API for Follows related data access object methods
 */

export default interface BookmarkDaoI {
    bookmarkTuit(tuitBookmarked: string, userBookmarked: string): Promise<Bookmark>;
    unBookmarkTuit(tuitBookmarked: string, userBookmarked: string): Promise<any>;
    viewAllBookmarkedTuitsByUser(userBookmarked: string): Promise<Bookmark[]>;
    viewAllBookmarkedTuits(): Promise<Bookmark[]>;
    viewOneBookmarkedTuit(tuitBookmarked: string, userBookmarked: string): Promise<any>;


}