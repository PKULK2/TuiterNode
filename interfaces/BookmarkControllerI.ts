import {Request, Response} from "express";


export default interface BookmarkControllerI {
    bookmarkTuit (req: Request, res: Response): void;
    unBookmarkTuit (req: Request, res: Response): void;
    viewAllBookmarkedTuits (req: Request, res: Response): void;
    viewAllBookmarkedTuitsByUser (req: Request, res: Response): void;
    viewOneBookmarkedTuit (req: Request, res: Response): void;
}