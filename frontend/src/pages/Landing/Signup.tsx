import "./Auth.css";

const Signup = ({
  setIsSignupModalOpen,
  setIsLoginModalOpen,
}: {
  setIsSignupModalOpen: (open: boolean) => void;
  setIsLoginModalOpen: (open: boolean) => void;
}) => {
  return (
    <div className="modal-overlay">
    <div className="auth-modal">
      <div className="header">
        <h1>Signup</h1>
        <button
          onClick={() => {
            console.log("clicked");
            setIsSignupModalOpen(false);
          }}
        >
          x
        </button>
      </div>
      <form action="#">
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit" onClick={(e) => {
          e.preventDefault();
          alert("Signup submitted");
        }}>
          Signup
        </button>
      </form>
      <div className="footer">
        <p>
          Already have an account? <button onClick={() => {
            setIsSignupModalOpen(false);
            setIsLoginModalOpen(true);
          }}>Login</button>
        </p>
      </div>
    </div>
    </div>
  );
};

export default Signup;
