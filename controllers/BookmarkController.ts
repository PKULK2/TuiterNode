/**
 * @file Controller RESTful Web service API for bookmark resource
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmark resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>POST /api/bookmark/:tid/:uid to bookmark a tuit
 *     </li>
 *     <li>DELETE /api/unbookmark/:tid/:uid to unbookmark a tuit
 *     </li>
 *     <li>GET /api/bookmark to retrieve all bookmarked tuits
 *     </li>
 *     <li>GET /api/bookmark/tuit/:uid to retrieve all tuits bookmarked by a user
 *     </li>
 *     <li>GET api/bookmark/:uid/:tid to retrieve one tuit bookmarked by a user
 *         </li>
 * </ul>
 * @property {BookmarkDao} bookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} bookmarkController Singleton controller implementing
 * RESTful Web service API
 */

export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance()
    private static bookmarkController: BookmarkController | null = null;

    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */

    public static getInstance = (app: Express): BookmarkController => {
        if (BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.post("/api/bookmark/:tid/:uid", BookmarkController.bookmarkController.bookmarkTuit);
            app.delete("/api/unbookmark/:tid/:uid", BookmarkController.bookmarkController.unBookmarkTuit);
            app.get("/api/bookmark", BookmarkController.bookmarkController.viewAllBookmarkedTuits);
            app.get("/api/bookmark/tuit/:uid", BookmarkController.bookmarkController.viewAllBookmarkedTuitsByUser);
            app.get("/api/bookmark/:uid", BookmarkController.bookmarkController.viewOneBookmarkedTuit);
        }
        return BookmarkController.bookmarkController;
    }

    /**
     * Bookmarks a tuit
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the id of the tuit to be bookmarked and parameter
     * uid representing the user id
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmarked tuit
     */

    bookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.bookmarkTuit(req.params.tid, req.params.uid)
            .then((book) => res.json(book));

    /**
     * Un-bookmarks a tuit
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the id of the tuit to be bookmarked and parameter
     * uid representing the user id
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmarked tuit
     */
    unBookmarkTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.unBookmarkTuit(req.params.tid, req.params.uid)
            .then((unbook) => res.json(unbook));

    /**
     * Retrieves all bookmarked tuits from the database and returns an array of tuits.
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmarked tuit objects
     */
    viewAllBookmarkedTuits = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.viewAllBookmarkedTuits()
            .then((view) => res.json(view));

    /**
     * Retrieves all bookmarked tuits by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    viewAllBookmarkedTuitsByUser = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.viewAllBookmarkedTuitsByUser(req.params.uid)
            .then((tuit) => res.json(tuit));

    /**
     * Retrieves one bookmarked tuits by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the tuits and parameter tid representing
     * the tuit to be retrieved from the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    viewOneBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.viewOneBookmarkedTuit(req.params.uid)
            .then((one: Bookmark) => res.json(one));
}