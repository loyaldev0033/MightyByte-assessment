# 🚀 MightyByte RTC Backend – Real-Time Driver Location Server

A blazing-fast, thoughtfully crafted real-time backend system designed for a ride-sharing dashboard. It showcases bi-directional WebSocket communication, JWT-secured REST APIs, and responsive in-memory location tracking—all written in modern, strictly typed **TypeScript**.

---

## 📦 Installation

```bash
git clone https://github.com/loyaldev0033/MightyByte-assessment.git
cd mightybyte-assessment
npm install

⚙️ Scripts & Running the Server
🧪 Development Mode (auto-restarts with ts-node-dev)

npm run dev
🏗️ Build for Production

npm run build
🚀 Run Production Build

npm start
You'll see:

Server is running on http://localhost:3000
🧠 Project Structure

.
├── server.ts                  # Entry point (root)
├── app.ts                     # Express config & routing
├── tsconfig.json              # TypeScript config
├──src
      ├── controllers/
      │   ├── auth.controller.ts     # /login logic
      │   ├── driver.controller.ts   # /driver/update logic
      │   └── webSocket.controller.ts # WebSocket entrypoint
      ├── middleware/
      │   └── auth.middleware.ts     # JWT validation
      ├── services/
      │   ├── driver.service.ts      # In-memory location store
      │   └── token.service.ts       # JWT creation/verification
      ├── utils/
      │   └── mockDrivers.ts         # Hardcoded driver accounts
      ├── types/
      │   └── index.d.ts             # Extended Express types
🔐 REST API Overview
🟢 POST /login
Logs in a driver and returns a JWT token (valid for 5 minutes).

✅ Request Body:

{
  "username": "driver1",
  "password": "pass1"
}
✅ Response:

{
  "token": "jwt-token-here",
  "driver": {
    "id": "driver1",
    "username": "driver1",
    "name": "Josh",
    "image": "driver1.png"
  }
}
🟡 POST /driver/update
Submits a driver’s current GPS location.

✅ Headers:

Authorization: Bearer YOUR_JWT_HERE
Content-Type: application/json
✅ Request Body:

{
  "lat": 40.7128,
  "long": 74.0060
}
✅ Response:

{ "success": true }
Returns 401 or 403 if the token is missing or expired.

🔁 WebSocket API Overview
🔌 Connect to:

ws://localhost:3000
💬 Authenticate (Driver or Client)

{
  "type": "auth",
  "role": "driver", // or "client"
  "token": "YOUR_JWT_HERE"
}
📍 Driver Location Update

{
  "type": "locationUpdate",
  "lat": 40.7128,
  "long": 74.0060
}
🔁 Clients subscribed to this driver will receive updates every 5 seconds.

👀 Client Subscribes to a Driver

{
  "type": "watch",
  "driverId": "driver1"
}
📡 Client Will Receive:

{
  "username": "driver1",
  "name": "Josh",
  "lat": 40.7128,
  "long": 74.0060
}
Or if the driver has been offline for 10+ minutes:


{
  "errorCode": "OFFLINE_DRIVER",
  "errorMessage": "Driver has been offline for a while now",
  "lastUpdate": "2025-05-20T16:30:00.000Z"
}
🔒 Security Highlights
🔐 JWT Authentication with 5-minute expiration

👥 3 hardcoded drivers: driver1, driver2, driver3

🚫 Returns proper 401/403 errors for invalid tokens

🔄 Real-time location streaming via WebSocket

🧪 Example Test Flow
🔑 Call POST /login and copy the token

🛰️ Call POST /driver/update with the token and coordinates

🌐 Connect a WebSocket client

🔐 Send auth:


{ "type": "auth", "role": "client", "token": "..." }
👂 Watch:


{ "type": "watch", "driverId": "driver1" }
📡 Receive updates every 5 seconds or offline errors every 60 seconds