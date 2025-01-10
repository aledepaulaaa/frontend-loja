import { FiLock, FiMail, FiUser } from "react-icons/fi";

//internal import
import Layout from "@layout/Layout";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import useLoginSubmit from "@hooks/useLoginSubmit";
import BottomNavigation from "@components/login/BottomNavigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";

const SignUp = () => {
  const {
    user,
    setShowPass,
    showPass,
    setUser,
    register,
    submitHandlerRegister,
    errors,
    loading
  } = useLoginSubmit();

  return (
    <Layout title="Signup" description="this is sign up page">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        <div className="py-4 flex flex-col lg:flex-row w-full">
          <div className="w-full sm:p-5 lg:p-8">
            <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
              <div className="overflow-hidden mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold font-serif">Signing Up</h2>
                  <p className="text-sm md:text-base text-gray-500 mt-2 mb-8 sm:mb-10">
                    Create an account by sign up with provider.
                  </p>
                </div>
                <form
                  className="flex flex-col justify-center mb-6"
                  onSubmit={submitHandlerRegister}
                >
                  <div className="grid grid-cols-1 gap-5">
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={user.name || ""}
                        Icon={FiUser}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                      />

                      <Error errorName={errors.name} />
                    </div>

                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        Icon={FiMail}
                      />
                      <Error errorName={errors.email || ""} />
                    </div>
                    <div className="form-group relative">
                        <InputArea
                          register={register}
                          label="Password"
                          name="password"
                          type={showPass ? "text" : "password"}
                          value={user.password || ""}
                          onChange={(e) => setUser({ ...user, password: e.target.value })}
                          placeholder="Password"
                          Icon={FiLock}
                        />
                        <button
                          type="button"
                          className="text-gray-950 absolute inset-y-0 right-0 pr-3 top-5 flex items-center text-sm"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? (<AiFillEyeInvisible />) : (<AiFillEye />)}
                        </button>
                      <Error errorName={errors.password} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          href="/auth/forget-password"
                          className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    {loading ? (
                      <button
                        disabled={loading}
                        className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none bg-emerald-500 text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-emerald-600 h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
                      >
                        <img
                          src="/loader/spinner.gif"
                          alt="Loading"
                          width={20}
                          height={10}
                        />
                        <span className="font-serif ml-2 font-light">
                          Processing
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={loading}
                        type="submit"
                        className="w-full text-center py-3 rounded bg-emerald-500 text-white hover:bg-emerald-600 transition-all focus:outline-none my-1"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </form>
                <BottomNavigation
                  desc
                  route={"/auth/login"}
                  pageName={"Login"}
                  loginTitle="Sign Up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
