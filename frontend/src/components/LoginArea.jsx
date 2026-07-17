import { useTranslation } from "react-i18next";

function LoginArea(props) {
  const { t } = useTranslation();
  const { loginName, loginPassword, mode, onLogin, onRegister, registerGrade, registerName,
    registerPassword, setLoginName, setLoginPassword, setMode, setRegisterGrade,
    setRegisterName, setRegisterPassword } = props;

  return (
    <div className="card authCard">
      {mode === "login" ? <>
        <h2>{t("auth.login")}</h2>
        <input aria-label={t("auth.name")} onChange={(e) => setLoginName(e.target.value)} placeholder={t("auth.name")} type="text" value={loginName} />
        <input aria-label={t("auth.password")} onChange={(e) => setLoginPassword(e.target.value)} placeholder={t("auth.password")} type="password" value={loginPassword} />
        <button onClick={onLogin}>{t("auth.login")}</button>
        <p>{t("auth.noAccount")} <button className="linkButton" onClick={() => setMode("register")}>{t("auth.register")}</button></p>
      </> : <>
        <h2>{t("auth.register")}</h2>
        <input aria-label={t("auth.name")} onChange={(e) => setRegisterName(e.target.value)} placeholder={t("auth.name")} type="text" value={registerName} />
        <select aria-label={t("auth.grade")} onChange={(e) => setRegisterGrade(e.target.value)} value={registerGrade}>
          <option value="U4">U4</option><option value="M1">M1</option><option value="M2">M2</option>
          <option value="教員">{t("auth.faculty")}</option>
        </select>
        <input aria-label={t("auth.password")} onChange={(e) => setRegisterPassword(e.target.value)} placeholder={t("auth.password")} type="password" value={registerPassword} />
        <button onClick={onRegister}>{t("auth.register")}</button>
        <p>{t("auth.hasAccount")} <button className="linkButton" onClick={() => setMode("login")}>{t("auth.login")}</button></p>
      </>}
    </div>
  );
}

export default LoginArea;
