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
    const requestCount = useRef<number>(0);
    const lastRequestTime = useRef<number>(0);

    useEffect(() => {
        // Reset states if email is empty or invalid format
        if (!email || !email.includes("@")) {
            setIsChecking(false);
            setIsAvailable(null);
            setError(null);
            return;
        }

        // 🔒 Security: Client-side validation before making API call
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailRegex.test(email)) {
            setIsChecking(false);
            setIsAvailable(null);
            setError(null);
            return;
        }

        // 🔒 Security: Check email length (RFC 5321)
        if (email.length > 254) {
            setIsChecking(false);
            setIsAvailable(null);
            setError("Email address is too long.");
            return;
        }

        // 🔒 Security: Client-side rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime.current;
        
        if (timeSinceLastRequest < 60000) { // Within the same minute
            requestCount.current += 1;
            if (requestCount.current > 8) { // Client-side limit slightly lower than server
                setIsChecking(false);
                setError("Too many checks. Please wait a moment.");
                return;
            }
        } else {
            // Reset counter after a minute
            requestCount.current = 1;
        }
        
        lastRequestTime.current = now;

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
                // 🔒 Security: Sanitize email before sending
                const sanitizedEmail = email.trim().toLowerCase();
                
                const result = await authService.checkEmailAvailability(sanitizedEmail);
                
                setIsAvailable(result.available);
                setError(null);
                setIsChecking(false);
            } catch (err: any) {
                if (import.meta.env.DEV) {
                    console.error("Email availability check failed:", err.message || err);
                }
                
                // Distinguish between network errors and server errors
                if (err.code === "ERR_NETWORK" || !err.response) {
                    setError("Cannot connect to server. Please check your connection.");
                } else if (err.response?.status === 429) {
                    setError("Too many requests. Please wait a moment and try again.");
                } else if (err.response?.status === 400) {
                    setError("Invalid email format.");
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
