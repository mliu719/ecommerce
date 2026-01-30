import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function SignUpPage({ onSignUp }) {
    const nav = useNavigate();

    return (
        <AuthForm
            title="Sign up"
            submitLabel="Create account"
            fields={[
                {
                    name: "email",
                    label: "Email",
                    placeholder: "Email",
                    autoComplete: "email",
                },
                {
                    name: "password",
                    label: "Password",
                    placeholder: "Password",
                    type: "password",
                    autoComplete: "new-password",
                },
                {
                    name: "role",
                    label: "Role",
                    type: "select",
                    defaultValue: "customer",
                    options: [
                        { value: "customer", label: "customer" },
                        { value: "owner", label: "owner" },
                    ],
                },
            ]}
            validate={(values) => {
                const cleanEmail = values.email.trim();
                if (!cleanEmail) return "Email is required";
                if (!cleanEmail.includes("@")) return "Please enter a valid email";
                if (!values.password || values.password.length < 6) return "Password must be at least 6 characters";
                return "";
            }}
            onSubmit={async (values) => {
                await onSignUp({
                    email: values.email.trim(),
                    password: values.password,
                    role: values.role || "customer",
                });
                nav("/shop", { replace: true });
                return "";
            }}
            footer={
                <>
                    Have an account? <Link to="/signin">Sign in</Link>
                </>
            }
        />
    );
}
