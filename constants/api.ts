/**
 * API Configuration for Pocima Salvaje
 * Handles communication with chyrris.com backend
 */

import * as ReactNative from "react-native";

/**
 * Get the API base URL for MolDoctor
 * Points to chyrris.com in production
 */
export function getMolDoctorApiUrl(): string {
  // For mobile apps (iOS/Android), always use production URL
  if (ReactNative.Platform.OS !== "web") {
    return "https://chyrris.com";
  }

  // For web development, use localhost
  if (typeof window !== "undefined" && window.location) {
    const { protocol, hostname } = window.location;
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:5000`;
    }
  }

  // Default to production
  return "https://chyrris.com";
}

/**
 * MolDoctor API endpoints
 */
export const MOLDOCTOR_API = {
  CHAT: "/api/moldoctor/chat",
  ANALYZE_LAB: "/api/moldoctor/analyze-lab",
  HEALTH: "/api/health",
} as const;

/**
 * Make a request to MolDoctor API
 */
export async function moldoctorRequest<T = any>(
  endpoint: string,
  data: any
): Promise<T> {
  const baseUrl = getMolDoctorApiUrl();
  const url = `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("MolDoctor API request error:", error);
    throw error;
  }
}

/**
 * Check if the backend is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseUrl = getMolDoctorApiUrl();
    const response = await fetch(`${baseUrl}${MOLDOCTOR_API.HEALTH}`);
    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}
