const apiUrl = "https://bundeeapi1.azurewebsites.net/";

interface CallApiResponse {
 
}

export const callApi = async (
  personaEnquiryId: string,
  userId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${apiUrl}/api/v1/user/createDriverProfile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          bundee_auth_token:
            "51699e35f393ba8a7642c80a245e5b8aad4200c961fa8469bae0ef984cb95e95d9f3677ca9a32e1838cfbd897297ab2a",
        },
        body: JSON.stringify({
          personaEnquiryId,
          userId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data: CallApiResponse = await response.json();

  } catch (error) {
    console.error("API error:", error);
    throw new Error("Error In Catch Block");
  }
};
