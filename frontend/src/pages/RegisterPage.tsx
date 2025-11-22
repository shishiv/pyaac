import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import Button from '@/components/Button'
import Card from '@/components/Card'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Account name must be at least 3 characters')
      .max(32, 'Account name must be at most 32 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Account name must be alphanumeric'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerAccount, isRegistering, registerError } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerAccount({
        name: data.name,
        password: data.password,
        email: data.email || undefined,
      })
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card title="Create Account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registerError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {registerError.message || 'Registration failed. Please try again.'}
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email (optional)
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isRegistering}>
            Create Account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  )
}
