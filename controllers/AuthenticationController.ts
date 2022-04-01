import {Express, Request, Response} from "express";
import UserDao from "../daos/UserDao";
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default class AuthenticationController {
    app: Express;
    userDao: UserDao;
    constructor (app: Express, userDao: UserDao) {
        this.app = app;
        this.userDao = userDao;
        app.post("/api/auth/signup", this.signup);
        app.post("/api/auth/profile", this.profile);
        app.post("/api/auth/logout", this.logout);
        app.post("/api/auth/login", this.login);
    }
    signup = async (req: any, res: any) => {
        const newUser = req.body;
        const password = newUser.password;
        const hash = await bcrypt.hash(password, saltRounds);
        newUser.password = hash;

        const existingUser = await this.userDao
            .findUserByUsername(req.body.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        }
        else {
            const insertedUser = await this.userDao
                .createUser(newUser);
            insertedUser.password = '';
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    }
    profile = (req: any, res: any) => {
        const profile = req.session['profile'];
        if (profile) {
            profile.password = "";
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    logout = (req: any, res: any) => {
        req.session.destroy();
        res.sendStatus(200);
    }

    login = async (req: any, res: any) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await this.userDao
            .findUserByUsername(username);
        if (!existingUser) {
            res.sendStatus(403);
            return;
        }

        const match = await bcrypt
            .compare(password, existingUser.password);
        if (match) {
            existingUser.password = '*****';
            req.session['profile'] = existingUser;
            res.json(existingUser);
        } else {
            res.sendStatus(403);
        }
    }



}