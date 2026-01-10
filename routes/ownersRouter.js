const express = require('express')
const router = express.Router()
const ownerModel = require('../models/owner-model')
const upload = require('../config/multer-config')
const productModel = require('../models/productSchema')

router.get('/', (req, res) => {
    res.send('hey, Owner')
})

if (process.env.NODE_ENV === 'development') {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(500).send("you dont have permissions...")
        }


        let { name, email, password } = req.body;
        let owner = await ownerModel.create({
            name,
            email,
            password
        })
        res.status(200).send(owner);

    })
}

router.post('/createProduct', upload.single('image'), async (req, res) => {

    console.log(req.file);
    console.log(req.body)

    try {
        let product = await productModel.findOne({ name: req.body.name, discount: req.body.discount })
        if (!req.body) {
            return res.status(500).json({'success': false, "message": "all fields are require" })
        }

        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body
        if (!name || !price || !discount || !bgcolor || !panelcolor || !textcolor) {
            return res.status(500).json({'success': false, "message": "all fields are require" });
        }

        if (!product) {
            let prod = productModel.create({
                image: req.file.buffer,
                name,
                price,
                discount,
                bgcolor,
                panelcolor,
                textcolor
            })
            res.status(200).json({'success': true});
        }
        else{
            res.status(500).json({'success': false, "message": "product already present" })

        }
    } catch (err) {
        res.status(401).json({'success': false, "message": "something went wrong" })
    }




})


module.exports = router;