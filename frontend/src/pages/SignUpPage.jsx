import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LoaderIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const isPasswordValid = formData.password.length >= 6 && /[A-Z]/.test(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface px-4 py-8 md:py-12">
      <div className="relative w-full max-w-5xl rounded-[2rem] overflow-hidden">
        <BorderAnimatedContainer>
          <div className="flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex items-center justify-center bg-white">
              <div className="w-full max-w-sm">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-soft-blue">
                      C
                    </div>
                    <span className="text-xl font-bold text-ink tracking-tight">ChatterBox</span>
                  </div>
                  <h2 className="text-3xl font-bold text-ink mb-2">Create account</h2>
                  <p className="text-ink-muted text-sm leading-relaxed">Start messaging in seconds</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="johndoe@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Use 6+ chars with 1 uppercase"
                        aria-describedby="password-help"
                      />
                    </div>
                    <p id="password-help" className="mt-2 text-xs leading-relaxed text-ink-muted">
                      Use at least 6 characters and one uppercase letter.
                    </p>
                  </div>

                  <button className="auth-btn" type="submit" disabled={isSigningUp || !isPasswordValid}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-sm text-ink-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link inline-flex p-0 bg-transparent hover:bg-transparent">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION - RIGHT SIDE */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 lg:p-16 bg-gradient-to-br from-surface-secondary to-white">
              <div className="text-center space-y-6">
                <div className="w-40 h-40 mx-auto rounded-full bg-primary-light flex items-center justify-center">
                  <MessageCircleIcon className="w-20 h-20 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-ink">Start Your Journey Today</h3>
                <p className="text-ink-muted max-w-xs mx-auto text-sm leading-relaxed">
                  Join thousands of users connecting securely through ChatterBox.
                </p>
                <div className="flex justify-center gap-3">
                  <span className="auth-badge">Secure</span>
                  <span className="auth-badge">Global</span>
                  <span className="auth-badge">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default SignUpPage;
