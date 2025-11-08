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

      // Navigate to success page or sign-in page
      // You can customize this based on your app flow
      navigate("/sign-in", {
        state: {
          message: "Registration successful! Please sign in to continue.",
          registeredEmail: data.data.email,
        },
      });
    }
  }, [success, data, navigate, clearError]);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
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

            <p className="text-muted-foreground">
              Get instant access to barangay services - verify your identity
              later when needed
            </p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={(step / 3) * 100} className="h-2" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span className={step >= 1 ? "text-primary font-medium" : ""}>
                  Personal Info
                </span>
                <span className={step >= 2 ? "text-primary font-medium" : ""}>
                  Contact Info
                </span>
                <span className={step >= 3 ? "text-primary font-medium" : ""}>
                  Security Setup
                </span>
              </div>
            </div>
          </div>

          {step === 1 && <StepPersonalInfo />}
          {step === 2 && <StepContactInfo />}
          {step === 3 && <StepSecuritySetup />}

          {/* Error Message Display */}
          {error && (
            <div className="my-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
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
                className="flex items-center gap-2"
              >
                ← Back
              </Button>
            )}

            {step === 1 ? (
              <Button
                type="button"
                className="ml-auto flex items-center gap-2"
                onClick={nextStep}
                variant="default"
                disabled={!isStep1Valid || isLoading}
              >
                Next →
              </Button>
            ) : step === 2 ? (
              <Button
                type="button"
                className="ml-auto flex items-center gap-2"
                onClick={nextStep}
                variant="default"
                disabled={!isStep2Valid || isLoading}
              >
                Next →
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700"
                disabled={!isStep3Valid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
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
