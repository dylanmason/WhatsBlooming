const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config.json');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50 mb', extended: true}));

const connectDB = () => {
    try {
        mongoose.connect(`${config.DATABASE_URL}`, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("Connected to database!");
    } catch (err) {
        console.log("Error with connecting to database");
        console.log(err);
    }
}

connectDB();

const userCluster = new mongoose.Schema({ userName: 'String', password: 'String', profilePicture: 'String' }, { versionKey: false });
const userDB = mongoose.model('Users', userCluster);

const userData = new mongoose.Schema({ userName: 'String', flowerName: 'String', date: 'String', latitude: 'Number', longitude: 'Number', icon: 'String', image: 'String' }, { versionKey: false });
const dataDB = mongoose.model('Data', userData);

app.get('/api/userAuthentication', async (req, res) => {
    try {
        const userCredentials = await userDB.findOne({
            userName: `${req.query.userName}`,
        });
        if (userCredentials === null) {
            console.log("user not found");
            const match = {
                "found": "null"
            };
            res.send(match);
        }
        else {
            if (bcrypt.compareSync(req.query.password, userCredentials.password)) {
                console.log("true");
                const match = {
                    "found": "true"
                };
                res.send(match);
            }
            else {
                console.log("false");
                const match = {
                    "found": "null"
                };
                res.send(match);
            }
        }
    } catch (err) {
        res.send(err);
        console.log(err);
    }
});

app.post('/api/userSignUp', (req, res) => {
    const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            try {
                const found = await userDB.findOne({
                    userName: `${req.body.userName}`,
                });
                if (found === null) {
                    const userCredentials = await userDB.create({
            _id: mongoose.Types.ObjectId(),
                        userName: `${req.body.userName}`,
                        password: `${hash}`,
                        profilePicture: `${req.body.profilePicture}`
                    });
                    const match = {
                        "found": "available"
                    }
                    res.send(match);
                }
                else {
                    const match = {
                        "found": "unavailable"
                    }
                    res.send(match);
                }
                console.log(found)
            } catch (err) {
                res.send(err);
                console.log(err);
            }
        })
});

app.post('/api/uploadPost', async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const date = req.body.date;
    const userName = req.body.userName;
    const flowerName = req.body.flowerName;
    const icon = req.body.icon;
    const image = req.body.image;
    console.log('image is:', image);
    try {
        const postData = await dataDB.create({
            _id: mongoose.Types.ObjectId(),
            userName: `${userName}`,
            flowerName: `${flowerName}`,
            date: `${date}`,
            latitude: `${latitude}`,
            longitude: `${longitude}`,
            icon: `${icon}`,
            image: `${image}`,
        })
        const status = {
            "status": "success"
        }
        res.send(status);
    } catch (err) {
        res.send(err);
        console.log(err);
    }
});

app.get('/api/gatherPosts', async (req, res) => {
    try {
        const postData = await dataDB.find();
        console.log(postData);
        res.send(postData);
    } catch (err) {
        res.send(err);
        console.log(err);
    }
});

app.post('/api/updateAccount', async (req, res) => {
    const oldUserName = req.body.oldUserName;
    const newUserName = req.body.newUserName;
    const password = req.body.password;
    const profilePicture = req.body.profilePicture;
    const saltRounds = 10;
    let match;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        try {
            const found = await userDB.findOne({
                userName: `${req.query.userName}`,
            });
            if (found === null) {
                const update = await userDB.replaceOne({ userName: `${oldUserName}` }, { userName: `${newUserName}`, password: `${hash}`, profilePicture: `${profilePicture}` });
                match = {
                    "found": "available"
                }
            }
            else {
                match = {
                    "found": "unavailable"
                }
            }
            console.log(match);
            res.send(match);
        } catch (err) {
            res.send(err);
            console.log(err);
        }
    });
});

app.get('/api/userInfo', async (req, res) => {
    const userName = req.query.userName;
    console.log("searching for", userName);
    try {
        const userInfo = await userDB.findOne({
            userName: `${userName}`
        });
        console.log("here is the userInfo", userInfo);
        res.send(userInfo);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

app.get('/api/userPostData', async (req, res) => {
    const userName = req.query.userName;
    try {
        const userPosts = await dataDB.find({
            userName: `${userName}`
        });
        console.log(userPosts);
        res.send(userPosts);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
