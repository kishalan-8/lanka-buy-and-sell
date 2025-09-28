import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Edit2, FileText, Plus, Eye } from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";

import EditSoldBikeModel from "../components/EditSoldBikeModel";
import ViewSoldBikeModel from "../components/ViewSoldBikeModel";

const SoldBikesPage = () => {
  const [soldBikes, setSoldBikes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditSoldOpen, setIsEditSoldOpen] = useState(false);
  const [editSoldBikeData, setEditSoldBikeData] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewSoldBike, setViewSoldBike] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSoldBikes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sold", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSoldBikes(res.data);
    } catch (err) {
      console.error("Error fetching sold bikes:", err);
    }
  };

  useEffect(() => {
    fetchSoldBikes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sold record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sold/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSoldBikes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sold record");
    }
  };

  const handleEdit = (bike) => {
    setEditSoldBikeData(bike);
    setIsEditSoldOpen(true);
  };

  const handleView = (bike) => {
    setViewSoldBike(bike);
    setIsViewOpen(true);
  };

  const generateAllSoldReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sold Bikes Report", 10, 20);
    doc.setFontSize(12);
    let y = 30;

    soldBikes.forEach((bike, index) => {
      doc.text(`${index + 1}. ${bike.brand} ${bike.model}`, 10, y);
      y += 8;
      const fields = [
        ["Bike ID", bike.bikeID],
        ["Brand", bike.brand],
        ["Model", bike.model],
        ["Year", bike.year],
        ["Price", bike.price],
        ["Sold For", bike.soldFor],
        ["Mileage", bike.mileage],
        ["Engine", bike.engineCapacity],
        ["Condition", bike.condition],
        ["Old Owner", bike.ownerName],
        ["New Owner", bike.newOwnerName],
        ["Contact", bike.newOwnerContact],
        ["Sold At", new Date(bike.soldAt).toLocaleDateString()],
        ["Description", bike.description || "N/A"],
      ];
      fields.forEach(([label, value]) => {
        doc.text(`${label}: ${value || "N/A"}`, 12, y);
        y += 6;
      });

      if (bike.documents && bike.documents.length > 0) {
        doc.text("Documents:", 12, y);
        y += 6;
        bike.documents.forEach((docItem, idx) => {
          doc.text(`${idx + 1}. ${docItem.type} (${docItem.fileName})`, 14, y);
          y += 6;
        });
      }

      y += 4;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("Sold_Bikes_Report.pdf");
  };

  const filteredBikes =
    filter === "All"
      ? soldBikes
      : soldBikes.filter((b) => b.condition === filter);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sold Bikes</h2>
        <div className="flex gap-2">
          <button
            onClick={generateAllSoldReport}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300 transition"
          >
            <FileText size={14} className="text-blue-500" /> Generate Report
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex gap-2 mb-6">
        {["All", "new", "used"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded text-sm ${
              filter === status
                ? "bg-gray-400 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search..."
          className="ml-auto px-3 py-1 border rounded text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sold Bike Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBikes.length === 0 && <div>No sold bikes found.</div>}
        {filteredBikes.map((bike) => (
          <motion.div
            key={bike._id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col relative border border-gray-200"
            whileHover={{ y: -5 }}
          >
            {/* Condition Badge */}
            <span
              className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
                bike.condition === "new"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {bike.condition}
            </span>

            {/* Images */}
            {bike.images && bike.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {bike.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`bike-${idx}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <h3 className="font-bold text-lg mb-1">
              {bike.brand} {bike.model}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Sold for LKR {bike.soldFor?.toLocaleString()}
            </p>

            <div className="flex flex-wrap gap-2 text-gray-700 text-sm mb-2">
              <span>Year: {bike.year}</span>
              <span>Mileage: {bike.mileage}</span>
              <span>Engine: {bike.engineCapacity}</span>
              <span>Old Owner: {bike.ownerName}</span>
              <span>New Owner: {bike.newOwnerName}</span>
              <span>Contact: {bike.newOwnerContact}</span>
              <span>Sold At: {new Date(bike.soldAt).toLocaleDateString()}</span>
              <span>Description: {bike.description || "N/A"}</span>
            </div>

            {/* Documents */}
            {bike.documents && bike.documents.length > 0 && (
              <div className="mb-2">
                <strong>Documents:</strong>
                <ul className="list-disc ml-5 text-gray-700 text-sm">
                  {bike.documents.map((doc, idx) => (
                    <li key={idx}>
                      {doc.type} ({doc.fileName})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                onClick={() => handleEdit(bike)}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition"
              >
                <Edit2 size={14} className="text-blue-500" /> Edit
              </button>
              <button
                onClick={() => handleDelete(bike._id)}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition"
              >
                <Trash2 size={14} className="text-blue-500" /> Delete
              </button>
              <button
                onClick={() => handleView(bike)}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition"
              >
                <Eye size={14} className="text-blue-500" /> View
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <EditSoldBikeModel
        isOpen={isEditSoldOpen}
        onClose={() => setIsEditSoldOpen(false)}
        refreshSoldBikes={fetchSoldBikes}
        bike={editSoldBikeData}
      />
      <ViewSoldBikeModel
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        bike={viewSoldBike}
      />
    </div>
  );
};

export default SoldBikesPage;
