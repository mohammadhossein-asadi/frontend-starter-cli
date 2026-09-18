import { collectDoctorChecks, reportDoctor } from "../services/environment.js";

/** `frontend-starter doctor` — inspect the local development environment. */
export async function runDoctor(): Promise<number> {
  const checks = await collectDoctorChecks();
  const healthy = reportDoctor(checks);
  return healthy ? 0 : 1;
}
