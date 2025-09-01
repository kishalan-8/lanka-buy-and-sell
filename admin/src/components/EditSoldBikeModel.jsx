import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";

const EditSoldBikeModel = ({ isOpen, onClose, bike, refreshSoldBikes }) => {
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerContact, setNewOwnerContact] = useState("");
  const [soldFor, setSoldFor] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (bike) {
      setNewOwnerName(bike.newOwnerName || "");
      setNewOwnerContact(bike.newOwnerContact || "");
      setSoldFor(bike.soldFor || "");
    }
  }, [bike]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/sold/${bike._id}`,
        { newOwnerName, newOwnerContact, soldFor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshSoldBikes();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!bike) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg p-6 z-10 w-full max-w-md mx-auto">
          <Dialog.Title className="text-xl font-bold mb-4">Edit Sold Bike</Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label>
              New Owner Name
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
                required
              />
            </label>
            <label>
              New Owner Contact
              <input
                type="text"
                className="w-full border rounded px-2 py-1"
                value={newOwnerContact}
                onChange={(e) => setNewOwnerContact(e.target.value)}
                required
              />
            </label>
            <label>
              Sold For
              <input
                type="number"
                className="w-full border rounded px-2 py-1"
                value={soldFor}
                onChange={(e) => setSoldFor(e.target.value)}
                required
              />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditSoldBikeModel;
