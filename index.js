require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./router/userRouter");
const tweetRouter = require("./router/tweetRouter");
const authRouter = require("./router/authRouter");
const port = process.env.PORT || 4050;
const connectToDB = require("./db_connection");
const globalErrorHandler = require("./utils/globalErrorHandler");
const notFound = require("./utils/notFound");
const authenticationMiddleware = require("./utils/authenticationMiddleware");

app.use(express.json());

// middleware definitions for user
app.use("/user", authenticationMiddleware, userRouter);
// middleware definitions for tweets
app.use("/tweet", authenticationMiddleware, tweetRouter);
app.use("/auth", authRouter);

app.use(notFound);
app.use(globalErrorHandler);

async function start() {
    try {
        await connectToDB();
        // listen on the specified port only if DB connection is successful
        app.listen(port, () =>
            console.log(`Server is running on port ${port}`)
        );
    } catch (error) {
        console.log("failed to connect to DB", error);
    }
}

start();
