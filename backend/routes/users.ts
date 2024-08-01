var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
import fs from 'fs';
import path from 'path';
const USERS_DIRECTORY = path.join(__dirname, '..', 'Users');


import { Request, Response, NextFunction } from 'express';

import { db } from './database'
import { UserUpdate, User, NewUser } from './databasetypes'
import { error } from 'console';

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.selectFrom('users').selectAll().execute();
    res.json({ Error: false, Message: 'Success', users });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ Error: true, Message: 'Database query failed', error });
  }
});




router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const DOB: string = req.body.dob;
  const fullname: string = req.body.fullname;
  const email: string = req.body.email;

  if (!username || !password || !DOB || !fullname || !email) {
    res.status(400).json({ Error: true, Message: 'Missing Username, Password, DOB, Fullname, or Email' });
    return;
  }

  try {
    const checkUserIsExisiting = await db.selectFrom('users').selectAll().where('username', '=', username).execute();
    if (checkUserIsExisiting.length > 0) {
      res.status(400).json({ Error: true, Message: 'Username Already In Use.' });
      return;
    }

    const checkEmailIsExisiting = await db.selectFrom('users').selectAll().where('email', '=', email).execute();
    if (checkEmailIsExisiting.length > 0) {
      res.status(400).json({ Error: true, Message: 'Username Email In Use.' });
      return;
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    const newUser: NewUser = {
      username: username,
      hash: hash,
      DOB: DOB,
      fullname: fullname,
      email: email
    };

    await db.insertInto('users').values(newUser).executeTakeFirst();


    const userDir = path.join(USERS_DIRECTORY, username);
    const postsDir = path.join(userDir, 'posts');
    const imagesDir = path.join(postsDir, 'images');
    const videosDir = path.join(postsDir, 'videos');
    const textDir = path.join(postsDir, 'text');

    fs.mkdirSync(userDir, { recursive: true });
    fs.mkdirSync(postsDir, { recursive: true });
    fs.mkdirSync(imagesDir, { recursive: true });
    fs.mkdirSync(videosDir, { recursive: true });
    fs.mkdirSync(textDir, { recursive: true });

    return res.status(201).json({ Error: false, Message: 'User successfully added' });
  } catch (error) {
    return res.status(500).json({ Error: true, Message: 'Database query failed', error });
  }
});


router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ Error: true, Message: 'Missing Username and Password' });
  }

  try {

    const checkUserIsExisting = await db.selectFrom('users').selectAll().where('username', '=', username).execute();

    if (checkUserIsExisting.length === 0) {
      return res.status(400).json({ Error: true, Message: 'User does not exist.' });
    }
    const match = await bcrypt.compare(password, checkUserIsExisting[0].hash);
    if (!match) {
      return res.status(401).json({ Error: false, Message: 'Invalid password.' });
    }


    const jwtExpireTimeIn = 60 * 2;
    const expire = Math.floor(Date.now() / 1000) + jwtExpireTimeIn;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET environment variable is not defined');
      return res.status(500).json({ Error: true, Message: 'Internal Server Error: JWT_SECRET not defined' });
    }
    const jwtToken = jwt.sign({ username, expire }, secret);

    return res.status(200).json({ jwtToken, token_type: "Bearer", jwtExpireTimeIn });


  } catch (Error) {
    return res.status(500).json({ Error: true, Message: 'Invalid' });
  }
});


module.exports = router;
