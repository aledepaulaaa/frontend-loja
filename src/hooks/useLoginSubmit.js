import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios"

//internal import

import { notifyError, notifySuccess } from "@utils/toast";

const useLoginSubmit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const redirectUrl = useSearchParams().get("redirectUrl");
  const registerUrl = process.env.NEXT_PUBLIC_REGISTER_URL // Production url

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false, // Changed to false to handle redirection manually
      email: user.email,
      password: user.password,
      callbackUrl: "/user/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      notifyError(result?.error);
      console.error("Error during sign-in:", result.error);
      // Handle error display here
    } else if (result?.ok) {
      const url = redirectUrl ? "/checkout" : result.url;
      router.push(url);
    }
  };

  const submitHandlerRegister = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const result = await axios.post(registerUrl, user, {
        headers: {
          ContentType: 'application/json',
        }
      });
      if (result.status === 201) {
        notifySuccess(result.data.message);
        router.push("/user/dashboard");
        setUser({});
      } else {
        notifyError(result.data.message);
      }
    } catch (error) {
      console.log("Erro ao tentar criar conta", error);
      notifyError("Houve um problema ao criar a conta.");
    } finally {
      setLoading(false)
    }
  };

  return {
    user,
    setUser,
    register,
    errors,
    loading,
    handleSubmit,
    submitHandler,
    showPass,
    setShowPass,
    submitHandlerRegister,
  };
};

export default useLoginSubmit;
