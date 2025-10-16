import { getSession } from "../../config/db.js";

export const getAllServices = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (u:User)-[:PROVIDES]->(s:Service)
       RETURN s, u.name as providedBy, COALESCE(u.student_id, u.faculty_id) as providerId
       ORDER BY s.created_date DESC` // This line guarantees the correct order
    );

    const services = result.records.map((record) => {
      const service = record.get("s").properties;
      service.providedBy = record.get("providedBy");
      service.providerId = record.get("providerId");
      return service;
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Get All Services Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
export const addService = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user;
  const session = getSession();

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const result = await session.run(
      `MATCH (u:User) WHERE u.student_id = $userId OR u.faculty_id = $userId
       CREATE (u)-[:PROVIDES]->(s:Service {
         service_id: randomUUID(),
         title: $title,
         description: $description,
         created_date: datetime()
       })
       RETURN s`,
      { userId, title, description }
    );

    const newService = result.records[0].get("s").properties;
    res.status(201).json(newService);
  } catch (error) {
    console.error("Add Service Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const requestService = async (req, res) => {
  const { serviceId } = req.params;
  const { userId } = req.user;
  const session = getSession();

  try {
    await session.run(
      `MATCH (u:User) WHERE u.student_id = $userId OR u.faculty_id = $userId
       MATCH (s:Service {service_id: $serviceId})
       MERGE (u)-[r:REQUESTS]->(s)
       ON CREATE SET r.status = 'pending', r.createdAt = timestamp()`,
      { userId, serviceId }
    );
    res.status(200).json({ message: "Service requested successfully." });
  } catch (error) {
    console.error("Request Service Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};

export const getIncomingRequests = async (req, res) => {
  const { userId } = req.user;
  const session = getSession();

  try {
    const result = await session.run(
      `MATCH (requester:User)-[r:REQUESTS]->(s:Service)<-[:PROVIDES]-(provider:User)
       WHERE provider.student_id = $userId OR provider.faculty_id = $userId
       RETURN s.title as serviceTitle, s.service_id as serviceId, requester.name as requesterName, requester.email as requesterEmail, r.createdAt as requestDate
       ORDER BY r.createdAt DESC`,
      { userId }
    );

    const requests = result.records.map((record) => ({
      serviceTitle: record.get("serviceTitle"),
      serviceId: record.get("serviceId"),
      requesterName: record.get("requesterName"),
      requesterEmail: record.get("requesterEmail"),
      requestDate: record.get("requestDate"),
    }));

    res.status(200).json(requests);
  } catch (error) {
    console.error("Get Incoming Requests Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await session.close();
  }
};
