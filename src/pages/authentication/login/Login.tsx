import Login_Form from "../../../components/pages/authentication/login/Login_Form"
// import { Link } from "@tanstack/react-router"

const Login = () => {
    return(
        <div className="relative flex flex-col  w-full">
            

            {/* Login Form Container */}
            <div className="flex items-center justify-center ">
                <Login_Form />
            </div>
        </div>
    )
}

export default Login