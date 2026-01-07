const express = require('express')
const router = express.Router()
const ownerModel = require('../models/owner-model')

router.get('/', (req, res) => {
    res.send('hey, Owner')
})

if (process.env.NODE_ENV === 'development') {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(500).send("you dont have permissions...")
        }

        
        let {name, email, password} = req.body;
        let owner = await ownerModel.create({
            name,
            email,
            password
        }) 
        res.status(200).send(owner);

    })
}


module.exports = router;