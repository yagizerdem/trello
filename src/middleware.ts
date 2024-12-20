import jwt from "jsonwebtoken";
import { createMiddleware } from "@solidjs/start/middleware";
import ApiResponse from "./util/apiResponse";

const protectedRoutes = ["contactRequest", "processContactRequest"];
const secretKey = process.env["JWTSECRET"] as string; // Replace with your secret key

export default createMiddleware({
  onRequest: [
    async (event) => {
      try {
        const response = authGuard(event);
        if (response) {
          return response; // Return the unauthorized or error response
        }
      } catch (err) {
        console.error("Error in authGuard:", err);
        return createErrorResponse();
      }
    },
  ],
});

// helpers
function createUnauthorizedResponse() {
  return new Response(
    JSON.stringify(
      ApiResponse.create(
        false,
        ["User is not authenticated"],
        null,
        null,
        false,
        "Auth/login"
      )
    ),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}

function createErrorResponse() {
  return new Response(
    JSON.stringify(
      ApiResponse.create(false, ["Internal server error"], null, null)
    ),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}

function authGuard(event: any) {
  const fileName = event.request.url.split("/").pop();
  if (fileName && protectedRoutes.includes(fileName)) {
    const jwtToken = event.request.headers.get("authorization");

    if (!jwtToken) {
      return createUnauthorizedResponse();
    }

    try {
      // Remove 'Bearer ' prefix
      const token = jwtToken.startsWith("Bearer ")
        ? jwtToken.slice(7)
        : jwtToken;

      // Verify the JWT
      const decoded = jwt.verify(token, secretKey);

      // Attach user info to the request via custom headers
      const userHeader = JSON.stringify(decoded);
      event.request.user = userHeader;
    } catch (err) {
      console.error("JWT Verification Error:", err);
      return createUnauthorizedResponse();
    }
  }

  return null; // Allow request to proceed if no issues
}
