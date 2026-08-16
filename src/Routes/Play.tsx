import { Outlet } from "react-router";

export function Play() {
  return (
    <div className="min-h-[60vh]">
      <Outlet />
    </div>
  );
}
