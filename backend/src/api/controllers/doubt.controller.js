import { getSession } from "../../config/db.js";

export const submitDoubt = async (req, res) => {
  const { question, facultyId } = req.body; // Expects the faculty_id to whom the doubt is directed
  const { userId } = req.user; // This is the student_id
  const session = getSession();

  if (!question || !facultyId) {
    return res
      .status(400)
      .json({ message: "Question and faculty ID are required." });
  }

  try {
    const result = await session.run(
      `MATCH (s:Student {student_id: $userId})
       MATCH (f:Faculty {faculty_id: $facultyId})
       CREATE (s)-[:ASKS]->(d:Doubt {
         doubt_id: randomUUID(),
         question: $question,
         status: 'open',
         createdAt: datetime() 
       })-[:TO]->(f)
       RETURN d`,
      { userId, facultyId, question }
    );

    const newDoubt = result.records[0].get("d").properties;
    res.status(201).json(newDoubt);
  } catch (error) {
    console.error("Submit Doubt Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const answerDoubt = async (req, res) => {
  const { doubtId } = req.params;
  const { answer } = req.body;
  const { userId } = req.user; // This is the faculty_id
  const session = getSession();

  if (!answer) {
    return res.status(400).json({ message: "Answer cannot be empty." });
  }

  try {
    const result = await session.run(
      `MATCH (f:Faculty {faculty_id: $userId})
       MATCH (d:Doubt {doubt_id: $doubtId})
       // Ensure this faculty is the one the doubt was directed TO
       WHERE (d)-[:TO]->(f)
       SET d.status = 'answered', d.answer = $answer
       MERGE (f)-[r:ANSWERS]->(d)
       ON CREATE SET r.createdAt = timestamp()
       RETURN d, r, f.name as facultyName`,
      { userId, doubtId, answer }
    );

    if (result.records.length === 0) {
      return res.status(403).json({
        message: "Doubt not found or you are not authorized to answer it.",
      });
    }

    const answeredDoubt = result.records[0].get("d").properties;
    res.status(200).json(answeredDoubt);
  } catch (error) {
    console.error("Answer Doubt Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getDoubts = async (req, res) => {
  const { userId, role } = req.user;
  const session = getSession();

  try {
    let query;
    let params = { userId };

    if (role === "student") {
      query = `
        MATCH (:Student {student_id: $userId})-[:ASKS]->(d:Doubt)
        OPTIONAL MATCH (d)-[:TO]->(f:Faculty)
        RETURN d, f.name as directedTo
        ORDER BY d.createdAt DESC`;
    } else if (role === "faculty") {
      query = `
        MATCH (s:Student)-[:ASKS]->(d:Doubt)-[:TO]->(:Faculty {faculty_id: $userId})
        RETURN d, s.name as studentName
        ORDER BY d.createdAt DESC`;
    } else {
      return res.status(403).json({ message: "Access denied for this role." });
    }

    const result = await session.run(query, params);

    const doubts = result.records.map((record) => {
      const doubt = record.get("d").properties;
      doubt.createdAt = record.get("d").properties.createdAt.toString();
      if (role === "student") {
        doubt.directedTo = record.get("directedTo");
      }
      if (role === "faculty") {
        doubt.studentName = record.get("studentName");
      }
      return doubt;
    });

    res.status(200).json(doubts);
  } catch (error) {
    console.error("Get Doubts Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
