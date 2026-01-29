import { getVehiclePosition } from "@/api/vehiclePosition.api";
import { VehiclePosition } from "@/features/vehicles/types";

export const vehiclePositionService = {
  async getCurrent(vehicleId: string): Promise<VehiclePosition> {
    return await getVehiclePosition(vehicleId);
  }
};
