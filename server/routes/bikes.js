const express = require('express');
const router = express.Router();
const {createBike, updateBike, getBikes, getBikeById, deleteBike, sellBike} = require('../controllers/bikeController');
const uploadBikeFiles = require('../middlewares/upload');
const {protect} = require('../middlewares/auth');

router.post('/', protect, uploadBikeFiles, createBike);
router.put('/:id', protect, uploadBikeFiles, updateBike);
router.get('/', getBikes);
router.get('/:id', getBikeById);
router.delete('/:id', protect, deleteBike);
router.post("/sell", sellBike);

module.exports = router;
