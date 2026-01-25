import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const getSocket = () => {
    if (!socket) {
        const wsUrl = 'https://aiconnect-api.uz'
        socket = io(wsUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            timeout: 20000,
            autoConnect: true,
            forceNew: false,
            upgrade: true,
            rememberUpgrade: true,
        })

        socket.on('connect', () => {
            // console.log('WebSocket Connected - ID:', socket?.id)
            // console.log('Transport:', socket?.io.engine.transport.name);
        })

        socket.on('disconnect', (reason) => {
            // console.log('WebSocket Disconnected:', reason)

            if (reason === 'io server disconnect') {
                socket?.connect()
            }
        })

        socket.on('connect_error', (error) => {
            // console.error('WebSocket Connection Error:', error.message)
            // console.error('Error details:', error);
        })

        socket.on('reconnect', (attemptNumber) => {
            console.log('WebSocket Reconnected after', attemptNumber, 'attempts')
        })

        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log('WebSocket Reconnection Attempt:', attemptNumber)
        })

        socket.on('reconnect_error', (error) => {
            console.error('WebSocket Reconnection Error:', error.message)
        })

        socket.on('reconnect_failed', () => {
            console.error('WebSocket Reconnection Failed')
        })

        socket.on('error', (error) => {
            console.error('WebSocket Error:', error)
        })

        // Listen for server events
        socket.on('connected', (data) => {
            // console.log('Server says:', data);
        });

        // Debug all events
        socket.onAny((eventName, ...args) => {
            // console.log(`Event received: ${eventName}`, args);
        });
    }

    return socket
}

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
        // console.log('🔌 WebSocket Disconnected Manually')
    }
}

export const isSocketConnected = () => {
    return socket?.connected || false
}