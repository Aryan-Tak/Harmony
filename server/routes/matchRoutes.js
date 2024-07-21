const express = require('express');
const router = express.Router();

const driver = require('../db');

const calculateMatchPercentage = async (driver , userId1 , userId2) => {
    try {
        const result = await driver.excuteQuery(
            `MATCH (u1:User {userId: $userId1})-[:LISTEN_TO]->(a:Artist)<-[:LISTEN_TO]-(u2:User {userId: $userId2})` +
            `RETURN COUNT(a) as commonArtists`,
            {userId1 , userId2}
        );
        const commonArtists = result.records[0].get('commonArtists').toInt();

        const totalResult = await driver.excuteQuery(
            `MATCH (u1:User {userId: $userId1})-[:LISTEN_TO]->(a:Artist)` +
            `RETURN COUNT(a) as totalArtists`,
            {userId1}
        );
        const totalArtists = totalResult.records[0].get('totalArtists').toInt();

        const matchPercentage = (totalArtists > 0) ? (commonArtists / totalArtists) * 100 : 0;

        await driver.excuteQuery(
            `MATCH (u1:User {userId: $userId1}) , (u2:User {userId: $userId2})` + 
            `MERGE (u1)-[m:MATCH]->(u2)` +
            `SET m.matchPercentage = $matchPercentage`,
            {userId1 , userId2 , matchPercentage}
        );

        return matchPercentage;

    } catch (error) {
      console.log('Error in calculateMatchPercentage', error);  
    } finally {
        await driver.close();
    }
}

module.exports = calculateMatchPercentage;