import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import Button from '@/components/Button'
import Card from '@/components/Card'

const loginSchema = z.object({
  name: z.string().min(3, 'Account name must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data)
    } catch (error) {
      // Error is handled by the context
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card title="Login">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {loginError.message || 'Login failed. Please check your credentials.'}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Account Name
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoggingIn}>
            Login
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700">
            Register here
          </Link>
        </p>
      </Card>
    </div>
  )
}
