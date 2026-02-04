import React, { useEffect, useState, useRef } from 'react';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from '@mui/material';
import * as signalR from '@microsoft/signalr';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Importe o seu componente de mapa existente
import { MapContainer } from '../map/MapContainer'; 
// Se precisar do tipo Vehicle, importe-o. Aqui usarei um tipo local simples para evitar erros.
// import { Vehicle } from '../features/vehicles/types';

interface SignalRPosition {
    vehicleId: string;
    imei: string;
    name: string;
    lat: number;
    lng: number;
    speed: number;
    ignition: boolean;
    timestamp: string;
}

// Tipo compatível com o seu MapContainer
interface Vehicle {
    id: string;
    plate: string;
    position?: {
        lat: number;
        lng: number;
        timestamp?: string; // string ou number, ajuste conforme seu tipo
    };
    // adicione outros campos se seu MapContainer exigir
}

const MapScreen: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'Conectando...' | 'Online' | 'Offline'>('Conectando...');
    
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5249/tracking")
            .withAutomaticReconnect()
            .build();

        connectionRef.current = newConnection;

        newConnection.on("ReceivePosition", (pos: SignalRPosition) => {
            console.log("📍 Nova Posição:", pos);
            
            setVehicles(prev => {
                const exists = prev.find(v => v.id === pos.vehicleId);
                if (exists) {
                    return prev.map(v => v.id === pos.vehicleId ? { 
                        ...v, 
                        position: { lat: pos.lat, lng: pos.lng, timestamp: pos.timestamp } 
                    } : v);
                } else {
                    return [...prev, {
                        id: pos.vehicleId,
                        plate: pos.name,
                        position: { lat: pos.lat, lng: pos.lng, timestamp: pos.timestamp }
                    }];
                }
            });
        });

        newConnection.start()
            .then(() => setConnectionStatus('Online'))
            .catch(err => {
                console.error("Erro SignalR:", err);
                setConnectionStatus('Offline');
            });

        return () => {
            newConnection.stop();
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
            
            {/* Lista Flutuante sobre o mapa (Opcional, ou barra lateral extra) */}
            <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column', zIndex: 10 }} elevation={4} square>
                <Box p={2} bgcolor="primary.main" color="white">
                    <Typography variant="h6">Frota ({connectionStatus})</Typography>
                </Box>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {vehicles.map((v) => (
                        <ListItem 
                            button 
                            key={v.id} 
                            selected={selectedVehicleId === v.id}
                            onClick={() => setSelectedVehicleId(v.id)}
                        >
                            <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                            <ListItemText primary={v.plate} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Box flex={1} position="relative">
                <MapContainer 
                    vehicles={vehicles} // Passando os veículos do SignalR para o seu mapa
                    selectedVehicleId={selectedVehicleId}
                    showTrails={true}
                    historySize={20}
                    clearHistorySignal={0}
                />
            </Box>
        </Box>
    );
};

export default MapScreen;