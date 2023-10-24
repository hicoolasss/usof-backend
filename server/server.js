import express from 'express';
import path from 'path';
import 'dotenv/config';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import User from './models/User.js';
import Token from './models/Token.js';
import Post from './models/Post.js';
import Like from './models/Like.js';
import Comment from './models/Comment.js';
import cors from "cors";

import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose';

import errorHandler from './middlewares/errorHandler.js';

import connectToDb from './db.js';

import router from './routes/userRouter.js';
import Category from './models/Category.js';

import session from 'express-session';
import passport from 'passport';


const app = express();
const server = createServer(app);

const navigation = {
    name: 'User Management',
    icon: 'Users',
}

app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL_PROD],
    credentials: true,
}));

app.use(cookieParser());
app.use(fileUpload({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('server/public')));

app.use(session({
    secret: 'your-secret-key', // Уникальная строка для подписи cookie
    resave: false, // Обязательно
    saveUninitialized: false, // Обязательно
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router);


connectToDb().catch(console.dir);


AdminJS.registerAdapter({ Database, Resource });

const admin = new AdminJS({
    resources: [
        {
            resource: User,
            options: {
                navigation,
                id: "User",
                icon: "User",
            },
        },
        {
            resource: Token,
            options: {
                navigation,
                id: "Users tokens",
            }
        },
        // ...ваши другие ресурсы
        Post, // если вы хотите добавить категории навигации для других ресурсов, следует повторить шаги выше
        Like,
        Comment,
        Category,
    ],


});

const adminRouter = AdminJSExpress.buildRouter(admin)

app.use(admin.options.rootPath, adminRouter)


app.use((req, res, next) => {
    res.status(404).send("Not Found");
});

app.use('/uploads', express.static('uploads'));

app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`Server started at http://127.0.0.1:${process.env.PORT}`);
    console.log(`AdminJS started on http://localhost:${process.env.PORT}${admin.options.rootPath}`)
});