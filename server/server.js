import express from 'express';
import path from 'path';
import 'dotenv/config';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import User from './models/User.js';

import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose';


import connectToDb from './db.js';

import router from './routes/userRouter.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('server/public')));

app.use(router);


connectToDb().catch(console.dir);

AdminJS.registerAdapter({ Database, Resource });

const admin = new AdminJS({
 resources : [User],
});

const adminRouter = AdminJSExpress.buildRouter(admin)

app.use(admin.options.rootPath, adminRouter)

app.use((req, res, next)=>{
    res.status(404).send("Not Found");
});

io.on('connection', (socket) => {
    socketRouter(io, socket);
});

server.listen(process.env.PORT, () => {
    console.log(`Server started at http://127.0.0.1:${process.env.PORT}`);
    console.log(`AdminJS started on http://localhost:${process.env.PORT}${admin.options.rootPath}`)
});