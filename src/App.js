import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useParams
} from "react-router-dom";
import axios from "axios";
import CertificateModal from "./CertificateModal";

// ==========================
// Login Component
// ==========================
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://n8n.kediritechnopark.my.id/webhook/login-account", {
        username,
        password
      });

      const token = res.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("Login successful. Token saved.");
        navigate("/dashboard");
      } else {
        alert("Login failed. Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// ==========================
// Add Course Modal Component
// ==========================
const AddCourseModal = ({ isOpen, onClose, courseData, setCourseData, handleCourseCreation }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 999
    }}>
      <div style={{ background: "white", padding: 20, borderRadius: 8, width: "400px" }}>
        <h3>Add New Course</h3>
        <input
          type="text"
          placeholder="Course Title"
          value={courseData.courseTitle}
          onChange={(e) => setCourseData({ ...courseData, courseTitle: e.target.value })}
        /><br />
        <input
          type="text"
          placeholder="Description"
          value={courseData.description}
          onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
        /><br />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleCourseCreation}>Create Course</button>
          <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ==========================
// Add Certificate Modal
// ==========================
const AddCertificateModal = ({
  isOpen,
  onClose,
  certificateData,
  setCertificateData,
  handleCertificateCreation,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
      justifyContent: "center", alignItems: "center", zIndex: 999
    }}>
      <div style={{ background: "white", padding: 20, borderRadius: 8, width: "400px" }}>
        <h3>Add New Certificate</h3>
        <input
          type="text"
          placeholder="Recipient Name"
          value={certificateData.recipientName}
          onChange={(e) => setCertificateData({ ...certificateData, recipientName: e.target.value })}
        /><br />
        <input
          type="text"
          placeholder="Course ID"
          value={certificateData.courseId}
          onChange={(e) => setCertificateData({ ...certificateData, courseId: e.target.value })}
        /><br />
        <input
          type="number"
          placeholder="Duration Hours"
          value={certificateData.durationHours}
          onChange={(e) => setCertificateData({ ...certificateData, durationHours: e.target.value })}
        /><br />
        <input
          type="date"
          placeholder="Issue Date"
          value={certificateData.issueDate}
          onChange={(e) => setCertificateData({ ...certificateData, issueDate: e.target.value })}
        /><br />
        <input
          type="date"
          placeholder="Valid Until"
          value={certificateData.validUntil}
          onChange={(e) => setCertificateData({ ...certificateData, validUntil: e.target.value })}
        /><br />
        <div style={{ marginTop: 10 }}>
          <button onClick={handleCertificateCreation}>Create Certificate</button>
          <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ==========================
// Dashboard Component
// ==========================

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    courseId: "",
    durationHours: "",
    issueDate: "",
    validUntil: "",
  });

  const [courseData, setCourseData] = useState({
    courseTitle: "",
    description: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
  try {
    const token = getAuthToken(); // Ambil token dari fungsi
    if (!token) return alert("No token found. Please log in.");

    const response = await axios.get(
      "https://n8n.kediritechnopark.my.id/webhook/get-dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const courseList = response.data[0]?.data?.data || [];
    setCourses(courseList);

    if (courseList.length > 0) {
      setSelectedCourseId(courseList[0].course_id);
      setSelectedCourse(courseList[0]);
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};


  const handleCourseChange = (event) => {
    const courseId = event.target.value;

    if (courseId === "add-course") {
      setShowCourseForm(true);
      return;
    }

    const course = courses.find((c) => c.course_id === courseId);
    setSelectedCourseId(courseId);
    setSelectedCourse(course || null);
  };

  const getAuthToken = () => localStorage.getItem("authToken");

  const handleCourseCreation = async () => {
    const token = getAuthToken();
    if (!token) return alert("No token found. Please log in.");

    try {
      const response = await axios.post(
        "https://n8n.kediritechnopark.my.id/webhook/create-course",
        {
          title: courseData.courseTitle,
          description: courseData.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Course created successfully.");
        setShowCourseForm(false);
        setCourseData({ courseTitle: "", description: "" });
        await fetchDashboardData();
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course.");
    }
  };

  const handleCertificateCreation = async () => {
    const token = getAuthToken();
    if (!token) return alert("No token found. Please log in.");

    try {
      const response = await axios.post(
        "https://n8n.kediritechnopark.my.id/webhook/create-certificate",
        certificateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Certificate created.");
        setShowCertificateForm(false);
        await fetchDashboardData();

        const updatedCourse = courses.find((c) => c.course_id === selectedCourseId);
        setSelectedCourse(updatedCourse || null);
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      alert("Failed to create certificate.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={selectedCourseId} onChange={handleCourseChange}>
            {courses.map((course) => (
              <option key={course.course_id} value={course.course_id}>
                {course.course_title || "(Untitled course)"}
              </option>
            ))}
            <option value="add-course">+ Add new course</option>
          </select>
          <span>
            {courses.length} Course{courses.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input type="text" placeholder="Go to file" />
          <button
            onClick={() => {
              setCertificateData({
                recipientName: "",
                courseId: selectedCourseId,
                durationHours: "",
                issueDate: "",
                validUntil: "",
              });
              setShowCertificateForm(true);
            }}
          >
            Add new certificate
          </button>
        </div>
      </header>

      <section style={{ borderTop: "1px solid #ddd" }}>
        {(selectedCourse?.recipients || []).length === 0 ? (
          <div style={{ padding: "10px", color: "#888" }}>
            No certificates found for this course.
          </div>
        ) : (
          selectedCourse.recipients.map((cert) => (
            <div
              key={cert.certificate_id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => setSelectedCertificate(cert)}
            >
              <span>{cert.certificate_id}</span>
              <span>{cert.recipient_name}</span>
              <span>{cert.issue_date}</span>
            </div>
          ))
        )}
      </section>

      {/* Modals */}
      <AddCertificateModal
        isOpen={showCertificateForm}
        onClose={() => setShowCertificateForm(false)}
        certificateData={certificateData}
        setCertificateData={setCertificateData}
        handleCertificateCreation={handleCertificateCreation}
      />

      <AddCourseModal
        isOpen={showCourseForm}
        onClose={() => setShowCourseForm(false)}
        courseData={courseData}
        setCourseData={setCourseData}
        handleCourseCreation={handleCourseCreation}
      />

      {selectedCertificate && (
        <CertificateModal
          isOpen={true}
          certificateDetails={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

// ==========================
// Certificate Wrapper
// ==========================
function CertificateWrapper() {
  const { id } = useParams();
  const [certificateDetails, setCertificateDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `https://n8n.kediritechnopark.my.id/webhook/get-certificate?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          setCertificateDetails(response.data[0].data);
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!certificateDetails) return <div>No certificate found</div>;

  return <CertificateModal isOpen={true} certificateDetails={certificateDetails} />;
}

// ==========================
// App Component
// ==========================
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/:id" element={<CertificateWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
