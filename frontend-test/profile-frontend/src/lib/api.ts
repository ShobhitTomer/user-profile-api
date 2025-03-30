const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5513";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
  bio?: string;
}

interface UpdateProfileData {
  name?: string;
  address?: string;
  bio?: string;
  profilePicture?: File;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  id: string;
  accessToken: string;
  message: string;
}

export interface ProfileUpdateResponse {
  user: User;
  message: string;
}

// Login user
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
};

// Register user
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

// Get user profile
export const getUserProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch profile");
  }

  return response.json();
};

// Update user profile
export const updateUserProfile = async (
  token: string,
  data: UpdateProfileData
): Promise<ProfileUpdateResponse> => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.address) formData.append("address", data.address);
  if (data.bio) formData.append("bio", data.bio);
  if (data.profilePicture)
    formData.append("profilePicture", data.profilePicture);

  const response = await fetch(`${API_URL}/api/users/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }

  return response.json();
};
