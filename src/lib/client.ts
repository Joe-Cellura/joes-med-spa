import type { ClientId } from "./client-ids";

// Change this value to switch between clients
export const ACTIVE_CLIENT: ClientId = "palm";

export const CLIENT_DATA_PATH = `../data/clients/${ACTIVE_CLIENT}`;