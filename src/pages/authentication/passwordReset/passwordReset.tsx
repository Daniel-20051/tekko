import PasswordResetForm from "../../../components/pages/authentication/passwordReset/passwordResetForm"

const PasswordReset = () => {
  return (
    <div className="relative flex flex-col w-full">
      {/* Password Reset Form Container */}
      <div className="flex items-center justify-center">
        <PasswordResetForm />
      </div>
    </div>
  )
}

export default PasswordReset

