import { useLoginForm } from '../../hooks/useLoginForm'
import { Field, FieldLabel, Input, Button, FieldGroup, FieldSet, FieldLegend, FieldDescription, FieldError } from '@repo/ui/components'

export const LoginForm = () => {
    const { form } = useLoginForm()

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="w-full max-w-sm"
        >
            <FieldGroup>
                <FieldSet>
                    <FieldLegend className='text-3xl font-bold'>Welcome Back</FieldLegend>
                    <FieldDescription>
                        Enter your credentials to access your account
                    </FieldDescription>

                    <FieldGroup>
                        {/* Field Email */}
                        <form.Field
                            name="email"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="email@example.com"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        />

                        {/* Field Password */}
                        <form.Field
                            name="password"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="******"
                                    />
                                    <FieldError errors={field.state.meta.errors} />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldSet>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit} className="w-full">
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    )}
                />
            </FieldGroup>
        </form>
    )
}