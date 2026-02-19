import { ApiResponse } from "@/types/chat";

const WEBHOOK_URL = "https://n8n.glimpse.uaslp.mx/webhook/498f71b1-5cb9-4568-9852-d39c468de891";
const TEST_WEBHOOK_URL = "https://n8n.glimpse.uaslp.mx/webhook-test/498f71b1-5cb9-4568-9852-d39c468de891";
const HARDCODED_WEBHOOK_URL = "https://n8n.glimpse.uaslp.mx/webhook/79efff98-6c1c-4322-9c43-d04ddc458e0f";
const TEST_HARDCODED_WEBHOOK_URL = "https://n8n.glimpse.uaslp.mx/webhook-test/79efff98-6c1c-4322-9c43-d04ddc458e0f";

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
