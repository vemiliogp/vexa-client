export const LoginPage = () => {
  return (
    <div className="page">
      <aside className="panel-left">
        <div className="brand">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2Z"></path>
            <path d="M3.5 8.5h17M3.5 15.5h17M8 4.5l8 15M16 4.5l-8 15"></path>
          </svg>
          <span>Logoipsum</span>
        </div>

        <div>
          <p className="quote">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            maximus, nulla ut commodo sagittis, sapien dui mattis dui, non
            pulvinar lorem felis nec erat"
          </p>
          <p className="author">John Smith</p>
        </div>
      </aside>

      <main className="panel-right">
        <a href="register.html" className="login-link">Sign up</a>
        <div>
          <h1>Login</h1>
          <p className="subtitle">Enter your email and password to sign in</p>

          <form>
            <input className="field" type="email" aria-label="Email" placeholder="name@example.com" required />
            <input className="field" type="password" aria-label="Password" placeholder="Password" required />

            <button className="btn btn-primary" type="submit" aria-label="Sign in" style={{ marginTop: '4px' }}>Sign in</button>
          </form>
        </div>
      </main>
    </div>
  );
};
