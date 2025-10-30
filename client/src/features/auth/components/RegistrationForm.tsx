import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { StepPersonalInfo, StepContactInfo } from "./";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerSchema";
import { useRegistration } from "../hooks/useRegistration";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";

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
    },
    mode: "onBlur",
  });

  const { watch } = methods;

  // Watch required fields for each step
  const step1Fields = watch(["firstName", "lastName", "dateOfBirth"]);
  const step2Fields = watch([
    "contactNumber",
    "email",
    "password",
    "confirmPassword",
  ]);

  // Check if step 1 required fields are filled
  const isStep1Valid = step1Fields[0] && step1Fields[1] && step1Fields[2];

  // Check if step 2 required fields are filled and passwords match
  const isStep2Valid =
    step2Fields[0] &&
    step2Fields[1] &&
    step2Fields[2] &&
    step2Fields[3] &&
    step2Fields[2] === step2Fields[3]; // password === confirmPassword

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
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = (data: RegisterFormData) => {
    // Clear any previous errors
    console.log(data);
    // clearError();

    // Submit registration data
    // register(data);
  };

  return (
    <div className="flex flex-col gap-6 rounded-md border bg-white p-4 pb-8 shadow-sm lg:rounded-none lg:border-none lg:shadow-none">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="mb-8 flex flex-col gap-2">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Create account
            </h2>
            <p className="leading-7 not-first:mt-0">
              Get instant access to barangay services - verify your identity
              later when needed
            </p>
          </div>
          {step === 1 && <StepPersonalInfo />}
          {step === 2 && <StepContactInfo />}

          {/* Error Message Display */}
          {error && (
            <div className="my-4 rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="my-6 flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
              >
                Back
              </Button>
            )}

            {step === 1 ? (
              <Button
                type="button"
                className="ml-auto"
                onClick={nextStep}
                variant="default"
                disabled={!isStep1Valid || isLoading}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className="ml-auto bg-green-600 text-white"
                disabled={!isStep2Valid || isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
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

      <Separator />

      <p className="text-muted-foreground px-6 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};
