import express, {Request, Response} from 'express';
import mongoose from "mongoose";
import UserDao from "./daos/UserDao";
import TuitDao from "./daos/TuitDao";
import TuitController from "./controllers/TuitController";
import UserController from "./controllers/UserController";
import bodyParser from 'body-parser';
const app = express();

mongoose.connect('mongodb+srv://PPK2000:Poorna-2000@cluster0.1murc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
app.use(bodyParser.json())

app.get('/hello', (req: Request, res: Response) =>
    res.send('Hello World!'));

app.get('/add/:a/:b', (req: Request, res: Response) =>
    res.send(req.params.a + req.params.b));

const userOne = new UserDao();
const userControl = new UserController(app,userOne);

const tuitOne = new TuitDao();
const tuitControl = new TuitController(app, tuitOne);

const PORT = 4000;
app.listen(process.env.PORT || PORT);

