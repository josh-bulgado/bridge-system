import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { StepPersonalInfo, StepContactInfo, StepSecuritySetup } from "./";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useRegistration } from "../hooks/useRegistration";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, Mail, User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { CheckCircle, User, Mail, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const navigate = useNavigate();

  // TanStack Query + Axios hook
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

  // Watch required fields for each step
  const step1Fields = watch(["firstName", "lastName", "dateOfBirth"]);
  const step2Fields = watch(["contactNumber", "email"]);
  const step3Fields = watch(["password", "confirmPassword", "agreeToTerms"]);

  // Check if step 1 required fields are filled
  const isStep1Valid = step1Fields[0] && step1Fields[1] && step1Fields[2];

  // Check if step 2 required fields are filled
  const isStep2Valid = step2Fields[0] && step2Fields[1];

  // Check if step 3 required fields are filled and passwords match
  const isStep3Valid =
    step3Fields[0] &&
    step3Fields[1] &&
    step3Fields[2] &&
    step3Fields[0] === step3Fields[1]; // password === confirmPassword

  // Handle successful registration
  useEffect(() => {
    if (success && data) {
      // Clear any previous errors
      clearError();

      // Get the email from the form
      const registeredEmail = methods.getValues("email");

      // Navigate to account created page
      navigate("/account-created", {
        state: {
          email: registeredEmail,
        },
      });
    }
  }, [success, data, navigate, clearError, methods]);

  const nextStep = () => {
    if (step < 3) {
      setDirection('forward');
      setStep(step + 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection('backward');
      setStep(step - 1);
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    // Clear any previous errors
    console.log(data);
    // clearError();

    // Submit registration data
    register(data);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl lg:rounded-none lg:border-none lg:shadow-none">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="darktext-white p-4 md:p-6"
        >
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                Create account
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                {step === 1 ? <User /> : step === 2 ? <Mail /> : <Lock />}
                Step {step} of 3
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={(step / 3) * 100} className="h-2 transition-all duration-500 ease-in-out" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span className={`transition-colors duration-300 ${step >= 1 ? "text-primary font-medium" : ""}`}>
                  {step > 1 && "✓ "}Personal Info
                </span>
                <span className={`transition-colors duration-300 ${step >= 2 ? "text-primary font-medium" : ""}`}>
                  {step > 2 && "✓ "}Contact Info
                </span>
                <span className={`transition-colors duration-300 ${step >= 3 ? "text-primary font-medium" : ""}`}>
                  Security Setup
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {step === 1 && (
              <div
                key="step-1"
                className={`animate-in fade-in ${direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} duration-300`}
              >
                <StepPersonalInfo />
              </div>
            )}
            {step === 2 && (
              <div
                key="step-2"
                className={`animate-in fade-in ${direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} duration-300`}
              >
                <StepContactInfo />
              </div>
            )}
            {step === 3 && (
              <div
                key="step-3"
                className={`animate-in fade-in ${direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4'} duration-300`}
              >
                <StepSecuritySetup />
              </div>
            )}
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="my-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="my-6 flex items-center justify-between gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="flex items-center gap-2 transition-all hover:scale-105"
              >
                ← Back
              </Button>
            )}

            {step === 1 ? (
              <Button
                type="button"
                className="ml-auto flex items-center gap-2 transition-all hover:scale-105"
                onClick={nextStep}
                variant="default"
                disabled={!isStep1Valid || isLoading}
              >
                Next →
              </Button>
            ) : step === 2 ? (
              <Button
                type="button"
                className="ml-auto flex items-center gap-2 transition-all hover:scale-105"
                onClick={nextStep}
                variant="default"
                disabled={!isStep2Valid || isLoading}
              >
                Next →
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-all hover:scale-105 hover:shadow-lg"
                disabled={!isStep3Valid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>✓ Create Account</>
                )}
              </Button>
            )}
          </div>
          <FieldGroup>
            <FieldDescription className="text-center">
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </FormProvider>
    </div>
  );
};
