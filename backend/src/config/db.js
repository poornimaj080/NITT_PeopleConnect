import neo4j from "neo4j-driver";
import "dotenv/config";

let driver;

export const initDriver = async () => {
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    await driver.verifyConnectivity();
    console.log("✅ Neo4j Database connection established.");
  } catch (error) {
    console.error("🔴 Could not connect to Neo4j database.", error);

    process.exit(1);
  }
};

/**
 * Returns a new session from the initialized driver.
 * A session is a lightweight object for running queries.
 * @returns {import('neo4j-driver').Session} A Neo4j session object.
 */
export const getSession = () => {
  if (!driver) {
    throw new Error("Driver not initialized. Call initDriver() first.");
  }
  return driver.session();
};

/**
 * Closes the Neo4j driver connection gracefully.
 */
export const closeDriver = async () => {
  if (driver) {
    await driver.close();
    console.log("❎ Neo4j driver closed.");
  }
};
