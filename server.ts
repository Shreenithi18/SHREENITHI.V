import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("college.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'admin', 'faculty', 'student'
    related_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll_no TEXT UNIQUE,
    section_id INTEGER,
    year INTEGER,
    dob TEXT,
    email TEXT,
    cgpa REAL DEFAULT 0,
    FOREIGN KEY(section_id) REFERENCES sections(id)
  );

  CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    faculty_id TEXT UNIQUE,
    is_tutor INTEGER DEFAULT 0,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS tutor_assignments (
    section_id INTEGER PRIMARY KEY,
    faculty_id INTEGER,
    FOREIGN KEY(section_id) REFERENCES sections(id),
    FOREIGN KEY(faculty_id) REFERENCES faculty(id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    hour INTEGER,
    status TEXT, -- 'present', 'absent'
    marked_by_faculty_id INTEGER,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(marked_by_faculty_id) REFERENCES faculty(id)
  );

  CREATE TABLE IF NOT EXISTS od_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    reason TEXT,
    letter_url TEXT,
    status TEXT DEFAULT 'submitted', -- 'submitted', 'tutor_verified', 'admin_approved', 'completed'
    date TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    priority TEXT, -- 'low', 'medium', 'high'
    audience TEXT, -- 'all', 'faculty', 'student'
    expiry_date TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    subject TEXT,
    score REAL,
    semester INTEGER,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS student_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    type TEXT, -- 'marksheet', 'aadhar', 'certificate'
    name TEXT,
    url TEXT,
    uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS faculty_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    faculty_id INTEGER,
    subject TEXT,
    topic TEXT,
    content TEXT, -- Could be a URL or text
    date TEXT,
    FOREIGN KEY(faculty_id) REFERENCES faculty(id)
  );

  CREATE TABLE IF NOT EXISTS hostels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE, -- 'Boys Hostel', 'Girls Hostel'
    warden_id INTEGER,
    FOREIGN KEY(warden_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS hostel_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    status TEXT, -- 'present', 'absent'
    marked_by INTEGER, -- warden_id
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(marked_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS buses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_no TEXT UNIQUE,
    route_name TEXT,
    driver_id INTEGER,
    FOREIGN KEY(driver_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bus_attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    bus_id INTEGER,
    date TEXT,
    session TEXT, -- 'morning', 'evening'
    status TEXT, -- 'present', 'absent'
    marked_by INTEGER, -- driver_id
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(bus_id) REFERENCES buses(id),
    FOREIGN KEY(marked_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS student_transport_info (
    student_id INTEGER PRIMARY KEY,
    type TEXT, -- 'hostel', 'dayscholar'
    hostel_id INTEGER,
    bus_id INTEGER,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(hostel_id) REFERENCES hostels(id),
    FOREIGN KEY(bus_id) REFERENCES buses(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty or missing key users
const seedData = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  
  // Always ensure admin exists
  const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin'").get();
  if (!adminExists) {
    db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "admin");
  }

  // Sections
  const sections = ["CSE A", "CSE B", "CSE C", "CSE D"];
  sections.forEach(s => db.prepare("INSERT OR IGNORE INTO sections (name) VALUES (?)").run(s));

  // Default Student
  const studentExists = db.prepare("SELECT id FROM users WHERE username = '21CS001'").get();
  if (!studentExists) {
    const studentId = db.prepare("INSERT INTO students (name, roll_no, section_id, year, dob, email) VALUES (?, ?, ?, ?, ?, ?)").run(
      "John Doe", "21CS001", 1, 3, "2003-05-15", "john.doe@example.com"
    ).lastInsertRowid;
    db.prepare("INSERT INTO users (username, password, role, related_id) VALUES (?, ?, ?, ?)").run(
      "21CS001", "student123", "student", studentId
    );
    
    // Assign to transport
    db.prepare("INSERT OR REPLACE INTO student_transport_info (student_id, type, hostel_id, bus_id) VALUES (?, ?, ?, ?)").run(
      studentId, "hostel", 1, 1
    );
  }

  // Default Faculty
  const facultyExists = db.prepare("SELECT id FROM users WHERE username = 'FAC001'").get();
  if (!facultyExists) {
    const facultyId = db.prepare("INSERT INTO faculty (name, faculty_id, is_tutor, email) VALUES (?, ?, ?, ?)").run(
      "Dr. Smith", "FAC001", 1, "smith@example.com"
    ).lastInsertRowid;
    db.prepare("INSERT INTO users (username, password, role, related_id) VALUES (?, ?, ?, ?)").run(
      "FAC001", "faculty123", "faculty", facultyId
    );
    db.prepare("INSERT OR REPLACE INTO tutor_assignments (section_id, faculty_id) VALUES (?, ?)").run(1, facultyId);
  }

  // Hostels
  db.prepare("INSERT OR IGNORE INTO hostels (name) VALUES (?)").run("Boys Hostel");
  db.prepare("INSERT OR IGNORE INTO hostels (name) VALUES (?)").run("Girls Hostel");

  // Warden Users
  const wardenExists = db.prepare("SELECT id FROM users WHERE username = 'warden_boys'").get();
  if (!wardenExists) {
    db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)").run("warden_boys", "warden123", "warden_boys");
    db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)").run("warden_girls", "warden123", "warden_girls");
  }

  // Bus Manager
  const managerExists = db.prepare("SELECT id FROM users WHERE username = 'bus_manager'").get();
  if (!managerExists) {
    db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)").run("bus_manager", "manager123", "bus_manager");
  }

  // Bus Driver & Bus
  const driverExists = db.prepare("SELECT id FROM users WHERE username = 'driver01'").get();
  if (!driverExists) {
    const driverId = db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)").run("driver01", "driver123", "bus_driver").lastInsertRowid;
    db.prepare("INSERT OR IGNORE INTO buses (bus_no, route_name, driver_id) VALUES (?, ?, ?)").run("BUS-01", "Route A - City Center", driverId);
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }
    const user = db.prepare("SELECT id, username, role, related_id FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      let details = null;
      if (user.role === 'student' && user.related_id) {
        details = db.prepare("SELECT * FROM students WHERE id = ?").get(user.related_id);
      } else if (user.role === 'faculty' && user.related_id) {
        details = db.prepare("SELECT * FROM faculty WHERE id = ?").get(user.related_id);
      }
      res.json({ success: true, user: { ...user, details } });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  });

  // Admin APIs
  app.get("/api/admin/stats", (req, res) => {
    const students = db.prepare("SELECT COUNT(*) as count FROM students").get() as any;
    const faculty = db.prepare("SELECT COUNT(*) as count FROM faculty").get() as any;
    const tutors = db.prepare("SELECT COUNT(*) as count FROM faculty WHERE is_tutor = 1").get() as any;
    const announcements = db.prepare("SELECT COUNT(*) as count FROM announcements WHERE expiry_date >= date('now')").get() as any;
    res.json({
      totalStudents: students.count,
      totalFaculty: faculty.count,
      tutorsCount: tutors.count,
      activeAnnouncements: announcements.count
    });
  });

  app.get("/api/students", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, sec.name as section_name 
      FROM students s 
      LEFT JOIN sections sec ON s.section_id = sec.id
    `).all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { name, roll_no, section_id, year, dob, email, password } = req.body;
    try {
      const result = db.prepare("INSERT INTO students (name, roll_no, section_id, year, dob, email) VALUES (?, ?, ?, ?, ?, ?)").run(name, roll_no, section_id, year, dob, email);
      db.prepare("INSERT INTO users (username, password, role, related_id) VALUES (?, ?, ?, ?)").run(roll_no, password || "student123", "student", result.lastInsertRowid);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.get("/api/faculty", (req, res) => {
    const faculty = db.prepare("SELECT * FROM faculty").all();
    res.json(faculty);
  });

  app.post("/api/faculty", (req, res) => {
    const { name, faculty_id, is_tutor, email, password } = req.body;
    try {
      const result = db.prepare("INSERT INTO faculty (name, faculty_id, is_tutor, email) VALUES (?, ?, ?, ?)").run(name, faculty_id, is_tutor ? 1 : 0, email);
      db.prepare("INSERT INTO users (username, password, role, related_id) VALUES (?, ?, ?, ?)").run(faculty_id, password || "faculty123", "faculty", result.lastInsertRowid);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.get("/api/sections", (req, res) => {
    const sections = db.prepare("SELECT * FROM sections").all();
    res.json(sections);
  });

  app.get("/api/tutor-assignments", (req, res) => {
    const assignments = db.prepare(`
      SELECT ta.*, s.name as section_name, f.name as faculty_name 
      FROM tutor_assignments ta
      JOIN sections s ON ta.section_id = s.id
      JOIN faculty f ON ta.faculty_id = f.id
    `).all();
    res.json(assignments);
  });

  app.post("/api/tutor-assignments", (req, res) => {
    const { section_id, faculty_id } = req.body;
    db.prepare("INSERT OR REPLACE INTO tutor_assignments (section_id, faculty_id) VALUES (?, ?)").run(section_id, faculty_id);
    db.prepare("UPDATE faculty SET is_tutor = 1 WHERE id = ?").run(faculty_id);
    res.json({ success: true });
  });

  app.get("/api/announcements", (req, res) => {
    const { audience } = req.query;
    let query = "SELECT * FROM announcements WHERE expiry_date >= date('now') OR expiry_date IS NULL";
    let params: any[] = [];
    if (audience && audience !== 'all') {
      query += " AND (audience = ? OR audience = 'all')";
      params.push(audience);
    }
    const announcements = db.prepare(query).all(...params);
    res.json(announcements);
  });

  app.post("/api/announcements", (req, res) => {
    const { title, content, priority, audience, expiry_date } = req.body;
    db.prepare("INSERT INTO announcements (title, content, priority, audience, expiry_date) VALUES (?, ?, ?, ?, ?)").run(title, content, priority, audience, expiry_date);
    res.json({ success: true });
  });

  // Faculty APIs
  app.post("/api/attendance", (req, res) => {
    const { student_ids, date, hour, faculty_id, section_id } = req.body;
    // student_ids is an array of { id, status }
    const stmt = db.prepare("INSERT INTO attendance (student_id, date, hour, status, marked_by_faculty_id) VALUES (?, ?, ?, ?, ?)");
    const transaction = db.transaction((data) => {
      for (const item of data) {
        stmt.run(item.id, date, hour, item.status, faculty_id);
      }
    });
    transaction(student_ids);
    res.json({ success: true });
  });

  app.get("/api/tutor/students/:faculty_id", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, sec.name as section_name 
      FROM students s
      JOIN sections sec ON s.section_id = sec.id
      JOIN tutor_assignments ta ON sec.id = ta.section_id
      WHERE ta.faculty_id = ?
    `).all(req.params.faculty_id);
    res.json(students);
  });

  app.get("/api/od-requests", (req, res) => {
    const { faculty_id, role } = req.query;
    let query = `
      SELECT od.*, s.name as student_name, s.roll_no, sec.name as section_name
      FROM od_requests od
      JOIN students s ON od.student_id = s.id
      JOIN sections sec ON s.section_id = sec.id
    `;
    let params: any[] = [];
    if (role === 'faculty') {
      query += " JOIN tutor_assignments ta ON sec.id = ta.section_id WHERE ta.faculty_id = ?";
      params.push(faculty_id);
    }
    const requests = db.prepare(query).all(...params);
    res.json(requests);
  });

  app.post("/api/od-requests/status", (req, res) => {
    const { id, status } = req.body;
    db.prepare("UPDATE od_requests SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  });

  // Student APIs
  app.get("/api/student/dashboard/:student_id", (req, res) => {
    const student = db.prepare("SELECT * FROM students WHERE id = ?").get(req.params.student_id) as any;
    const attendance = db.prepare("SELECT status FROM attendance WHERE student_id = ?").all(req.params.student_id) as any[];
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const percentage = total > 0 ? (present / total) * 100 : 100;
    
    res.json({
      student,
      attendancePercentage: percentage.toFixed(2),
    });
  });

  app.post("/api/student/od-request", (req, res) => {
    const { student_id, reason, date, letter_url } = req.body;
    db.prepare("INSERT INTO od_requests (student_id, reason, date, letter_url) VALUES (?, ?, ?, ?)").run(student_id, reason, date, letter_url);
    res.json({ success: true });
  });

  app.get("/api/student/academic/:student_id", (req, res) => {
    const records = db.prepare("SELECT * FROM academic_records WHERE student_id = ?").all(req.params.student_id);
    res.json(records);
  });

  // Student Documents APIs
  app.get("/api/student/documents/:student_id", (req, res) => {
    const docs = db.prepare("SELECT * FROM student_documents WHERE student_id = ?").all(req.params.student_id);
    res.json(docs);
  });

  app.post("/api/student/documents", (req, res) => {
    const { student_id, type, name, url } = req.body;
    db.prepare("INSERT INTO student_documents (student_id, type, name, url) VALUES (?, ?, ?, ?)").run(student_id, type, name, url);
    res.json({ success: true });
  });

  // Faculty Notes APIs
  app.get("/api/faculty/notes/:faculty_id", (req, res) => {
    const notes = db.prepare("SELECT * FROM faculty_notes WHERE faculty_id = ?").all(req.params.faculty_id);
    res.json(notes);
  });

  app.post("/api/faculty/notes", (req, res) => {
    const { faculty_id, subject, topic, content, date } = req.body;
    db.prepare("INSERT INTO faculty_notes (faculty_id, subject, topic, content, date) VALUES (?, ?, ?, ?, ?)").run(faculty_id, subject, topic, content, date);
    res.json({ success: true });
  });

  // Mark Analysis API
  app.get("/api/admin/mark-analysis", (req, res) => {
    const analysis = db.prepare(`
      SELECT 
        s.name as student_name,
        s.roll_no,
        sec.name as section_name,
        AVG(ar.score) as average_score,
        COUNT(ar.id) as subjects_count
      FROM students s
      JOIN sections sec ON s.section_id = sec.id
      LEFT JOIN academic_records ar ON s.id = ar.student_id
      GROUP BY s.id
    `).all();
    res.json(analysis);
  });

  // Hostel APIs
  app.get("/api/hostel/students/:hostel_name", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, sec.name as section_name 
      FROM students s
      JOIN sections sec ON s.section_id = sec.id
      JOIN student_transport_info sti ON s.id = sti.student_id
      JOIN hostels h ON sti.hostel_id = h.id
      WHERE h.name = ?
    `).all(req.params.hostel_name);
    res.json(students);
  });

  app.post("/api/hostel/attendance", (req, res) => {
    const { student_ids, date, warden_id } = req.body;
    const stmt = db.prepare("INSERT INTO hostel_attendance (student_id, date, status, marked_by) VALUES (?, ?, ?, ?)");
    const transaction = db.transaction((data) => {
      for (const item of data) {
        stmt.run(item.id, date, item.status, warden_id);
      }
    });
    transaction(student_ids);
    res.json({ success: true });
  });

  // Bus APIs
  app.get("/api/bus/students/:driver_id", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, sec.name as section_name, b.bus_no, b.id as bus_id
      FROM students s
      JOIN sections sec ON s.section_id = sec.id
      JOIN student_transport_info sti ON s.id = sti.student_id
      JOIN buses b ON sti.bus_id = b.id
      WHERE b.driver_id = ?
    `).all(req.params.driver_id);
    res.json(students);
  });

  app.post("/api/bus/attendance", (req, res) => {
    const { student_ids, date, session, driver_id, bus_id } = req.body;
    const stmt = db.prepare("INSERT INTO bus_attendance (student_id, bus_id, date, session, status, marked_by) VALUES (?, ?, ?, ?, ?, ?)");
    const transaction = db.transaction((data) => {
      for (const item of data) {
        stmt.run(item.id, bus_id, date, session, item.status, driver_id);
      }
    });
    transaction(student_ids);
    res.json({ success: true });
  });

  app.get("/api/admin/transport-stats", (req, res) => {
    const hostelCount = db.prepare("SELECT COUNT(*) as count FROM student_transport_info WHERE type = 'hostel'").get() as any;
    const busCount = db.prepare("SELECT COUNT(*) as count FROM student_transport_info WHERE type = 'dayscholar'").get() as any;
    res.json({
      hostelStudents: hostelCount.count,
      busStudents: busCount.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
