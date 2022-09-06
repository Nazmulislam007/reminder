require('dotenv').config('');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const crone = require('node-cron');

const dateYear = new Date().getFullYear();
const dateMonth = new Date().getMonth() + 1;
const dateDay = new Date().getDate();

const users = [
    {
        id: 2,
        name: 'Nazmul',
        dob: '6-9-2000',
        email: 'nazmulislam.ni897@gmail.com',
    },
    {
        id: 1,
        name: 'Nahid',
        dob: '6-9-2004',
        email: 'nazmulislam.ni798@gmail.com',
    },
];

// eslint-disable-next-line prettier/prettier
const {
 CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN
} = process.env;

const oauthToClinet = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

oauthToClinet.setCredentials({ refresh_token: REFRESH_TOKEN });

// eslint-disable-next-line consistent-return
const wishes = () => {
    users.map((user) => {
        const sendMail = async () => {
            try {
                const accessToken = await oauthToClinet.getAccessToken();

                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: '19ace007bsmrstu@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken,
                    },
                });

                const d = user.dob.split('-');
                const day = +d[0];
                const month = +d[1];
                const age = dateYear - +d[2];

                if (dateDay === day && dateMonth === month) {
                    const mailOptions = {
                        from: 'Nazmul <19ace007bsmrstu@gmail.com>',
                        to: user.email,
                        subject: 'Happy Birthday',
                        text: 'this is the text',
                        html: `Wishing You a <b>Happy birthday ${user.name}</b> On Your ${age}, Enjoy your day \n <small>this is auto generated</small>`,
                    };
                    const result = await transport.sendMail(mailOptions);
                    return result;
                }
            } catch (error) {
                console.log(error);
            }
            return true;
        };
        sendMail()
            .then((result) => console.log(`result: ${result}`))
            .catch((err) => console.log(err.message));
        return true;
    });
};

crone.schedule('*/15 * * * * *', wishes);
// const sendMail = async () => {
//     try {
//         const accessToken = await oauthToClinet.getAccessToken();

//         const transport = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 type: 'OAuth2',
//                 user: '19ace007bsmrstu@gmail.com',
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken,
//             },
//         });

//         const mailOptions = {
//             from: 'Nazmul <19ace007bsmrstu@gmail.com>',
//             to: 'nazmulislam.ni897@gmail.com',
//             subject: 'hellow mail',
//             text: 'this is the text',
//             html: '<h1>Hellow all</h1>',
//         };

//         const result = await transport.sendMail(mailOptions);
//         return result;
//     } catch (error) {
//         return console.log(error);
//     }
// };

// sendMail()
//     .then((result) => console.log(`result: ${result}`))
//     .catch((err) => console.log(err.message));
