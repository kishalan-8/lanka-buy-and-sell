import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const SellBikeModel = ({ isOpen, onClose, bike, refreshBikes }) => {
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    newOwnerName: "",
    newOwnerContact: "",
    soldFor: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.newOwnerName || !form.newOwnerContact || !form.soldFor) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/sold/${bike._id}/sell`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Bike sold successfully!");
      refreshBikes();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to sell bike");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl w-full max-w-md p-6 relative"
      >
        <h2 className="text-xl font-bold mb-4">Sell {bike.brand} {bike.model}</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="newOwnerName"
            placeholder="New Owner Name"
            value={form.newOwnerName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="newOwnerContact"
            placeholder="New Owner Contact"
            value={form.newOwnerContact}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="soldFor"
            placeholder="Selling Price"
            value={form.soldFor}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={loading}
          >
            {loading ? "Selling..." : "Sell Bike"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SellBikeModel;
