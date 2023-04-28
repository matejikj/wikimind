import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";

const authOptions = {
  clientName: "Learnee",
};

const Dashboard: React.FC = () => {

  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main>
        <h1>Dashboard</h1>
      </main>
    </div>

  );
};

export default Dashboard;
