import { useState, useEffect } from "react";
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
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import StepPersonalInfo from "./StepPersonalInfo";
import StepContactInfo_New from "./StepContactInfo_New";
import StepSecuritySetup from "./StepSecuritySetup";
import { FieldGroup, FieldDescription } from "@/components/ui/field";

export const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (stepIndex === 2)
      return fields[0] && fields[1] && fields[2] && fields[0] === fields[1]; // password match
    return fields.every((field) => field); // for other steps, check if all fields are filled
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
      setDirection("forward");
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection("backward");
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    if (isSubmitting || isLoading) return;
    setIsSubmitting(true);
    clearError();
    console.log("Submitting registration with data:", data);
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
  const StepButton = ({ type, onClick, disabled, children }) => (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="ml-auto flex items-center gap-2 transition-all hover:scale-105"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 rounded-xl lg:rounded-none lg:border-none lg:shadow-none">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="p-4 md:p-6">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
                Create account
              </h2>
            </div>

            <Progress
              value={(step / 3) * 100}
              className="h-2 transition-all duration-500 ease-in-out"
            />

            <div className="text-muted-foreground flex justify-between text-xs">
              <span
                className={`${step >= 1 ? "text-primary font-medium" : ""}`}
              >
                Personal Info
              </span>
              <span
                className={`${step >= 2 ? "text-primary font-medium" : ""}`}
              >
                Contact Info
              </span>
              <span
                className={`${step >= 3 ? "text-primary font-medium" : ""}`}
              >
                Security Setup
              </span>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {step === 1 && <StepPersonalInfo />}
            {step === 2 && <StepContactInfo_New />}
            {step === 3 && <StepSecuritySetup />}
          </div>

          {error && (
            <div className="my-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
              <span className="text-red-600">⚠️</span>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="my-6 flex items-center justify-between gap-4">
            {step > 1 && (
              <StepButton type="button" onClick={prevStep} disabled={isLoading}>
                <ArrowLeft /> Back
              </StepButton>
            )}

            {step < 3 ? (
              <StepButton
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(step - 1) || isLoading}
              >
                Next <ArrowRight size={16} />
              </StepButton>
            ) : (
              <StepButton
                type="submit"
                onClick={nextStep}
                disabled={!isStepValid(2) || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check /> Create Account
                  </>
                )}
              </StepButton>
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
