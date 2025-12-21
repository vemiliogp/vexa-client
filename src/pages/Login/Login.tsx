import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "./useLogin";

const loginSchema = z.object({
  email: z.email({ message: "Ingresa un correo valido" }),
  password: z
    .string()
    .min(8, { message: "La contrasena debe tener al menos 8 caracteres" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const { login, loginErrorMessage, isPending } = useLogin();

  const onSubmit = async (values: LoginValues) => {
    const result = await login(values);
    if (result) {
      navigate("/connections");
    }
  };

  return (
    <div className="page">
      <aside className="panel-left">
        <div className="brand">
          <span>Vexa</span>
        </div>

        <div>
          <p className="quote">
            "Todo debe hacerse tan simple como sea posible, pero no más simple."
          </p>
          <p className="author">Albert Einstein</p>
        </div>
      </aside>

      <main className="panel-right">
        <Link to="/register" className="login-link">
          Crear cuenta
        </Link>

        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2">
            <h1>Iniciar sesión</h1>
            <p className="subtitle">
              Ingresa tu correo y contraseña para continuar
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
                        autoComplete="current-password"
                        placeholder="Escribe tu contraseña"
                        className="field"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Ingresando..." : "Ingresar"}
              </Button>

              {loginErrorMessage ? (
                <p className="text-sm text-red-600" role="alert">
                  {loginErrorMessage}
                </p>
              ) : null}
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};
