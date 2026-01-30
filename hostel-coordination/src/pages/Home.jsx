import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";

function Home() {
  const [updates, setUpdates] = useState([]);

  const fetchUpdates = async () => {
    try {
      const res = await api.get(
        "/api/updates/all"
      );
      setUpdates(res.data);
    } catch (error) {
      console.error("Failed to fetch updates", error);
    }
  };

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5000); // live refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-outter" style={{ padding: "20px" }}>
      <h2>Latest Updates</h2>

      {updates.length === 0 ? (
        <p>No updates yet</p>
      ) : (
        updates.map((update) => (
          <div className="Post-main" key={update.id} style={{ marginBottom: "20px" }}>
            <h3>{update.title}</h3>
            <p>{update.caption}</p>

            {update.image_url && (
              <img
                src={`http://localhost:3000${update.image_url}`}
                alt="Update"
                width="300"
              />
            )}

            <br />
            <small>
              {new Date(update.created_at).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
