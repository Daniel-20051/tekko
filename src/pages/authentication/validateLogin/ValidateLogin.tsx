import ValidateLoginForm from "../../../components/pages/authentication/validateLogin/ValidateLoginForm"

const ValidateLogin = () => {
  return (
    <div className="relative flex flex-col w-full">
      {/* Validate Login Form Container */}
      <div className="flex items-center justify-center">
        <ValidateLoginForm />
      </div>
    </div>
  )
}

export default ValidateLogin