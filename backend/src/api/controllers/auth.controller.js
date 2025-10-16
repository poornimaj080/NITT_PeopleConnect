import { getSession } from "../../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const session = getSession();

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    const result = await session.run(
      "MATCH (u:User {email: $email}) RETURN u, labels(u) as labels",
      { email }
    );

    if (result.records.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = result.records[0].get("u").properties;
    const userLabels = result.records[0].get("labels"); // Get labels from the result

    if (!user.password) {
      console.error(`User ${email} has no password in the database.`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userId = user.student_id || user.faculty_id;
    // UPDATED LOGIC: Check for the role in the 'userLabels' array
    const role = userLabels.includes("Student")
      ? "student"
      : userLabels.includes("Faculty")
      ? "faculty"
      : "user";

    const payload = {
      userId: userId,
      email: user.email,
      role: role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;

    res.status(200).json({
      message: "Login successful!",
      token: token, // Return raw token without "Bearer " prefix
      user: { ...user, role }, // Add the role to the user object sent to frontend
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  } finally {
    await session.close();
  }
};

export const getAllFaculty = async (req, res) => {
  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (f:Faculty)
       RETURN f.faculty_id as faculty_id, f.name as name, f.email as email
       ORDER BY f.name ASC`
    );

    const facultyList = result.records.map((record) => ({
      faculty_id: record.get("faculty_id"),
      name: record.get("name"),
      email: record.get("email"),
    }));

    res.status(200).json(facultyList);
  } catch (error) {
    console.error("Get Faculty List Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
