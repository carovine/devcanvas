import "./Auth.css";
const Login = ({
  setIsLoginModalOpen,
  setIsSignupModalOpen
}: {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsSignupModalOpen: (open: boolean) => void;
}) => {
  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <div className="header">
          <h1>Login</h1>
          <button
            onClick={() => {
            console.log("clicked");
            setIsLoginModalOpen(false);
          }}
        >
          x
        </button>
      </div>
      <form action="#">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          alert("Login submitted");
        }}>
          Login
        </button>
      </form>
      <div className="footer">
        <p>Don't have an account? <button onClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}>Sign Up</button></p>
      </div>
    </div>
    </div>
  );
};

export default Login;
