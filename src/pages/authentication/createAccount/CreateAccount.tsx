import CreateAccountForm from "../../../components/pages/authentication/createAccount/CreateAccountForm"

const CreateAccount = () => {
  return (
    <div className="relative flex flex-col w-full">
      {/* Create Account Form Container */}
      <div className="flex items-center justify-center">
        <CreateAccountForm />
      </div>
    </div>
  )
}

export default CreateAccount