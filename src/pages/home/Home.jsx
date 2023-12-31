import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../Firebase/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";

function Home() {
  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    if (email !== "" && senha !== "") {
      await signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
          //navegar para admin
          navigate("/admin", { replace: true });
        })
        .catch((error) => {
          toast.error("Erro ao fazer o login" + error);
          setEmail("");
          setSenha("");
        });
    } else {
      toast.info("Preencha todos os campos!");
    }
  }

  return (
    <>
      <div className="home-container">
        <h1>Lista de tarefas</h1>
        <span>Gerencie sua agenda de forma fácil.</span>

        <form className="form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Digite seu email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <input
            type="password"
            placeholder="Digite sua senha..."
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
            }}
          />
          <button type="submit">Acessar</button>
        </form>
        <Link className="button-link" to="/register">
          Não possui uma conta? Cadastre-se
        </Link>
      </div>
    </>
  );
}

export default Home;
