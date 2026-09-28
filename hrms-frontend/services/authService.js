const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loginUser = async (loginData) => {
  const response = await fetch(
    `${API_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Invalid email or password"
    );
  }

  return data;
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${API_URL}/api/v1/auth/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    throw error;
  }
};