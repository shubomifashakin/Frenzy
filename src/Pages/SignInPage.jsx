import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../Helpers/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckBox } from "../Reusables/CheckBox";

function SignInPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="h-dvh px-8 py-2 md:px-9 md:py-[2rem] bg-primaryBg">
      <div className="flex flex-col items-center justify-center gap-5 h-full">
        <p className="flex items-center font-semibold text-primaryTxt">
          <CheckBox checked={checked} setChecked={setChecked} />
          &nbsp;&nbsp;
          {checked ? "Log In" : "Sign Up"}
        </p>

        {checked ? <LogIn /> : <SignUp />}
      </div>
    </div>
  );
}

function LogIn() {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { handleSubmit, register, formState } = useForm();

  const { errors } = formState;

  async function handleLogIn(userInfo) {
    try {
      //user logs in w the info passed
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword(userInfo);

      //if there was an error loggin in show it
      if (error) {
        throw new Error(error.message);
      }

      //get the id of the user
      const { id } = user;

      //go to the logged page
      navigate(`timeline/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="animate-flash w-full md:w-1/2 min-h-[350px] md:min-h-[400px] ">
      <Header>Log In</Header>
      <form onSubmit={handleSubmit(handleLogIn)}>
        <InputGroup label={"Email"} errors={errors?.email?.message}>
          <input
            className="border border-solid p-2 outline-none rounded-md font-semibold"
            type="email"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Password"} errors={errors?.password?.message}>
          <input
            className="border border-solid p-2 outline-none rounded-md font-semibold"
            type="password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
            })}
          />
        </InputGroup>

        <Button>Log In</Button>
      </form>
    </div>
  );
}

function SignUp() {
  const navigate = useNavigate();

  const { handleSubmit, register, getValues, formState } = useForm();
  const { errors } = formState;

  async function handleSignUp(userInfo) {
    const { email, password } = userInfo;
    try {
      //user logs in w the info passed
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({ email, password });

      //if there was an error loggin in show it
      if (error) {
        throw new Error(error.message);
      }

      //get the id of the user
      const { id } = user;

      //go to the logged page
      navigate(`timeline/${id}`);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="animate-flash w-full md:w-1/2 min-h-[350px] md:min-h-[400px] ">
      <Header>Sign Up</Header>
      <form className="gap-4 w-full " onSubmit={handleSubmit(handleSignUp)}>
        <InputGroup label={"Email"} errors={errors?.email?.message}>
          <input
            className="border-4 border-primaryTextColor transition-all ease-in-out duration-500 border-solid hover:border-orange-300 bg-primaryTextColor p-2 outline-none rounded-md font-semibold text-primaryBg"
            type="email"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Password"} errors={errors?.password?.message}>
          <input
            className="border-4 border-primaryTextColor transition-all ease-in-out duration-500 border-solid hover:border-orange-300 bg-primaryTextColor p-2 outline-none rounded-md font-semibold text-primaryBg"
            type="password"
            {...register("password", {
              required: { value: true, message: "Please enter your password" },
              minLength: { value: 7, message: "At least 7 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
                message:
                  "Must contain an uppercase, lowercase letter and a number",
              },
            })}
          />
        </InputGroup>

        <InputGroup
          label={"Re-type Password"}
          errors={errors?.validatedPassword?.message}
        >
          <input
            className="border-4 border-primaryTextColor transition-all ease-in-out duration-500 border-solid hover:border-orange-300 bg-primaryTextColor p-2 outline-none rounded-md font-semibold text-primaryBg"
            type="password"
            {...register("validatedPassword", {
              required: {
                value: true,
                message: "Please enter your password again",
              },
              validate: {
                function(val) {
                  return val === getValues().password
                    ? true
                    : "Password does not match";
                },
              },
            })}
          />
        </InputGroup>

        <Button>Sign Up</Button>
      </form>
    </div>
  );
}

export default SignInPage;

function InputGroup({ label, children, errors }) {
  return (
    <div className="flex flex-col mb-4 ">
      <label className="font-semibold text-primaryTxt mb-2">{label}</label>
      {errors ? (
        <p className="text-xs font-medium text-red-500">{errors}</p>
      ) : null}
      {children}
    </div>
  );
}

function Button({ children }) {
  return (
    <button className="bg-primaryTextColor duration-500 hover:text-orange-300 text-primaryBg font-semibold rounded-md p-3 border-primaryTextColor hover:border-orange-300  border-4">
      {children}
    </button>
  );
}

function Header({ children }) {
  return (
    <h2 className="text-3xl mb-4 font-extrabold  text-headerTxt ">
      {children}
    </h2>
  );
}
