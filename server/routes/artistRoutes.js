const express = require('express');
const driver = require('../db');
const router = express.Router();

router.post('/createArtist' , async (req, res) => {
    const {artistId , name} = req.body;
    try {
        const result = await driver.excuteQuery(
            `MERGE (a:Artist {artistId: $artistId})` +
            `ON CTEATE SET a.name = $name` + 
            `RETURN a`,
            {artistId , name}
        );
        if (result.records.length > 0) {
            res.status(200).send('Artist Created or Artist already exists');
        } else {
            res.status(500).send('Error creating artist');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;