import AuthForm from "../components/AuthForm";

function UpdatePasswordPage({ onUpdatePassword }) {
    return (
        <AuthForm
            title="Update Password"
            submitLabel="Update password"
            resetOnSubmit
            fields={[
                {
                    name: "currentPassword",
                    label: "Current password",
                    placeholder: "Current password",
                    type: "password",
                    autoComplete: "current-password",
                },
                {
                    name: "newPassword",
                    label: "New password",
                    placeholder: "New password",
                    type: "password",
                    autoComplete: "new-password",
                },
                {
                    name: "confirmPassword",
                    label: "Confirm new password",
                    placeholder: "Confirm new password",
                    type: "password",
                    autoComplete: "new-password",
                },
            ]}
            validate={(values) => {
                if (!values.currentPassword) return "Current password is required.";
                if (!values.newPassword || values.newPassword.length < 6) return "New password must be at least 6 characters.";
                if (values.newPassword !== values.confirmPassword) return "Passwords do not match.";
                return "";
            }}
            onSubmit={async (values) => {
                await onUpdatePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword,
                });
                return "Password updated.";
            }}
        />
    );
}

export default UpdatePasswordPage;
