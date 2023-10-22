import fetch from "node-fetch"
import React, {useState} from "react"
import loginLogo from '../../images/image2.png'
import '../User/user.css'

const User = ({setAuthenticated}) => {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    try {
      const requestBody = {
        userPass: password,
      }
      const response = await fetch('/api/user/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if(response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setAuthenticated(true)
      } else {
        setMessage('Authentication failed')
      }
    } catch(error) {
      setMessage('Error occurred during login')
    }
  }
  return(
    <>
      <div className="login-container">
        <img 
          className="quote-dictionary" 
          src={loginLogo} 
          alt="Quote Dictionary" 
          />

        <div className="login-input-container">
          <label>Enter Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="error">{message}</div>
        <button 
          className="login-button"
          onClick={handleLogin}>
            Login
        </button>
      </div>
    </>
  )
}

export default User
          