import http from 'http';
import app from './app';
import { initWebSocket } from './src/controllers/websocket.controller';

const server = http.createServer(app);
initWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
