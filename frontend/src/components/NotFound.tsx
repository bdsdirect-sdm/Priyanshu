// components/NotFound.tsx
import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for doesn't exist. Please check the URL or go back to the homepage.</p>
        </div>
    );
};

export default NotFound;
