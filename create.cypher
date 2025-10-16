// 1. Clear database
MATCH (n) DETACH DELETE n;

// 2. Create constraints and indexes
CREATE CONSTRAINT FOR (s:Student) REQUIRE s.student_id IS UNIQUE;
CREATE CONSTRAINT FOR (f:Faculty) REQUIRE f.faculty_id IS UNIQUE;
CREATE CONSTRAINT FOR (st:Staff) REQUIRE st.staff_id IS UNIQUE;
CREATE CONSTRAINT FOR (a:Alumni) REQUIRE a.alumni_id IS UNIQUE;
CREATE CONSTRAINT FOR (c:Course) REQUIRE c.course_id IS UNIQUE;
CREATE CONSTRAINT FOR (i:Internship) REQUIRE i.internship_id IS UNIQUE;
CREATE CONSTRAINT FOR (r:ResearchProject) REQUIRE r.project_id IS UNIQUE;
CREATE CONSTRAINT FOR (d:Department) REQUIRE d.department_id IS UNIQUE;
CREATE CONSTRAINT FOR (e:Event) REQUIRE e.event_id IS UNIQUE;
CREATE CONSTRAINT FOR (h:Hostel) REQUIRE h.hostel_id IS UNIQUE;
CREATE CONSTRAINT FOR (m:Mess) REQUIRE m.mess_id IS UNIQUE;
CREATE CONSTRAINT FOR (doc:CollegeDoctor) REQUIRE doc.doctor_id IS UNIQUE;

// Create indexes for frequently queried properties
CREATE INDEX FOR :Student(name);
CREATE INDEX FOR :Faculty(name);
CREATE INDEX FOR :Course(title);
CREATE INDEX FOR :Alumni(graduation_year);
CREATE INDEX FOR :Event(date_time);

// 3. Begin transaction
BEGIN;

// 4. Create Nodes

// Students
CREATE (s1:Student {
  student_id: 'S001', name: 'Alice Kumar', dob: date('2002-05-12'),
  gender: 'Female', email: 'alice.kumar@college.edu', phone: '9999000111',
  year: 3, major: 'Computer Science', gpa: 3.8,
  address: '123 Maple St', enrollment_date: date('2020-08-01')
});

CREATE (s2:Student {
  student_id: 'S002', name: 'Bob Singh', dob: date('2001-11-20'),
  gender: 'Male', email: 'bob.singh@college.edu', phone: '9999000222',
  year: 4, major: 'Electrical Engineering', gpa: 3.5,
  address: '456 Oak Ave', enrollment_date: date('2019-08-01')
});

// Faculty
CREATE (f1:Faculty {
  faculty_id: 'F001', name: 'Dr. Carol Lee', department_id: 'D001',
  title: 'Assistant Professor', specialty: 'Machine Learning',
  email: 'carol.lee@college.edu', phone: '9999000333',
  hire_date: date('2018-07-15'), office_location: 'Bldg A, Rm 210',
  years_experience: 5
});

// Staff
CREATE (st1:Staff {
  staff_id: 'ST001', name: 'David Patel', role: 'Hostel Warden',
  department_id: 'D001', email: 'david.patel@college.edu',
  phone: '9999000444', hire_date: date('2017-01-10'),
  work_shift: 'Day', office_location: 'Hostel Admin'
});

// Alumni
CREATE (a1:Alumni {
  alumni_id: 'AL001', name: 'Eva Das', graduation_year: 2020,
  major: 'Mechanical Engineering', current_employer: 'AutoWorks Inc',
  job_title: 'Design Engineer',
  email: 'eva.das@alumni.college.edu', phone: '9999000555',
  city: 'Chennai', country: 'India'
});

// Course
CREATE (c1:Course {
  course_id: 'CSE101', title: 'Data Structures', code: 'CSE101',
  credits: 4, semester: 'Fall', description: 'Intro to DS',
  prerequisites: ['CSE100']
});

// Internship
CREATE (i1:Internship {
  internship_id: 'I001', company: 'TechCorp', role: 'Software Intern',
  duration_months: 6, requirements: 'C++ knowledge',
  stipend: 500.0, location: 'Bangalore',
  application_deadline: date('2025-11-30')
});

// ResearchProject
CREATE (r1:ResearchProject {
  project_id: 'RP001', title: 'AI in Healthcare',
  start_date: date('2023-01-01'), end_date: date('2025-12-31'),
  funding_amount: 200000.0, status: 'Active',
  lead_faculty_id: 'F001', description: 'ML for diagnosis'
});

// Department
CREATE (d1:Department {
  department_id: 'D001', name: 'Computer Science',
  building: 'Engineering Block', head_of_department: 'Dr. X',
  phone: '9999000666'
});

