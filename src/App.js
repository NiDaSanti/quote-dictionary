import React, {useState} from 'react'
import Dashboard from './Dashboard/dashboard'
import User from './Components/User/user'
// import Footer from './Components/Footer/footer'
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  return (
    <div className="App">
      {authenticated ? (
        <Dashboard />
      ) : (
        <User setAuthenticated={setAuthenticated}/>
      )}
    </div>
  );
}

export default App;
