import React from "react";
import Header from "./component/header/Header";
import Footer from "./component/footer/Footer";
import { Outlet } from "react-router-dom";

function Main()
{
  return (
    <main className="container mx-auto py-8">
      <Outlet />
    </main>
  );
}

function App()
{
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
