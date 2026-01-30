import { useMemo, useState } from "react";
import "./AuthForm.css";

function AuthForm({ title, submitLabel, fields, onSubmit, validate, footer, resetOnSubmit = false }) {
    const initialValues = useMemo(() => {
        const values = {};
        fields.forEach((f) => {
            values[f.name] = f.defaultValue ?? "";
        });
        return values;
    }, [fields]);

    const [values, setValues] = useState(initialValues);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const updateValue = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (validate) {
            const validationError = validate(values);
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        try {
            setLoading(true);
            const result = await onSubmit(values);
            if (typeof result === "string" && result) {
                setMessage(result);
            }
            if (resetOnSubmit) {
                setValues(initialValues);
            }
        } catch (ex) {
            setError(ex.message || "Request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2 className="auth-form__title">{title}</h2>
            {error ? <div className="auth-form__error">{error}</div> : null}
            {message ? <div className="auth-form__message">{message}</div> : null}

            <form onSubmit={handleSubmit} className="auth-form__body">
                {fields.map((field) => (
                    <label key={field.name} className="auth-form__field">
                        <span className="auth-form__label">{field.label}</span>
                        {field.type === "select" ? (
                            <select
                                value={values[field.name]}
                                onChange={(e) => updateValue(field.name, e.target.value)}
                                className="auth-form__input"
                            >
                                {field.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                value={values[field.name]}
                                onChange={(e) => updateValue(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                type={field.type || "text"}
                                autoComplete={field.autoComplete}
                                className="auth-form__input"
                            />
                        )}
                    </label>
                ))}

                <button type="submit" className="auth-form__submit" disabled={loading}>
                    {loading ? "Working..." : submitLabel}
                </button>
            </form>

            {footer ? <div className="auth-form__footer">{footer}</div> : null}
        </div>
    );
}

export default AuthForm;
