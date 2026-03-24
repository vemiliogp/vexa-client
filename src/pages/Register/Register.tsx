import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router"
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
import { useRegister } from "./useRegister"

const registerSchema = z.object({
  fullName: z.string().trim().optional(),
  email: z.email({ message: "Ingresa un correo valido" }),
  password: z.string().min(8, { message: "La contrasena debe tener al menos 8 caracteres" }),
})

type RegisterValues = z.infer<typeof registerSchema>

export const RegisterPage = () => {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  })

  const { register, registerErrorMessage, isPending } = useRegister()

  const onSubmit = (values: RegisterValues) => {
    return register(values)
  }

  return (
    <div className="page">
      <aside className="panel-left">
        <div className="mt-auto">
          <p className="quote">
            "La simplicidad es la maxima sofisticacion."
          </p>
          <p className="author">Leonardo da Vinci</p>
        </div>
      </aside>

      <main className="panel-right">
        <Link to="/" className="login-link">
          Iniciar sesión
        </Link>
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <h1>Crear cuenta</h1>
            <p className="subtitle">Ingresa tus datos para registrarte</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre (opcional)</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        autoComplete="name"
                        placeholder="Escribe tu nombre"
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
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="Escribe tu correo electrónico"
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
                        placeholder="Escribe tu contraseña"
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
                disabled={isPending}
              >
                {isPending ? "Registrando..." : "Registrarme"}
              </Button>

              {registerErrorMessage ? (
                <p className="text-sm text-red-600" role="alert">
                  {registerErrorMessage}
                </p>
              ) : null}
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
