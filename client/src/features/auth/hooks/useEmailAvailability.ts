import { useState, useEffect, useRef } from "react";
import { authService } from "../services/authService";

interface UseEmailAvailabilityResult {
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
}

export function useEmailAvailability(email: string): UseEmailAvailabilityResult {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const debounceTimer = useRef<number | null>(null);

    useEffect(() => {
        // Reset states if email is empty or invalid format
        if (!email || !email.includes("@")) {
            setIsChecking(false);
            setIsAvailable(null);
            setError(null);
            return;
        }

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set checking state
        setIsChecking(true);
        setError(null);

        // Debounce the API call
        debounceTimer.current = setTimeout(async () => {
            try {
                if (import.meta.env.DEV) {
                    console.log("Checking email availability for:", email);
                }
                
                const result = await authService.checkEmailAvailability(email);
                
                if (import.meta.env.DEV) {
                    console.log("Email availability result:", result);
                }
                
                setIsAvailable(result.available);
                setError(null);
                setIsChecking(false);
            } catch (err: any) {
                if (import.meta.env.DEV) {
                    console.error("Email availability check failed:", err);
                }
                
                // Distinguish between network errors and server errors
                if (err.code === "ERR_NETWORK" || !err.response) {
                    setError("Cannot connect to server. Please check your connection.");
                } else {
                    setError("Failed to check email availability. Please try again.");
                }
                
                setIsAvailable(null);
                setIsChecking(false);
            }
        }, 500); // 500ms debounce

        // Cleanup function
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [email]);

    return { isChecking, isAvailable, error };
}
