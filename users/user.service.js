const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const nodemailer = require('nodemailer');

function generateUser(data){
    let name=data.slice(0,4);
    const length = 2;
    const characters = '0123456789';
    let digit = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        digit += characters[randomIndex];
    }
    const userName= name + digit;
    return userName;
}

function generateRandomPassword(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'email "' + params.email + '" is already registered';
  }
 
  if (params.role == "Admin") {
    try {
        params.user_id = generateUser(params.org_id);
        const randomPassword = generateRandomPassword();
        params.password = randomPassword;
      // Create a transporter object using SMTP
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Replace with your SMTP server
        port: 587, // Usually 587 for TLS
        secure: false, // Set to true if using port 465
        auth: {
          user: "toshifpatil401@gmail.com", // Your email address
          pass: "nyhc mklw ltyl llym", // Your email password
        },
      });

      // Set up email data
      const mailOptions = {
        from: '"Stock-take-app" <toshifpatil401@gmail.com>', // Sender address
        to: params.email, // List of recipients
        subject: "Your Admin Username and Password", // Subject line
        text: "Username & Password" , // Plain text body
        html: "<a href='www.stellium.com'><img src='https://www.stellium.com/wp-content/uploads/2016/03/01_Full-Color-Logo.png' width='30%' /></a> <br><h3>Username: " + params.user_id + "</h3><h3> Password: " + params.password + "</h3><h4>Thank you for connecting to <a href='www.stellium.com'>stellium</a></h4> <br><br>" , // HTML body
      };

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log("Error occurred: " + error.message);
        }
        console.log("Message sent: %s", info.messageId);
        
        
      });
    } catch (err) {
      console.log(err);
    }
    // throw 'user_id "' + params.user_id + '" does not match with org_id';
  }
 

  const user = new db.User(params);

  // hash password
//   user.password = await bcrypt.hash(params.password, 10);

  // save user
  await user.save();
}

async function update(id, params) {
  const user = await getUser(id);

  // validate
  // const usernameChanged = params.username && user.username !== params.username;
  // if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
  //     throw 'Username "' + params.username + '" is already taken';
  // }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User not found";
  return user;
}
