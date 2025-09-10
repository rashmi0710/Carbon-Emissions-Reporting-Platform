import React, { useEffect, useState } from "react";
import "./AuditLog.css";

const AuditLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8000/audit_logs/all");
        if (!response.ok) throw new Error("Failed to fetch audit logs");
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error:", error);
        setError("❌ Could not load audit logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="auditlog-loading">⏳ Loading logs...</p>;

  if (error) return <p className="auditlog-error">{error}</p>;

  return (
    <div className="auditlog-container">
      <h2 className="auditlog-title">Audit Log</h2>
      <table className="auditlog-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Record ID</th>
            <th>Field</th>
            <th>Old Value</th>
            <th>New Value</th>
            <th>Changed By</th>
            <th>Changed At</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.record_id}</td>
                <td>{log.field_name}</td>
                <td>{log.old_value ?? "-"}</td>
                <td>{log.new_value ?? "-"}</td>
                <td>{log.changed_by ?? "System"}</td>
                <td>{log.changed_at ? new Date(log.changed_at).toLocaleDateString() : "-"}</td>
                <td>{log.reason ?? "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="auditlog-no-logs">No audit logs found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
