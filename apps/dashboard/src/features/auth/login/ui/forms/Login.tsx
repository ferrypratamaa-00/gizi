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
                    <FieldLegend className='text-3xl font-bold'>Selamat Datang Kembali</FieldLegend>
                    <FieldDescription>
                        Masukkan kredensial Anda untuk masuk ke dalam aplikasi
                    </FieldDescription>

                    <FieldGroup>
                        {/* Field ID */}
                        <form.Field
                            name="tenantId"
                            children={(field) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Tenant ID</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter Your Tenant ID"
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
                        <Button 
                            type="submit" 
                            disabled={!canSubmit} 
                            className="w-full bg-primary hover:bg-secondary-foreground text-white h-12 text-base rounded-xl"
                        >
                            {isSubmitting ? 'Masuk...' : 'Masuk'}
                        </Button>
                    )}
                />
            </FieldGroup>
        </form>
    )
}