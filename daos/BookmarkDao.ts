/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import Bookmark from "../models/bookmarks/Bookmark";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of bookmarks
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI{
    public static bookmarkDao: BookmarkDao | null = null
    /**
     * Creates singleton DAO instance
     * @returns BookmarkDao
     */
    public static getInstance = (): BookmarkDao => {
        if (BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}

    /**
     * Creates a bookmark instance in the database
     * @param {string} uid user's primary key
     * @param {string} tid tuit's primary key
     * @returns Promise To be notified when tuit is bookmarked in
     * the database
     */
    bookmarkTuit = async (tid: string, uid: string): Promise<Bookmark> =>
        BookmarkModel.create({bookmarkedTuit: tid, bookmarkedBy: uid});

    /**
     * Creates a un-bookmark instance in the database
     * @param {string} uid user's primary key
     * @param {string} tid tuit's primary key
     * @returns Promise To be notified when tuit is un-bookmarked in
     * the database
     */
    unBookmarkTuit = async (tid: string, uid: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedTuit: tid, bookmarkedBy: uid});

    /**
     * Uses BookmarkModel to retrieve all the bookmarked tuits from bookmark collection
     * @returns Promise To be notified when the tuits are retrieved from the database
     */
    viewAllBookmarkedTuits = async (): Promise<Bookmark[]> =>
        BookmarkModel.find().exec();

    /**
     * Uses BookmarkModel to retrieve all the bookmarked tuits by a given user
     * from bookmark collection
     * @param {string} uid user's primary key
     * @returns Promise To be notified when the tuits are retrieved from the database
     */
    viewAllBookmarkedTuitsByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel.find({bookmarkedBy: uid});

    /**
     * Uses BookmarkModel to retrieve one of the bookmarked tuits by a given user
     * from bookmark collection
     * @param {string} uid user's primary key
     * @param {string} tid tuit's primary key
     * @returns Promise To be notified when the tuit is retrieved from the database
     */
    viewOneBookmarkedTuit = async (uid: string): Promise<any> =>
        BookmarkModel.findOne({bookmarkedBy: uid});

}