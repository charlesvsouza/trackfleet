import api from "./http";

export async function getVehiclePosition(vehicleId: string) {
  const { data } = await api.get(`/vehicles/${vehicleId}/position`);
  return data;
}
