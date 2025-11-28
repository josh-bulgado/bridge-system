/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useRegistration } from "../hooks/useRegistration";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import StepPersonalInfo from "./StepPersonalInfo";
import StepSecuritySetup from "./StepSecuritySetup";
import StepContactInfo from "./StepContactInfo";

// Context to share email availability state
interface EmailAvailabilityContextType {
  setEmailAvailable: (available: boolean | null) => void;
}

const EmailAvailabilityContext = createContext<EmailAvailabilityContextType>({
  setEmailAvailable: () => {},
});

export const useEmailAvailabilityContext = () => useContext(EmailAvailabilityContext);

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { register, isLoading, error, success, data, clearError } =
    useRegistration();
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      dateOfBirth: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onBlur",
  });
  const { watch } = methods;

  const stepFields = [
    watch(["firstName", "lastName", "dateOfBirth"]),
    watch(["contactNumber", "email"]),
    watch(["password", "confirmPassword", "agreeToTerms"]),
  ];

  // Validation checks for each step
  const isStepValid = (stepIndex: number) => {
    const fields = stepFields[stepIndex];
    const errors = methods.formState.errors;
    
    if (stepIndex === 0) {
      // Step 1: Personal Info
      const hasErrors = errors.firstName || errors.lastName || errors.dateOfBirth;
      const allFilled = fields[0] && fields[1] && fields[2];
      return allFilled && !hasErrors;
    }
    
    if (stepIndex === 1) {
      // Step 2: Contact Info - Check phone and email validation + availability
      const hasErrors = errors.contactNumber || errors.email;
      const allFilled = fields[0] && fields[1];
      
      // Check if phone number is valid (10 digits starting with 9)
      const phoneValid = fields[0] && /^9[0-9]{9}$/.test(fields[0]);
      
      // Check if email is available (not already registered)
      const emailIsAvailable = emailAvailable === true;
      
      return allFilled && !hasErrors && phoneValid && emailIsAvailable;
    }
    
    if (stepIndex === 2) {
      // Step 3: Security
      const hasErrors = errors.password || errors.confirmPassword || errors.agreeToTerms;
      const passwordsMatch = fields[0] === fields[1];
      const allFilled = fields[0] && fields[1] && fields[2];
      const isValid = allFilled && passwordsMatch && !hasErrors;
      
      // Debug logging in development
      // if (import.meta.env.DEV) {
      //   console.log('Step 3 Validation:', {
      //     password: fields[0] ? '✓ Filled' : '✗ Empty',
      //     confirmPassword: fields[1] ? '✓ Filled' : '✗ Empty',
      //     agreeToTerms: fields[2] ? '✓ Checked' : '✗ Unchecked',
      //     passwordsMatch: passwordsMatch ? '✓ Match' : '✗ No Match',
      //     hasErrors: hasErrors ? '✗ Has errors' : '✓ No errors',
      //     isValid: isValid ? '✓ Valid' : '✗ Invalid',
      //     formErrors: errors
      //   });
      // }
      
      return isValid;
    }
    
    return fields.every((field) => field);
  };

  // Handle successful registration - redirect directly to email verification
  useEffect(() => {
    if (success && data) {
      clearError();
      const registeredEmail = methods.getValues("email");
      navigate("/email-confirmation", {
        state: {
          email: registeredEmail,
          message: "Please verify your email to activate your account.",
        },
      });
    }
  }, [success, data, navigate, clearError, methods]);

  // Reset isSubmitting when loading completes
  useEffect(() => {
    if (!isLoading) setIsSubmitting(false);
  }, [isLoading]);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    clearError();
    register(data);
  };

  // Handle Enter key press for navigation
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      if (step < 3 && isStepValid(step - 1)) {
        nextStep();
      } else if (step === 3 && isStepValid(2)) {
        methods.handleSubmit(onSubmit)();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [step, isLoading, isSubmitting]);

  // Common Button Component


  return (
    <EmailAvailabilityContext.Provider value={{ setEmailAvailable }}>
      <div className="w-full max-w-xl">
        <Card className="border-none shadow-none lg:border lg:shadow-sm">
          <CardHeader className="space-y-6 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Create account</CardTitle>
              <div className="text-muted-foreground text-sm font-medium">
                Step {step} of 3
              </div>
            </div>

            <div className="space-y-2">
              <Progress
                value={(step / 3) * 100}
                className="h-2 transition-all duration-500 ease-in-out"
              />
              <div className="flex justify-between px-1">
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}
                >
                  Personal
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}
                >
                  Contact
                </span>
                <span
                  className={`text-xs font-medium transition-colors duration-300 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}
                >
                  Security
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                <div className="min-h-[480px] animate-in fade-in slide-in-from-right-4 duration-300">
                  {step === 1 && <StepPersonalInfo />}
                  {step === 2 && <StepContactInfo />}
                  {step === 3 && <StepSecuritySetup />}
                </div>

              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={step === 1 || isLoading}
                  className={`gap-2 h-10 ${step === 1 ? "invisible" : ""}`}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(step - 1) || isLoading}
                    className="gap-2 h-10 min-w-[100px]"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid(2) || isLoading || Object.keys(methods.formState.errors).length > 0}
                    className="gap-2 h-10 min-w-[140px]"
                    onClick={() => {
                      // if (import.meta.env.DEV) {
                      //   const hasErrors = Object.keys(methods.formState.errors).length > 0;
                      //   console.log('Create Account button clicked:', {
                      //     isStepValid: isStepValid(2),
                      //     isLoading,
                      //     hasFormErrors: hasErrors,
                      //     formErrors: methods.formState.errors,
                      //     errorFields: Object.keys(methods.formState.errors),
                      //   });
                      //   
                      //   if (hasErrors) {
                      //     console.warn('❌ Form has validation errors. Please fix them before submitting.');
                      //   }
                      // }
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" /> Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm pt-2">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/sign-in"
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>

              {/* Honeypot field */}
              <input
                type="text"
                {...methods.register("website")}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
    </EmailAvailabilityContext.Provider>
  );
};
