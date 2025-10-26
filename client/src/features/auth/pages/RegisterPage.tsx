import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import StepPersonalInfo from "../components/StepPersonalInfo";
import StepContactInfo from "../components/StepContactInfo";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { formSchema, type FormValues } from "../schemas/registerSchema";

import { FieldDescription, FieldGroup } from "@/components/ui/field";

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const nextStep = async () => {
    const isValid = await methods.trigger([
      "firstName",
      "lastName",
      "dateOfBirth",
    ]);
    if (isValid) setStep(2);
  };

  const prevStep = () => setStep(1);

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-6">
      <Link to="/" className="mb-4 text-4xl font-extrabold text-green-500">
        bridge
      </Link>

      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-8 text-center">
          <div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Quick registration - complete verification after account creation
            </CardDescription>
          </div>
          <div className="text-left">
            <CardTitle>
              {step === 1 ? "Personal Information" : "Contact & Account Info"}
            </CardTitle>
            {/* <CardDescription>Step {step} of 2</CardDescription> */}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {step === 1 && <StepPersonalInfo />}
              {step === 2 && <StepContactInfo />}

              <div className="mt-6 flex justify-between">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                )}

                {step === 1 ? (
                  <Button
                    type="button"
                    className="ml-auto bg-green-600 text-white"
                    onClick={nextStep}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto bg-green-600 text-white"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>

          <FieldGroup>
            <FieldDescription className="text-center">
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </FieldDescription>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
