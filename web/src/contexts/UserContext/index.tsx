import type { FC } from 'react';
import React, { useMemo, createContext, useContext, useState } from 'react';

type UserContextType = {
    email?: string;
    login: (email: string) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType>({
    email: undefined,
    login: () => void 0,
    logout: () => void 0,
});

type IUserContextProviderProps = {
	children: React.ReactNode;
};

export const UserContextProvider: FC<IUserContextProviderProps> = ({ children }) => {
    const [email, setEmail] = useState<string | undefined>();

	const value = useMemo(() => ({
        email,
        login: (email: string) => setEmail(email),
        logout: () => setEmail(undefined),
    }), [email]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUserContext must be used within a UserContextProvider');
	}

	return context;
};
