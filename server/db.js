const neo4j = require('neo4j-driver');
require('dotenv').config();

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(URI , neo4j.auth.basic(USER , PASSWORD));

const dbfunc = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('Connected to Neo4j');
        
    } catch (error) {
        console.log(`Error in dbfunc: ${error}`);
        throw error;
        
    }
};

const createUser = async (userData) => {
    const { firstname , lastname , dob , gender , bio} = userData;
    const session = driver.session();
    try {
        const result = await session.run(
            `CREATE (USER:Person {
                firstname: $firstname,
                lastname: $lastname,
                dob: $dob,
                gender: $gender,
            bio; $bio}) RETURN USER`,
            { firstname , lastname , dob , gender , bio}
        );
        return result.records[0].get('USER');
    } catch (error) {
        console.log('Error in createUser:', error);
        throw error;
    } finally {
        await session.close();
    }
};

module.exports = {
    dbfunc,
    createUser,
};