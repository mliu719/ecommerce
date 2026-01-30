import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function SignInPage({ onSignIn }) {
    const nav = useNavigate();

    return (
        <AuthForm
            title="Please Sign in First"
            submitLabel="Sign in"
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
                    autoComplete: "current-password",
                },
            ]}
            validate={(values) => {
                const cleanEmail = values.email.trim();
                if (!cleanEmail) return "Email is required.";
                if (!cleanEmail.includes("@")) return "Please enter a valid email.";
                if (!values.password) return "Password is required.";
                return "";
            }}
            onSubmit={async (values) => {
                await onSignIn({ email: values.email.trim(), password: values.password });
                nav("/shop", { replace: true });
                return "";
            }}
            footer={
                <>
                    No account? <Link to="/signup">Sign up</Link>
                </>
            }
        />
    );
}


export default SignInPage;
