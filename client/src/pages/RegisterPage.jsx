import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (event) => {
        setUserDetails({...userDetails, [event.target.name]: event.target.value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post('/register', {
                userDetails,
            })
            alert('Registration Successful')

        } catch (error) {
            alert('Registration unsuccessful')
        }
        
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="John Doe" value={userDetails.name} onChange={handleChange}/>
                    <input type="text" name="email" placeholder="your@email.com" value={userDetails.email} onChange={handleChange}/>
                    <input type="password" name="password" placeholder="password" value={userDetails.password} onChange={handleChange}/>
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already have an account?
                        <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}