import { ApiResponse } from "@/types/chat";

const WEBHOOK_URL = "http://10.112.129.18:5678/webhook-test/1d3f82a8-a653-439f-acfc-474c09f1cb6a";

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
