
import { ApiResponse } from "@/types/chat";

const WEBHOOK_URL = "http://localhost:5678/webhook-test/7a39b980-ba20-473e-a980-1df22cfa78bf";

export const sendMessage = async (message: string): Promise<ApiResponse> => {
  try {
    console.log("Sending message to webhook:", message);
    
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response:", data);
    
    return data;
  } catch (error) {
    console.error("Error calling webhook:", error);
    throw error;
  }
};