// Event
CREATE (e1:Event {
  event_id: 'E001', title: 'Hackathon', description: '24h coding',
  date_time: datetime('2025-10-15T09:00:00'), location: 'Auditorium',
  organizer_id: 'CLUB001', capacity: 200
});

// Hostel
CREATE (h1:Hostel {
  hostel_id: 'H001', name: 'Maple Hostel', capacity: 300,
  warden: 'David Patel', address: 'North Campus Road'
});

// Mess
CREATE (m1:Mess {
  mess_id: 'M001', name: 'Central Mess', menu_type: 'Veg/Non-Veg',
  operating_hours: '7AM-10PM', capacity: 150,
  manager_id: 'ST001'
});

// CollegeDoctor
CREATE (doc1:CollegeDoctor {
  doctor_id: 'DOC001', name: 'Dr. Farah Khan',
  specialization: 'General Medicine',
  email: 'farah.khan@college.edu', phone: '9999000777',
  office_location: 'Health Center', consultation_hours: '10AM-4PM'
});

// 5. Create Relationships using MERGE to prevent duplicates

// Student Relationships
MATCH (s:Student {student_id: 'S001'}), (i:Internship {internship_id: 'I001'})
MERGE (s)-[:APPLIES_FOR {date: date('2025-09-01')}]->(i);

MATCH (s:Student {student_id: 'S001'}), (c:Course {course_id: 'CSE101'})
MERGE (s)-[:ENROLLED_IN {date: date('2023-08-01')}]->(c);

MATCH (s:Student {student_id: 'S002'}), (r:ResearchProject {project_id: 'RP001'})
MERGE (s)-[:COLLABORATES_ON {role: 'Research Assistant'}]->(r);

MATCH (s:Student {student_id: 'S001'}), (h:Hostel {hostel_id: 'H001'})
MERGE (s)-[:LIVES_IN {room: 'B12'}]->(h);

MATCH (s:Student {student_id: 'S001'}), (m:Mess {mess_id: 'M001'})
MERGE (s)-[:EATS_AT {meal_plan: 'Standard'}]->(m);

MATCH (s:Student {student_id: 'S002'}), (doc:CollegeDoctor {doctor_id: 'DOC001'})
MERGE (s)-[:CONSULTS {date: date('2025-10-05')}]->(doc);

// Faculty Relationships
MATCH (f:Faculty {faculty_id: 'F001'}), (c:Course {course_id: 'CSE101'})
MERGE (f)-[:TEACHES]->(c);

MATCH (f:Faculty {faculty_id: 'F001'}), (r:ResearchProject {project_id: 'RP001'})
MERGE (f)-[:LEADS]->(r);

MATCH (f:Faculty {faculty_id: 'F001'}), (d:Department {department_id: 'D001'})
MERGE (f)-[:WORKS_IN]->(d);

MATCH (f:Faculty {faculty_id: 'F001'}), (doc:CollegeDoctor {doctor_id: 'DOC001'})
MERGE (f)-[:CONSULTS {date: date('2025-10-06')}]->(doc);

// Staff Relationships
MATCH (st:Staff {staff_id: 'ST001'}), (h:Hostel {hostel_id: 'H001'})
MERGE (st)-[:MANAGES]->(h);

MATCH (st:Staff {staff_id: 'ST001'}), (m:Mess {mess_id: 'M001'})
MERGE (st)-[:MANAGES]->(m);

// Alumni Relationships
MATCH (al:Alumni {alumni_id: 'AL001'}), (s:Student {student_id: 'S001'})
MERGE (al)-[:MENTORS]->(s);

MATCH (al:Alumni {alumni_id: 'AL001'}), (i:Internship {internship_id: 'I001'})
MERGE (al)-[:PROVIDES]->(i);

MATCH (al:Alumni {alumni_id: 'AL001'}), (e:Event {event_id: 'E001'})
MERGE (al)-[:SPONSORS]->(e);

// 6. Commit transaction
COMMIT;

// 7. Display results with optimized query
MATCH (n)
OPTIONAL MATCH (n)-[r]->()
RETURN 
  labels(n) as NodeType,
  n as NodeData,
  count(r) as RelationshipCount,
  collect(DISTINCT type(r)) as RelationshipTypes
ORDER BY NodeType;

// 8. Show all relationships
MATCH (start)-[r]->(end)
RETURN 
  labels(start)[0] as StartNodeType,
  start.name as StartNodeName,
  type(r) as RelationshipType,
  labels(end)[0] as EndNodeType,
  end.name as EndNodeName,
  r as RelationshipData
ORDER BY StartNodeType, RelationshipType;

// 9. Show complete paths for visualization
MATCH p=(start)-[r]->(end)
RETURN p
LIMIT 25;
