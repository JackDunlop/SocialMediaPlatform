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


router.get('/resize/:image/:height/:width', async (req: Request, res: Response, next: NextFunction) => {
    const imageFile: string = req.params.image;
    const heightParam: string = req.params.height;
    const widthParam: string = req.params.width;

    const height: number = parseInt(heightParam);
    const width: number = parseInt(widthParam);
    if (isNaN(height) || isNaN(width)) {
        res.status(400).json({ error: true, message: "Invalid height or width parameters, must be integers" });
        return;
    }

    const fileExtension: string = imageFile.split('.')[1];
    const outputDir = path.join(__dirname, '../images/edited');
    const outputFile = path.join(outputDir, `${imageFile}_resized_${height}_${width}.${fileExtension}`);

    // Ensure the directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        await sharp(imageFile)
            .resize({ width: width, height: height })
            .toFile(outputFile);
        res.status(200).json({ error: false, message: "Resized successfully." });
    } catch (err) {
        console.error("Error processing image:", err);
        res.status(500).json({ error: true, message: "Resizing failed." });
    }
});



router.get('/rotate/:image/:angle', async (req: Request, res: Response, next: NextFunction) => {
    const imageFile: string = req.params.image;

    const angleParam: string = req.params.angle;


    const angle: number = parseInt(angleParam);
    if (isNaN(angle)) {
        res.status(400).json({ error: true, message: "Invalid degree, must be integers" });
        return;
    }

    const fileExtension: string = imageFile.split('.')[1];

    const outputDir = path.join(__dirname, '../images/edited');
    const outputFile = path.join(outputDir, `${imageFile}_rotated_${angle}.${fileExtension}`);



    try {
        await sharp(imageFile)
            .rotate(angle)
            .toFile(outputFile);
        res.status(200).json({ error: false, message: "Rotated successfully." });
    } catch (err) {
        console.error("Error processing image:", err);
        res.status(500).json({ error: true, message: "Resizing failed." });
    }
});


// router.get('/fisheye/:image/:radius', async (req: Request, res: Response, next: NextFunction) => {
//     const imageFile: string = req.params.image;
//     const fileExtension: string = imageFile.split('.')[1];

//     const radiusParam: string = req.params.radius;
//     const radius: number = parseInt(radiusParam);

//     if (isNaN(radius)) {
//         res.status(400).json({ error: true, message: "Invalid degree, must be integers" });
//         return;
//     }
//     try {
//         const image = await Jimp.read(imageFile);
//         await image
//             .fisheye({ r: radius })
//             .writeAsync(`./images/editted/${imageFile}_fisheye.${fileExtension}`);
//         res.status(200).json({ error: false, message: " Fisheyed successfully." });
//     } catch (err) {
//         console.error("Error processing image:", err);
//         res.status(500).json({ error: true, message: " Fisheyed failed." });
//     }
// });

module.exports = router;
