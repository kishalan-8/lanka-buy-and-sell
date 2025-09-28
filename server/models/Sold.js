const mongoose = require('mongoose');

const soldSchema = new mongoose.Schema({
  bikeID: { type: String, required: true }, // UUID
  model: { type: String,  },
  year: { type: Number,  },
  price: { type: Number, },
  stock: { type: Number, },
  mileage: { type: Number },
  engineCapacity: { type: Number },
  brand: { type: String, enum: ['Yamaha', 'Suzuki', 'KTM', 'Bajaj', 'HeroHonda', 'Honda']},
  condition: { type: String, enum: ['new', 'used'], required: true },
  images: [{ type: String }],
  description: { type: String },
  createdby: { type: mongoose.Schema.Types.ObjectId, 
               ref: 'Admin'
            },
  ownerName: { type: String },
  ownerContact: { type: Number },
  createdAt: { type: Date, default: Date.now },
  documents: [ 
       {
          type: {
          type: String,
          enum: ['Bike Book', 'Revenue License', 'Insurance', 'Emmision Test','Transfer Document','Old Owner ID','New Owner ID'],
          required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }
],
newOwnerName: { type: String, },
newOwnerContact: { type: Number, },
soldAt: { type: Date, default: Date.now },
soldFor: { type: Number,},
});

module.exports = mongoose.model('Sold', soldSchema);
