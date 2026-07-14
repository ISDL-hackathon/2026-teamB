function LoginArea({
  loginName,
  loginPassword,
  mode,
  onLogin,
  onRegister,
  registerGrade,
  registerName,
  registerPassword,
  setLoginName,
  setLoginPassword,
  setMode,
  setRegisterGrade,
  setRegisterName,
  setRegisterPassword,
}) {
  return (
    <div className="card authCard">
      {mode === "login" ? (
        <>
          <h2>ログイン</h2>
          <input
            onChange={(e) => setLoginName(e.target.value)}
            placeholder="名前"
            type="text"
            value={loginName}
          />
          <input
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="パスワード"
            type="password"
            value={loginPassword}
          />
          <button onClick={onLogin}>ログイン</button>
          <p>
            アカウントがない場合は{" "}
            <button className="linkButton" onClick={() => setMode("register")}>
              ユーザー登録
            </button>
          </p>
        </>
      ) : (
        <>
          <h2>ユーザー登録</h2>
          <input
            onChange={(e) => setRegisterName(e.target.value)}
            placeholder="名前"
            type="text"
            value={registerName}
          />
          <select
            onChange={(e) => setRegisterGrade(e.target.value)}
            value={registerGrade}
          >
            <option value="U4">U4</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
            <option value="教員">教員</option>
          </select>
          <input
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="パスワード"
            type="password"
            value={registerPassword}
          />
          <button onClick={onRegister}>登録</button>
          <p>
            すでにアカウントがある場合は{" "}
            <button className="linkButton" onClick={() => setMode("login")}>
              ログイン
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default LoginArea;
