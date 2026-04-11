import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, registerUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   try {
     if (form.password.length < 6) {
       toast.error("Password must be at least 6 characters");
       return;
     }
 
     await dispatch(registerUser(form)).unwrap();
     navigate("/");
   } catch (error) {
     toast.error(error?.message || "Registration failed");
   }
  };

  const fields = [
    {
      name: "name",
      type: "text",
      placeholder: "John Doe",
      icon: FiUser,
      label: "Full Name",
      required: true,
    },
    {
      name: "email",
      type: "email",
      placeholder: "you@example.com",
      icon: FiMail,
      label: "Email Address",
      required: true,
    },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-ink-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-ink-950 font-bold font-display text-xl">
              R
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl text-ink-900">
            Create your account
          </h1>
          <p className="text-ink-500 text-sm mt-1.5 ">
            Start renting in minutes — it's free
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(
              ({ name, type, placeholder, icon: Icon, label, required }) => (
                <div key={name}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                    {label}
                    {required && " *"}
                  </label>
                  <div className="relative">
                    <Icon
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required={required}
                      placeholder={placeholder}
                      className="input-field pl-11"
                    />
                  </div>
                </div>
              ),
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Password *
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-2xl font-bold mt-2"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <FiArrowRight size={15} />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-700 font-bold hover:text-brand-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
