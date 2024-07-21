const express = require('express');
const router = express.Router();
const driver = require('../db');

router.post('/listenTo' , async (req , res) => {
    const { userId , topArtist} = req.body; 

    try {
        for(const artist of topArtist){
            const {artistId , name} = artist;

            await driver.excuteQuery(
                `MERGE (a:Artist {artistId : $artistId})` +
                `ON CREATE SET a.name = $name`,
                {artistId , name}
            );

            await driver.excuteQuery(
                `MATCH (u:User {userId : $userId})` +
                `MATCH (a:Artist {artistId : $artistId})` +
                `MERGE (u)-[:LISTEN_TO]->(a)`,
                {userId , artistId}
            );
        }
        res.status(200).send('Relationship Created ,Listening to top artists');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        await driver.close();
    }
})