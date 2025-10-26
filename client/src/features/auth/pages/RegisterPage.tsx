import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar28 } from "@/components/date-picker-with-input";

export const formSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    middleName: z.string().optional(), // optional field
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name too long"),
    extensionName: z.string().optional(), // e.g., Jr., Sr., III
    dateOfBirth: z
      .string()
      .refine(
        (val) => !isNaN(Date.parse(val)),
        "Date of birth must be a valid date",
      ),
    contactNumber: z
      .string()
      .regex(
        /^(09|\+639)\d{9}$/,
        "Enter a valid Philippine mobile number (e.g., 09123456789)",
      ),
    email: z.email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const form = useForm<FormValues>({
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
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center space-y-8 bg-green-50 p-6 md:p-10">
      <Link
        className="text-4xl font-extrabold tracking-tight text-balance text-green-500"
        to="/"
      >
        bridge
      </Link>

      <div className="w-full max-w-sm md:max-w-xl">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription>
                Quick registration - complete verification after account
                creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="middleName">
                      Middle Name{" "}
                      <span className="text-gray-300">(Optional)</span>
                    </FieldLabel>
                    <Input id="middleName" type="text" placeholder="Santos" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Dela Cruz"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="extensionName">
                      Extension{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </FieldLabel>
                    <Select>
                      <SelectTrigger id="extensionName">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jr">Jr.</SelectItem>
                        <SelectItem value="sr">Sr.</SelectItem>
                        <SelectItem value="ii">II</SelectItem>
                        <SelectItem value="iii">III</SelectItem>
                        <SelectItem value="iv">IV</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Calendar28 />

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="contactNumber">
                      Contact Number
                    </FieldLabel>
                    <Input
                      id="contactNumber"
                      type="tel"
                      placeholder="09123456789"
                      required
                    />
                  </Field>

                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input id="password" type="password" required />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input id="confirm-password" type="password" required />
                      </Field>
                    </Field>
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <Button type="submit">Create Account</Button>
                    <FieldDescription className="text-center">
                      Already have an account? <a href="#">Sign in</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
