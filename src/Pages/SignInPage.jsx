import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../Helpers/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckBox } from "../Components/CheckBox";
import InputError from "../Components/InputError";

function SignInPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="h-dvh bg-primaryColor px-8 py-2 md:px-9 md:py-[2rem]">
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <p className="flex animate-flash items-center font-semibold text-tertiaryColor">
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

      //go to the timeline page
      navigate(`timeline/${id}`);
    } catch (error) {
      //alert the user
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-[350px] w-full animate-flash md:min-h-[400px] md:w-1/2 ">
      <Header>Log In</Header>
      <form onSubmit={handleSubmit(handleLogIn)}>
        <InputGroup label={"Email"} errors={errors?.email?.message}>
          <input
            className="input-style "
            type="email"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Password"} errors={errors?.password?.message}>
          <input
            className="input-style"
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

      //if there was an error signing up show it
      if (error) {
        throw new Error(error.message);
      }

      //get the id of the user
      const { id } = user;

      //go to the timeline page
      navigate(`timeline/${id}`);
    } catch (error) {
      //alert the user
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-[350px] w-full animate-flash md:min-h-[400px] md:w-1/2 ">
      <Header>Sign Up</Header>

      <form className="w-full gap-4 " onSubmit={handleSubmit(handleSignUp)}>
        <InputGroup label={"Username"} errors={errors?.username?.message}>
          <input
            type="text"
            className="input-style"
            {...register("username", {
              minLength: { value: 6, message: "Must be at least 6 characters" },
              maxLength: {
                value: 12,
                message: "Username must be 6-12 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username can contain only numbers, letters and underscores",
              },
              required: { value: true, message: "Please enter a username" },
            })}
          />
        </InputGroup>

        <InputGroup label={"Email"} errors={errors?.email?.message}>
          <input
            className="input-style"
            {...register("email", {
              required: { value: true, message: "Please enter your email" },
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
          />
        </InputGroup>

        <div className="flex-cols items-center justify-between md:flex">
          <InputGroup label={"Password"} errors={errors?.password?.message}>
            <input
              className="input-style"
              type="password"
              {...register("password", {
                required: {
                  value: true,
                  message: "Please enter your password",
                },
                minLength: { value: 7, message: "At least 7 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
                  message:
                    "Must contain uppercase & lowercase letters and a number",
                },
              })}
            />
          </InputGroup>

          <InputGroup
            label={"Re-type Password"}
            errors={errors?.validatedPassword?.message}
          >
            <input
              className="input-style"
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
        </div>

        <Button>Sign Up</Button>
      </form>
    </div>
  );
}

export default SignInPage;

function InputGroup({ label, children, errors }) {
  return (
    <div className="mb-4 flex flex-col ">
      <label className="mb-2 font-semibold text-tertiaryColor">{label}</label>
      {errors ? <InputError>{errors}</InputError> : null}
      {children}
    </div>
  );
}

export function Button({ children, size = "medium" }) {
  return (
    <button
      className={`rounded-md  bg-secondaryColor ${
        size === "medium" ? "p-3" : ""
      } ${
        size === "small" ? "px-3 py-1" : ""
      }  border font-semibold text-primaryColor ring  ring-secondaryColor ring-offset-2 transition-all duration-500 ease-in-out hover:border-black  hover:bg-secondaryColorHover hover:text-tertiaryColor hover:ring-offset-4 focus:scale-[0.9] focus:ring-2 focus:ring-secondaryColorHover focus:ring-offset-2 `}
    >
      {children}
    </button>
  );
}

function Header({ children }) {
  return (
    <h2 className="text-headerTxt mb-4 text-3xl  font-extrabold ">
      {children}
    </h2>
  );
}
