import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";
import EditSubmissionModel from "../components/EditSumbissionModel";
import ViewSubmissionModel from "../components/ViewSubmissionModel";

const AdminSubmissionsPage = () => {
  const token = localStorage.getItem("token");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/submissions", {
        headers: { Authorization: `Bearer ${token}` },
        params: filter !== "all" ? { status: filter } : {},
      });

      setSubmissions(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error fetching submissions", err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  // Approve / Reject / Delete
  const updateSubmissionStatus = async (id, action) => {
    try {
      const url =
        action === "approve"
          ? `http://localhost:5000/api/submissions/${id}/approve`
          : `http://localhost:5000/api/submissions/${id}/reject`;

      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchSubmissions();
    } catch (err) {
      console.error(`Error updating submission (${action})`, err);
    }
  };

  const deleteSubmission = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/submissions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubmissions();
    } catch (err) {
      console.error("Error deleting submission", err);
    }
  };

  // Generate PDF for all submissions
  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Submissions Report", 20, 20);

    submissions.forEach((s, i) => {
      doc.text(
        `${i + 1}. ${s.brand} ${s.model} (${s.year}) - ${s.status.toUpperCase()}`,
        20,
        30 + i * 10
      );
    });

    doc.save("submissions-report.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Submissions</h1>
        <button
          onClick={generateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Generate Report
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <motion.div
            key={submission._id}
            whileHover={{ scale: 1.02 }}
            className="border rounded-lg shadow-lg p-4 bg-white relative flex flex-col"
          >
            {/* Status badge */}
            <span
              className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
                submission.status === "approved"
                  ? "bg-green-200 text-green-800"
                  : submission.status === "rejected"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {submission.status}
            </span>

            {/* Images */}
            {submission.images && submission.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {submission.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`bike-${idx}`}
                    className="w-32 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <h2 className="text-lg font-semibold">
              {submission.brand} {submission.model}
            </h2>
            <p className="text-sm text-gray-600">{submission.year}</p>
            <p className="text-sm text-gray-600 mb-2">{submission.description}</p>

            <div className="flex justify-between text-sm text-gray-700">
              <span>Price: Rs. {submission.price?.toLocaleString() || "N/A"}</span>
              <span>Mileage: {submission.mileage || "N/A"} km</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Engine: {submission.engineCapacity || "N/A"} cc</span>
              <span>Owner: {submission.ownerName || "N/A"}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setSelectedSubmission(submission);
                  setIsViewOpen(true);
                }}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                <Eye className="w-4 h-4 inline mr-1" /> View
              </button>
              <button
                onClick={() => {
                  setSelectedSubmission(submission);
                  setIsEditOpen(true);
                }}
                className="px-3 py-1 bg-blue-200 hover:bg-blue-300 rounded text-sm"
              >
                <Edit2 className="w-4 h-4 inline mr-1" /> Edit
              </button>

              {submission.status === "pending" && (
              <>
              <button
                onClick={() => updateSubmissionStatus(submission._id, "approve")}
                className="px-3 py-1 bg-green-200 hover:bg-green-300 rounded text-sm"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
              </button>
              <button
                onClick={() => updateSubmissionStatus(submission._id, "reject")}
                className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded text-sm"
              >
                <XCircle className="w-4 h-4 inline mr-1" /> Reject
              </button>
              </>
              )}
              
              <button
                onClick={() => deleteSubmission(submission._id)}
                className="px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditSubmissionModel
          submission={selectedSubmission}
          setIsOpen={setIsEditOpen}
          refresh={fetchSubmissions}
        />
      )}

      {/* View Modal */}
      {isViewOpen && (
        <ViewSubmissionModel
          submission={selectedSubmission}
          setIsOpen={setIsViewOpen}
        />
      )}
    </div>
  );
};

export default AdminSubmissionsPage;
