import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
    profileIcon: string | null;
    userName: string | null;
    setProfileIcon: React.Dispatch<React.SetStateAction<string | null>>;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ProfileProviderProps {
    children: ReactNode;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [profileIcon, setProfileIcon] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    return (
        <ProfileContext.Provider
            value={{
                profileIcon,
                userName,
                setProfileIcon,
                setUserName,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};