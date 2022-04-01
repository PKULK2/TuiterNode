import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";
import bodyParser from 'body-parser';
import FollowController from "./controllers/FollowController";
import LikeController from "./controllers/LikeController";
import MessageController from "./controllers/MessageController";
import BookmarkController from "./controllers/BookmarkController";
import AuthenticationController from "./controllers/AuthenticationController";
import TuitDao from "./daos/TuitDao";
import LikeDao from "./daos/LikeDao";
import DislikeDao from "./daos/DislikeDao";
import UserDao from "./daos/UserDao";
const cors = require('cors')
const session = require("express-session");

//mongoose.connect('mongodb://localhost:27017/Tuiter');
mongoose.connect('mongodb+srv://PPK2000:Poorna-2000@cluster0.1murc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
//app.use(bodyParser.json())

const app = express();
//cross network domain
app.use(cors({
    // support cookie header
    credentials: true,
    // must whitelists allowed domains(if using credentials)
    origin: process.env.CORS_ORIGIN
}));

//session configure
let sess = {
    secret: "process.env.SECRET",
    saveUninitialized: true,
    resave: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
    }
}

if (process.env.ENV === 'PRODUCTION') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
app.use(express.json())


app.get('/hello', (req: Request, res: Response) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));


const tuitDao = new TuitDao();
const likeDao = new LikeDao();
const dislikeDao = new DislikeDao();
const userDao = new UserDao();

const userController = UserController.getInstance(app);
const followController = FollowController.getInstance(app);
const tuitController = TuitController.getInstance(app);
const likeController = new LikeController(app, likeDao, tuitDao, dislikeDao)
const messageControler = MessageController.getInstance(app);
const bookmarkController = BookmarkController.getInstance(app);
//AuthenticationController(app);
const authController = new AuthenticationController(app, userDao);



const PORT = 4000;
app.listen(process.env.PORT || PORT);