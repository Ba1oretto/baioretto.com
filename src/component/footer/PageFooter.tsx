import React from "react";
import { DeployTime, SocialMedia } from "./ToolBar";
import "./atri.css";

function SocialSection() {
  return (
    <div className="bg-yellow-550">
      <div className="container mx-auto">
        <div className="md:ml-44 py-3 px-6 md:flex md:items-center md:justify-between text-orange-900">
          <DeployTime />
          <SocialMedia />
        </div>
      </div>
    </div>
  );
}

function AtriPortrait() {
  return (
    <a className="hidden md:block portrait mr-6 group">
      <div className="atri group-hover:opacity-0 transition-all duration-200" />
      <div className="atri opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </a>
  );
}

function TextSection() {
  return (
    <div className="container mx-auto flex flex-col md:flex-row md:items-center p-6">
      <AtriPortrait />
      <div className="ml-3">
        <div className="text-black opacity-80 leading-tight">Baioretto, An Independent Developer</div>
        <div className="text-orange-900 leading-tight">Copyright © 2022 baioretto | All rights reserved | sunjiamu@outlook.com</div>
      </div>
    </div>
  );
}

export default function PageFooter() {
  return (
    <footer className="bg-yellow-450">
      <SocialSection />
      <TextSection />
    </footer>
  );
}