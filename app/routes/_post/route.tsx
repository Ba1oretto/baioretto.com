import { Outlet } from "@remix-run/react";

export function LoadingSpinner() {
  return (
    <section className="absolute inset-x-0 inset-y-0 center bg-abyss-blue/80">
      <div className="lds-roller pt-32">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </section>
  );
}

export default function PostLayout() {
  return (
    <main className="mt-32 container mx-auto flex flex-col gap-y-10">
      <Outlet />
    </main>
  );
}