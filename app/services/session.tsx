import { useState } from "react";

const EndSessionButton = ({ session_id }: { session_id: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4000/api/sessions/${session_id}/end`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to end session");
      }

      alert("Session ended successfully");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        onClick={endSession}
        disabled={loading}
      >
        {loading ? "Ending Session..." : "Paid"}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default EndSessionButton;
