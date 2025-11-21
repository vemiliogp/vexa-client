import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

const loginSchema = z.object({
  email: z.string().email("Ingresa un correo valido"),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
})

type LoginValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: LoginValues) => {
    console.log("Login submit", values)
  }

  return (
    <div className="page">
      <aside className="panel-left">
        <div className="brand">
          <span>Vexa</span>
        </div>

        <div>
          <p className="quote">
            "La curiosidad construye el futuro, y la IA es el copiloto que nos
            recuerda que no existe pregunta pequena."
          </p>
          <p className="author">John Smith</p>
        </div>
      </aside>

      <main className="panel-right">
        <a href="register.html" className="login-link">
          Crear cuenta
        </a>

        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <h1>Iniciar sesion</h1>
            <p className="subtitle">
              Ingresa tu correo y contrasena para continuar
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="correo@ejemplo.com"
                        className="field"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrasena</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder="Contrasena"
                        className="field"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                Ingresar
              </Button>
            </form>
          </Form>

          <Separator />

          <p className="terms">
            Al ingresar aceptas nuestros <a href="#">Terminos de servicio</a> y{" "}
            <a href="#">Politicas de privacidad</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
