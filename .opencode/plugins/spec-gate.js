import { readdirSync, existsSync } from "fs";
import { join } from "path";

export default async ({ directory }) => {
  const hasApproved = () => {
    const changesDir = join(directory, ".specs", "changes");
    if (!existsSync(changesDir)) return false;
    for (const name of readdirSync(changesDir)) {
      if (existsSync(join(changesDir, name, ".approved"))) return true;
    }
    return false;
  };

  return {
    "tool.execute.before": async (input) => {
      const tool = input.tool?.toLowerCase?.() || "";
      if (!["write", "edit", "apply_patch", "multiedit"].includes(tool)) return;
      const path = input.args?.path || input.args?.filePath || "";
      if (!path.startsWith("backend/") && !path.startsWith("frontend/")) return;
      if (!hasApproved()) {
        throw new Error("Spec approval gate: no approved spec found. Create .specs/changes/<name>/.approved before implementing.");
      }
    },
  };
};