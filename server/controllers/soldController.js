const Sold = require("../models/Sold");
const Bike = require("../models/Bike");

// Sell bike (decrease stock, add to Sold, delete if stock = 0)
exports.sellBike = async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { newOwnerName, newOwnerContact, soldFor, documents } = req.body;

    // Find the bike
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });

    // Create Sold record
    const soldBike = new Sold({
      bikeID: bike.bikeID,
      model: bike.model,
      year: bike.year,
      price: bike.price,
      stock: 1, // each sale reduces by 1
      mileage: bike.mileage,
      engineCapacity: bike.engineCapacity,
      brand: bike.brand,
      condition: bike.condition,
      images: bike.images,
      description: bike.description,
      createdby: bike.createdby,
      ownerName: bike.ownerName,
      ownerContact: bike.ownerContact,
      documents: documents || bike.documents,
      newOwnerName,
      newOwnerContact,
      soldFor,
    });

    await soldBike.save();

    // Decrease stock by 1
    bike.stock = bike.stock - 1;

    if (bike.stock <= 0) {
      await Bike.findByIdAndDelete(bike._id);
    } else {
      await bike.save();
    }

    res.json({ message: "Bike sold successfully", soldBike });
  } catch (error) {
    console.error("Error selling bike:", error);
    res.status(500).json({ message: "Error selling bike", error });
  }
};

// Get all sold bikes
exports.getSoldBikes = async (req, res) => {
  try {
    const soldBikes = await Sold.find().sort({ soldAt: -1 });
    res.json(soldBikes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sold bikes", error });
  }
};

// Edit sold bike
exports.updateSoldBike = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSoldBike = await Sold.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSoldBike) {
      return res.status(404).json({ message: "Sold bike not found" });
    }

    res.json({ message: "Sold bike updated", updatedSoldBike });
  } catch (error) {
    res.status(500).json({ message: "Error updating sold bike", error });
  }
};

// Delete sold bike (optional)
exports.deleteSoldBike = async (req, res) => {
  try {
    const { id } = req.params;
    await Sold.findByIdAndDelete(id);
    res.json({ message: "Sold bike deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sold bike", error });
  }
};
