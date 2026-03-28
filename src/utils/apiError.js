export function getErrorMessage(error, fallback = "Something went wrong.") {
  if (error?.code === "ERR_NETWORK") {
    return "Network error. Make sure the Spring Boot backend is running and the frontend proxy/base URL is pointed at it.";
  }

  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}
