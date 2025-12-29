import { useState } from "react";


function EventLogin() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-container">
      <div className={`flipper ${isFlipped ? "flip" : ""}`}>
        <div className="front">
          <h1 className="title">Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="button" value="Login" />
          </form>
          <a
            className="flipbutton"
            onClick={() => setIsFlipped(true)}
          >
            Create my account →
          </a>
        </div>

        <div className="back">
          <h1 className="title">Register</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="button" value="Sign up" />
          </form>
          <a
            className="flipbutton"
            onClick={() => setIsFlipped(false)}

          >
            Login to my account →
          </a>
        </div>
      </div>
    </div>
  );
}

export default EventLogin;
