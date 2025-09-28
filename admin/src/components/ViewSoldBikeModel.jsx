import { useState } from "react";

const ViewSoldBikeModel = ({ isOpen, onClose, bike }) => {
  const [activeTab, setActiveTab] = useState("info");

  if (!isOpen || !bike) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-auto overflow-y-auto max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {bike.brand} {bike.model} Details
        </h2>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {["info", "owner", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab === "info"
                ? "Bike Info"
                : tab === "owner"
                ? "Owner Info"
                : "Documents"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 text-gray-700 text-sm">
          {activeTab === "info" && (
            <>
              {bike.images && bike.images.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {bike.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`bike-${idx}`}
                      className="w-32 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Bike ID:</strong> {bike.bikeID}</div>
                <div><strong>Brand:</strong> {bike.brand}</div>
                <div><strong>Model:</strong> {bike.model}</div>
                <div><strong>Year:</strong> {bike.year}</div>
                <div><strong>Price:</strong> {bike.price?.toLocaleString() || "N/A"}</div>
                <div><strong>Sold For:</strong> {bike.soldFor?.toLocaleString() || "N/A"}</div>
                <div><strong>Mileage:</strong> {bike.mileage || "N/A"} km</div>
                <div><strong>Engine:</strong> {bike.engineCapacity || "N/A"} cc</div>
                <div><strong>Condition:</strong> {bike.condition}</div>
                <div className="col-span-2"><strong>Description:</strong> {bike.description || "N/A"}</div>
              </div>
            </>
          )}

          {activeTab === "owner" && (
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Old Owner:</strong> {bike.ownerName || "N/A"}</div>
              <div><strong>Old Contact:</strong> {bike.ownerContact || "N/A"}</div>
              <div><strong>New Owner:</strong> {bike.newOwnerName || "N/A"}</div>
              <div><strong>New Contact:</strong> {bike.newOwnerContact || "N/A"}</div>
              <div><strong>Sold At:</strong> {new Date(bike.soldAt).toLocaleDateString()}</div>
            </div>
          )}

          {activeTab === "documents" && (
            <div>
              {bike.documents && bike.documents.length > 0 ? (
                <ul className="list-disc ml-5 space-y-1">
                  {bike.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {doc.type} ({doc.fileName})
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No documents available</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSoldBikeModel;
