// SkullLoading.tsx
import React from 'react';

const SkullLoading: React.FC = () => {
    return (
        <div className="skull-loading">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width="50"
                height="50"
                fill="none"
                stroke="black"
            >
                <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="5" fill="white" />
                <path
                    d="M 30 40 Q 50 60, 70 40"
                    stroke="black"
                    fill="transparent"
                    strokeWidth="5"
                />
                <path d="M 35 50 L 35 55" stroke="black" strokeWidth="5" />
                <path d="M 65 50 L 65 55" stroke="black" strokeWidth="5" />
            </svg>
        </div>
    );
};

export default SkullLoading;
