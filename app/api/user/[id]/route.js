import admin from "@/firebaseAdmin"; // Import Firebase Admin instance

// Handling DELETE requests to /api/user/[id]
export const DELETE = async (req, { params }) => {
  const { id } = params;  // Extract user ID from URL parameters

  try {
    await admin.auth().deleteUser(id);  // Delete the user with the specified ID from Firebase Auth
    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Error deleting user", { status: 500 });
  }
};