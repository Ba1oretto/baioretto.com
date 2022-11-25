import React from "react";
import { Outlet } from "react-router-dom";

export default function PageContent() {
  return(
    <main className="container mx-auto py-8">
      <Outlet />
    </main>
  );
}