import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string,) {
    let [value, setValue] = useState<string | null>(() => {
        let storedValue = localStorage.getItem(key);
        return storedValue;


    })

    useEffect(() => {
        if (value)
            localStorage.setItem(key, value);
        else
            localStorage.removeItem(key);
    }, [value, key])

    return [value, setValue] as [T, typeof setValue]
}