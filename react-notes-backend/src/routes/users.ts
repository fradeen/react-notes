import express from "express";
import { db } from '../db/conn.js';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { ObjectId } from "mongodb";
import cookieParser from 'cookie-parser';
import { body, validationResult } from "express-validator";
dotenv.config();
let userAuthRoutes = express.Router();
userAuthRoutes.use(cookieParser())
type NewUserReq = {
    password: string
} & UserReq

type User = {
    userName: String
    email: string,
    salt: string,
    hash: string,
    _id?: ObjectId
}

type UserReq = {
    userName: string,
    email: string
}

type CustomReq = {
    user?: UserReq
} & express.Request

/* verify user provided password by hashing it and comparing
the resultant hash with hash saved in db for the user */
let verifyUserPass = function (existingUser: User, password: string) {
    var hash = crypto.pbkdf2Sync(password,
        existingUser.salt, 1000, 64, `sha512`).toString(`hex`);
    return existingUser.hash === hash;
}

let createNewUser = async function (newUSer: NewUserReq): Promise<User> {

    //generate random salt for hasing user password
    let salt = crypto.randomBytes(16).toString('hex');
    //add salt and hash user password 
    let hash = crypto.pbkdf2Sync(newUSer.password, salt,
        1000, 64, `sha512`).toString(`hex`);
    let user: User = {
        userName: newUSer.userName,
        email: newUSer.email,
        salt: salt,
        hash: hash,
    }

    //add user in db
    await db.collection("users").insertOne(user);
    return user;
}
//middleware to authenticate requests
let authenticateRequest = function (req: CustomReq, res: express.Response, next: express.NextFunction): void {
    //extract header from request; return bad request if no header is present
    let header = req.headers;
    if (!header) {
        res.status(400).send('No header present in the request.')
        return
    }
    //extract acess token from header; deny acces if no access token is present
    let token = header.authorization!.split(' ')[1];
    if (!token) {
        res.status(401).send('Access Denied. No access token provided.')
        return
    }
    try {
        //verify access token
        let decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_KEY!) as UserReq;
        //add decoded data from token into request
        req.user = decodedToken;
        next();
    } catch {
        //deny access if verification of token fails.
        res.status(403).send('Access Denied. Access token not valid.')
        return
    }

}

let checkUserExsists = async function (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

    if (!req.body || !req.body.userName || !req.body.email || !req.body.password) {
        res.status(400).send('Wrong request body format.')
        return
    }
    //find user in db.
    let existingUserName = await db
        .collection<User>("users").findOne({ userName: req.body.userName });
    let existingEmail = await db
        .collection<User>("users").findOne({ email: req.body.email });
    //if user already exixts throw error
    if (existingUserName) {
        res.status(409).send('Username already exists.')
        return
    }
    //if email already exixts throw error
    if (existingEmail) {
        res.status(409).send('email already exists.')
        return
    }
    next()
}

// Handling login request
userAuthRoutes.post("/login",
    [body('email').trim().notEmpty().isEmail(),
    body('password').trim().notEmpty().escape()],
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        try {
            let ValidationErrors = validationResult(req);
            if (!ValidationErrors.isEmpty() && ValidationErrors.mapped()['email']) {
                res.status(400).send('Invalid email address. Please try again.')
                return
            }
            if (!ValidationErrors.isEmpty() && ValidationErrors.mapped()['password']) {
                res.status(400).send('Password can not be empty')
                return
            }

            let { email, password } = req.body;
            let existingUser: User | null;
            existingUser = await db
                .collection<User>("users").findOne({ email: email });
            if (!existingUser) {
                res.status(403).send('Access Denied. User doesn\'t exists')
                return
            }
            if (!verifyUserPass(existingUser, password)) {
                res.status(403).send('Access Denied. Invalid credentials.')
                return
            }


            //Creating jwt token
            let accessToken = jwt.sign(
                { userName: existingUser.userName, email: existingUser.email },
                process.env.JWT_ACCESS_TOKEN_KEY!,
                { expiresIn: "1h" }
            );

            let refreshToken = jwt.sign(
                { userName: existingUser.userName, email: existingUser.email },
                process.env.JWT_RESRESH_TOKEN_KEY!,
                { expiresIn: "1d" }
            );

            res
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', accessToken)
                .status(200)
                .json({
                    success: true,
                    data: {
                        userName: existingUser.userName,
                        email: existingUser.email,
                    },
                });
        } catch (error) {
            next(error);
        }


    });

//Handling SignUp

userAuthRoutes.post("/signup",
    [body('email').trim().notEmpty().isEmail(),
    body('password').trim().escape().isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10,
    }),
    body('userName').trim().notEmpty().escape().isLength({ min: 5, max: 15 })],
    checkUserExsists, async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        try {

            let ValidationErrors = validationResult(req);
            if (!ValidationErrors.isEmpty() && ValidationErrors.mapped()['email']) {
                res.status(400).send('Invalid email address. Please try again.')
                return
            }
            if (!ValidationErrors.isEmpty() && ValidationErrors.mapped()['password']) {
                res.status(400).send('Password must have one of each lowercase,uppercase, symbol & numeric characters and atleast have 8 characters')
                return
            }
            if (!ValidationErrors.isEmpty() && ValidationErrors.mapped()['userName']) {
                res.status(400).send('userName must be between 5 to 15 characters long.')
                return
            }

            let { userName, email, password } = req.body;
            let newUser: NewUserReq = {
                userName: userName as string,
                email: email as string,
                password: password as string,
            };
            let user: User;
            user = await createNewUser(newUser);
            //Creating jwt token
            let accessToken = jwt.sign(
                { userName: newUser.userName, email: newUser.email },
                process.env.JWT_ACCESS_TOKEN_KEY!,
                { expiresIn: "1h" }
            );

            let refreshToken = jwt.sign(
                { userName: newUser.userName, email: newUser.email },
                process.env.JWT_RESRESH_TOKEN_KEY!,
                { expiresIn: "1d" }
            );
            res
                .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
                .header('Authorization', accessToken)
                .status(201)
                .json({
                    success: true,
                    data: {
                        userName: user.userName,
                        email: user.email,
                    },
                });
        } catch (error) {
            next();
        }

    });

userAuthRoutes.post('/refresh', (req, res) => {
    //console.log(req)
    let refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
        let decodedToken = jwt.verify(refreshToken, process.env.JWT_RESRESH_TOKEN_KEY!) as UserReq;
        let accessToken = jwt.sign({ user: decodedToken.userName }, process.env.JWT_ACCESS_TOKEN_KEY!, { expiresIn: '1h' });

        res
            .header('Authorization', accessToken)
            .status(201)
            .json({
                success: true,
                data: {
                    userName: decodedToken.userName,
                    email: decodedToken.email,
                },
            });
    } catch (error) {
        res.status(400).send('Invalid refresh token.');
    }
});

export { userAuthRoutes, authenticateRequest, CustomReq };