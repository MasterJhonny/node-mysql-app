const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.send("Hola este es my server, soy feliz");
})



module.exports = router;