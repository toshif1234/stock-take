const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const fs = require('fs');
const csv = require('csv-parser');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    importCSV
};

async function getAll() {
    return await db.bin.findAll();
}

async function getById(id) {
    return await getBin(id);
}

async function create(params) {
    // validate
    if (await db.bin.findOne({ where: { 
        org_id: params.org_id,
        warehouse: params.warehouse,
        bin_id: params.bin_id,
        storage_type: params.storage_type,
        storage_sec: params.storage_sec
     } })) {
        throw 'this data already exiest.';
    }
    // const domainPart = params.user_id.split('@')[1];
    // const orgName = domainPart.split('.')[0];
    // if(orgName != params.org_id){
    //     throw 'user_id "' + params.user_id + '" does not match with org_id';
    // }

    const user = new db.bin(params);
    

    // save user
    await user.save();
}

async function update(id, params) {
    const user = await getBin(id);

    // validate
    // const usernameChanged = params.username && user.username !== params.username;
    // if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
    //     throw 'Username "' + params.username + '" is already taken';
    // }

    // hash password if it was entered
    // if (params.password) {
    //     params.passwordHash = await bcrypt.hash(params.password, 10);
    // }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}

async function _delete(id) {
    const user = await getBin(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.bin.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function importCSV(filePath) {
    const results = [];

    // Read the CSV file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Process each row in the CSV
            for (const row of results) {
                try {
                     await create(row); // Use the existing create function to add to the database
                } catch (error) {
                    console.error(`Error adding entry: ${error}`);
                }
            }
            console.log('CSV import completed.');
        });
}