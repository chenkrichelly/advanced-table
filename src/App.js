import React from "react";
import dataGenerator from "./data/dataGenerator";
import Table from "./components/Table";

const App = () => {
  const { columns, userData } = dataGenerator();

  return (
    <div className="App">
      <div className='nav'>
        <h1>Customers</h1>
      </div>
      <Table columns={columns} userData={userData} />
    </div>
  );
};

export default App;
