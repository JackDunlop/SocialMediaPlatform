var express = require('express');
import { Request, Response, NextFunction } from 'express';
var router = express.Router();
const fs = require('fs');
const path = require('path');
const sharp = require("sharp");

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
    res.send('respond with a resource');
});


router.get('/upload', async (req: Request, res: Response, next: NextFunction) => {

});






module.exports = router;
