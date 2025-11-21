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

const registerSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email("Ingresa un correo valido"),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
})

type RegisterValues = z.infer<typeof registerSchema>

export const RegisterPage = () => {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: RegisterValues) => {
    console.log("Register submit", values)
  }

  return (
    <div className="page">
      <aside className="panel-left">
        <div className="brand">
          <span>Vexa</span>
        </div>

        <div>
          <p className="quote">
            "La simplicidad es la maxima sofisticacion."
          </p>
          <p className="author">Leonardo da Vinci</p>
        </div>
      </aside>

      <main className="panel-right">
        <a href="/" className="login-link">
          Iniciar sesión
        </a>
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <h1>Crear cuenta</h1>
            <p className="subtitle">Ingresa tus datos para registrarte</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre (opcional)</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        autoComplete="name"
                        placeholder="Tu nombre"
                        className="field"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="password"
                        autoComplete="new-password"
                        placeholder="Crea tu contraseña"
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
                Registrarme
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
