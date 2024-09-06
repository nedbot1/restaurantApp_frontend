import { useState } from "react";
import { updatePayment } from "./fetchRestaurant";
type EndSessionButtonProps = {
  session_id: string;
  isPaid: boolean;
  order_id: string
  onStatusChange: (id: string) => void;
};const EndSessionButton: React.FC<EndSessionButtonProps> = ({
  session_id,
  isPaid,
  onStatusChange,
  order_id,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaid = async () => {
    try {
      const { data } = await updatePayment(order_id); // Update payment
      onStatusChange(order_id); // Update the UI after payment is processed
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const endSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/api/sessions/${session_id}/end`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to end session");
      }

      await handlePaid(); // Ensure that payment is updated after session ends
      alert("Session ended and payment updated successfully");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className={`py-2 px-4 rounded font-bold transition duration-200 ${
          isPaid
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white`}
        onClick={endSession}
        disabled={loading}
      >
        {loading ? "Ending Session..." : isPaid ? "Close" : "Paid"}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default EndSessionButton;
