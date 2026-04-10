"use client"

import { createContext, ReactNode, useState } from "react";

type AppContextType = {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

const initialValues: AppContextType = {
    selectedTags: [],
    setSelectedTags: () => {}
}

export const BlogContexts = createContext<AppContextType>(initialValues)


const AppProvider = ({ children }: {children: ReactNode}) => {

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    return (
        <BlogContexts.Provider value={{ selectedTags, setSelectedTags }} >
            {children}
        </BlogContexts.Provider>
    )
}

export default AppProvider;