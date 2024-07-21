const express = require('express');
const multer = require('multer');
const router = express.Router();
const driver = require('../db');
const upload = multer({ dest: 'uploads/'});

router.post('/createUser' , async (req , res) => {
    const { username , email , } = req.body;
    try {
        await driver.executeQuery(
            'CREATE (u:User {user_name: $username , email:$email})',
            {username , email}
        );
        res.status(200).send('User Created');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        await session.close();
    }
});

router.post('/onboaed' , upload.single('photo') , async (req , res) => {
    const { firstname , lastName , dob , gender , bio , } = req.body;
    const photo = req.file ? req.files.filename : null;

    try {
        await driver.executeQuery(`
            MATCH (u:User {email: $email})
            SET u.firstName = $firstName
            SET u.lastName = $lastName
            SET u.dob = $dob
            SET u.gender = $gender
            SET u.bio = $bio` ,
             {firstname , lastName , dob , gender , bio, photo} );
             res.status(200).send('User updated');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        await session.close();
    }

});

module.exports = router;