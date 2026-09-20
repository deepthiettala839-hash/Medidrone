// Optional placeholder for future Netlify Functions deployment.
// The recommended production architecture is to deploy the Express API
// on a Node-compatible backend service and keep the React frontend on Netlify.
export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Deploy the backend as a Node service for full Socket.IO support." })
  };
}
