// MOCK: In production, publish driver updates to a message broker like Redis Pub/Sub
// Example: redis.publish('driver-location-update', { driverId, lat, long })
// All server instances would subscribe and forward to local WebSocket clients

import WebSocket, { WebSocketServer } from 'ws';
import { verifyToken } from '../services/token.service';
import { mockDrivers } from '../utils/mockDrivers';
import { getDriverLocation } from '../services/diver.service';

const clients = new Map<WebSocket, { type: 'driver' | 'client', driverId?: string, watchingId?: string }>();

export const initWebSocket = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        ws.on('message', (msg) => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.type === 'auth') {
                    const payload = verifyToken(data.token);
                    clients.set(ws, { type: data.role, driverId: payload.driverId });
                }

                if (data.type === 'locationUpdate') {
                    const clientData = clients.get(ws);
                    if (clientData?.driverId) {
                        // update location
                        const { lat, long } = data;
                        const timestamp = Date.now();
                        clients.forEach((info, socket) => {
                            if (info.type === 'client' && info.watchingId === clientData.driverId) {
                                socket.send(JSON.stringify({ ...mockDrivers.find(d => d.id === clientData.driverId), lat, long }));
                            }
                        });
                    }
                }

                if (data.type === 'watch') {
                    const clientData = clients.get(ws);
                    if (clientData) clients.set(ws, { ...clientData, watchingId: data.driverId });
                }
            } catch (err) {
                ws.send(JSON.stringify({ error: 'Invalid message format or token' }));
            }
        });

        ws.on('close', () => clients.delete(ws));
    });

    // Periodic update
    setInterval(() => {
        clients.forEach((info, ws) => {
            if (info.type === 'client' && info.watchingId) {
                const loc = getDriverLocation(info.watchingId);
                if (loc) {
                    const age = Date.now() - loc.timestamp;
                    if (age < 10 * 60 * 1000) {
                        ws.send(JSON.stringify({ ...mockDrivers.find(d => d.id === info.watchingId), ...loc }));
                    } else {
                        ws.send(JSON.stringify({ errorCode: 'OFFLINE_DRIVER', errorMessage: 'Driver has been offline for a while', lastUpdate: new Date(loc.timestamp).toISOString() }));
                    }
                } else {
                    ws.send(JSON.stringify({ errorCode: 'OFFLINE_DRIVER', errorMessage: 'No known location', lastUpdate: null }));
                }
            }
        });
    }, 5000);
};
