import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";
import bodyParser from 'body-parser';
import FollowController from "./controllers/FollowController";
import LikeController from "./controllers/LikeController";
import MessageController from "./controllers/MessageController";
import BookmarkController from "./controllers/BookmarkController";
const app = express();

var cors = require('cors');
app.use(cors());

mongoose.connect('mongodb+srv://PPK2000:Poorna-2000@cluster0.1murc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
app.use(bodyParser.json())

app.get('/hello', (req: Request, res: Response) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));

const userController = UserController.getInstance(app);
const followController = FollowController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likesController = LikeController.getInstance(app);
const messageControler = MessageController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);



const PORT = 4000;
app.listen(process.env.PORT || PORT);

