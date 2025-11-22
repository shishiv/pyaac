import { useState } from 'react'
import { useAuthContext } from '@/context/AuthContext'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/lib/api'

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  })

type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export default function AccountSettingsPage() {
  const { account } = useAuthContext()
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { current_password: string; new_password: string }) => {
      const response = await apiClient.post('/api/v1/accounts/change-password', data)
      return response.data
    },
    onSuccess: () => {
      setIsChangePasswordModalOpen(false)
      reset()
      alert('Password changed successfully!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.detail || 'Failed to change password')
    },
  })

  const onSubmit = async (data: ChangePasswordForm) => {
    changePasswordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    })
  }

  if (!account) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading account...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-6">
        {/* Account Information */}
        <Card title="Account Information">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Account Name:</span>
              <span className="font-semibold">{account.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Email:</span>
              <span className="font-semibold">{account.email || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Characters:</span>
              <span className="font-semibold">
                {account.character_count} / 15
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
              <span className="font-semibold capitalize">
                {account.type === 1 ? 'Player' : account.type === 2 ? 'Tutor' : account.type === 3 ? 'Senior Tutor' : account.type === 4 ? 'Gamemaster' : account.type === 5 ? 'Community Manager' : account.type === 6 ? 'God' : 'Player'}
              </span>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Keep your account secure by using a strong password.
            </p>
            <Button onClick={() => setIsChangePasswordModalOpen(true)}>Change Password</Button>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        title="Change Password"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsChangePasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={changePasswordMutation.isPending}
            >
              Change Password
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              {...register('current_password')}
              type="password"
              id="current_password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.current_password && (
              <p className="mt-1 text-sm text-red-600">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="new_password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              {...register('new_password')}
              type="password"
              id="new_password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.new_password && (
              <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              {...register('confirm_password')}
              type="password"
              id="confirm_password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
            />
            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  )
}
