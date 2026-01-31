import {
  createQuery,
  getStudentQueries,
  getAllQueries,
  replyToQuery,
} from "../services/queryService.js";


  //  STUDENT: Raise Query

export const raiseQuery = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, message, category } = req.body;

    if (!title || !message || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await createQuery(userId, title, message, category);

    res.json({
      success: true,
      message: "Query submitted successfully",
    });
  } catch (error) {
    console.error("RAISE QUERY ERROR:", error);
    res.status(500).json({ message: "Failed to submit query" });
  }
};


  //  STUDENT: View Own Queries

export const getMyQueries = async (req, res) => {
  try {
    const userId = req.user.id;

    const queries = await getStudentQueries(userId);

    res.json(queries);
  } catch (error) {
    console.error("GET MY QUERIES ERROR:", error);
    res.status(500).json({ message: "Failed to load queries" });
  }
};


  //  STAFF: View All Queries

export const getQueriesForStaff = async (req, res) => {
  try {
    const queries = await getAllQueries();
    res.json(queries);
  } catch (error) {
    console.error("GET STAFF QUERIES ERROR:", error);
    res.status(500).json({ message: "Failed to load staff queries" });
  }
};


  //  STAFF: Reply / Update Query

export const replyQuery = async (req, res) => {
  try {
    const { queryId, reply, status } = req.body;

    if (!queryId || !status) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await replyToQuery(queryId, reply || null, status);

    res.json({ success: true });
  } catch (error) {
    console.error("REPLY QUERY ERROR:", error);
    res.status(500).json({ message: "Failed to update query" });
  }
};
