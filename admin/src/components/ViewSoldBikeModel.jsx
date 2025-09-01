import { Dialog } from "@headlessui/react";

const ViewSoldBikeModel = ({ isOpen, onClose, bike }) => {
  if (!bike) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {bike.brand} {bike.model} Details
          </Dialog.Title>

          {/* Images */}
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

          {/* Bike Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700 text-sm">
            <div><strong>Bike ID:</strong> {bike.bikeID}</div>
            <div><strong>Brand:</strong> {bike.brand}</div>
            <div><strong>Model:</strong> {bike.model}</div>
            <div><strong>Year:</strong> {bike.year}</div>
            <div><strong>Price:</strong> {bike.price?.toLocaleString() || "N/A"}</div>
            <div><strong>Sold For:</strong> {bike.soldFor?.toLocaleString() || "N/A"}</div>
            <div><strong>Mileage:</strong> {bike.mileage || "N/A"} km</div>
            <div><strong>Engine:</strong> {bike.engineCapacity || "N/A"} cc</div>
            <div><strong>Condition:</strong> {bike.condition}</div>
            <div><strong>Old Owner:</strong> {bike.ownerName || "N/A"}</div>
            <div><strong>New Owner:</strong> {bike.newOwnerName || "N/A"}</div>
            <div><strong>Contact:</strong> {bike.newOwnerContact || "N/A"}</div>
            <div><strong>Sold At:</strong> {new Date(bike.soldAt).toLocaleDateString()}</div>
            <div className="col-span-2"><strong>Description:</strong> {bike.description || "N/A"}</div>
          </div>

          {/* Documents */}
          {bike.documents && bike.documents.length > 0 && (
            <div className="mb-4">
              <strong>Documents:</strong>
              <ul className="list-disc ml-5 text-gray-700 text-sm mt-1">
                {bike.documents.map((doc, idx) => (
                  <li key={idx}>
                    {doc.type} ({doc.fileName})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewSoldBikeModel;
