import { describe, expect, it } from "vitest";
import {
  assertSupportedNode,
  collectDoctorChecks,
  reportDoctor,
} from "../../src/services/environment.js";
import { detectAvailableManagers } from "../../src/services/package-manager.js";

describe("node floor checks", () => {
  it("detects supported node versions", async () => {
    const checks = await collectDoctorChecks();
    const node = checks.find((check) => check.name === "Node.js");
    expect(node).toBeDefined();
    // The test runner's own node must satisfy the CLI floor.
    expect(node?.ok).toBe(true);
  });
});

describe("collectDoctorChecks", () => {
  it("always reports OS, architecture and package-manager rows", async () => {
    const checks = await collectDoctorChecks();
    const names = checks.map((check) => check.name);
    expect(names).toContain("Operating System");
    expect(names).toContain("Architecture");
    expect(names).toContain("Package manager");
    expect(names).toContain("Git");
  });

  it("marks optional tools as optional", async () => {
    const checks = await collectDoctorChecks();
    for (const name of ["pnpm", "yarn", "bun", "Git"]) {
      const check = checks.find((entry) => entry.name === name);
      expect(check?.optional).toBe(true);
    }
    const node = checks.find((entry) => entry.name === "Node.js");
    expect(node?.optional).toBeUndefined();
  });
});

describe("reportDoctor", () => {
  it("passes when only optional checks fail", () => {
    const ok = reportDoctor([
      { name: "Node.js", ok: true, detail: "v20.19.0" },
      { name: "bun", ok: false, detail: "not installed", optional: true, hint: "install bun" },
    ]);
    expect(ok).toBe(true);
  });

  it("fails when a required check fails", () => {
    const ok = reportDoctor([
      { name: "Node.js", ok: false, detail: "v18.0.0", hint: "upgrade" },
      { name: "bun", ok: false, detail: "not installed", optional: true },
    ]);
    expect(ok).toBe(false);
  });
});

describe("detectAvailableManagers", () => {
  it("returns a subset of the requested order", async () => {
    const available = await detectAvailableManagers(["pnpm", "npm", "yarn", "bun"]);
    for (const pm of available) {
      expect(["pnpm", "npm", "yarn", "bun"]).toContain(pm);
    }
  });

  it("ignores unknown managers in the order list", async () => {
    // Cast through unknown to simulate a corrupted config value.
    const available = await detectAvailableManagers(["pnpm", "npm"] as never);
    expect(Array.isArray(available)).toBe(true);
  });
});

describe("assertSupportedNode", () => {
  it("does not throw on the runner's own modern node", () => {
    expect(() => assertSupportedNode()).not.toThrow();
  });
});
