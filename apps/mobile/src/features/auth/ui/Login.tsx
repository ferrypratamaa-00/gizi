import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldError,
    Button,
    Input,
} from "@repo/ui/components";
import { useLoginForm } from "../hooks/useLoginForm";
import { LogIn, Phone } from "lucide-react";

export const LoginForm = () => {
    const { form } = useLoginForm();
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
        >
            <FieldGroup>
                <FieldSet>
                    <form.Field
                        name="phoneNumber"
                        children={(field) => (
                            <Field>
                                <FieldLabel
                                    htmlFor={field.name}
                                    className="flex items-center"
                                >
                                    <Phone className="text-secondary w-3 h-3" />
                                    <span>Nomor Handphone</span>
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    placeholder="Masukkan Nomor Handphone"
                                />
                                <FieldError errors={field.state.meta.errors} />
                            </Field>
                        )}
                    />
                </FieldSet>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full bg-primary hover:bg-secondary-foreground text-white h-12 text-base rounded-xl"
                        >
                            {isSubmitting ? "Masuk..." : "Masuk"}
                            <LogIn />
                        </Button>
                    )}
                />
            </FieldGroup>
        </form>
    );
};
