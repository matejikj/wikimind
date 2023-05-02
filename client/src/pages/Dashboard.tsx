import { LoginButton } from "@inrupt/solid-ui-react";
import './Login.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import { getMindMapList } from "../service/mindMapService";
import Button from 'react-bootstrap/Button';
import { generate_uuidv4 } from "../service/utils";

const authOptions = {
  clientName: "Learnee",
};

const Dashboard: React.FC = () => {
  const [list, setList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const result = getMindMapList().then((res) => {
      setList(res)
    });
    
  }, []);

  const handleClick = (e: any) => {
    console.log(e.target.name)
    navigate('/visualisation/',{
    state: {
      id: e.target.name,
      isNew: false
    }})
  }

  const createNew = (e: any) => {
    console.log(e.target.name)
    navigate('/visualisation/',{
    state: {
      id: generate_uuidv4(),
      isNew: true
    }})
  }

  return (
    <div className="App">
      <Sidenav props={{ message: "Basic" }} />
      <main>
        <h1>Dashboard</h1>
        <Button onClick={createNew} variant="primary">Create new</Button>
        {list.map((item, index) => {
          return (
            <Button key={index} name={item} onClick={handleClick} variant="primary">{item}</Button>
            )
        })}
      </main>
    </div>

  );
};

export default Dashboard;
