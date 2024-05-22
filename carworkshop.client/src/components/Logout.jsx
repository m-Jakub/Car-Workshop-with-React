import React from 'react';
import axios from 'axios';

function Logout() {
    // Function to handle logout
    const handleLogout = async () => {
        try {
            // Make POST request to logout endpoint
            await axios.post('/api/auth/logout');

            // Handle successful logout (e.g., redirect user)
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <h2>Logout</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;
