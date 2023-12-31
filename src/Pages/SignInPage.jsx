import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../Helpers/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CheckBox } from "../Reusables/CheckBox";

function SignInPage() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="h-dvh px-8 py-2 md:px-9 md:py-[2rem] bg-primaryColor">
      <div className="flex flex-col items-center justify-center gap-5 h-full">
        <p className="animate-flash flex items-center font-semibold text-tertiaryColor">
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

        <div className="flex-cols md:flex justify-between items-center">
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
    <div className="flex flex-col mb-4 ">
      <label className="font-semibold text-tertiaryColor mb-2">{label}</label>
      {errors ? (
        <p className="text-xs font-medium text-red-500">{errors}</p>
      ) : null}
      {children}
    </div>
  );
}

function Button({ children }) {
  return (
    <button className="bg-secondaryColor duration-500 transition-all ease-in-out hover:text-orange-300 text-primaryColor font-semibold rounded-md p-3 border-secondaryColor hover:border-secondaryColorHover border-2">
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
