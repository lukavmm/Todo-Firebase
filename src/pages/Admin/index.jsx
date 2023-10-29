import { useState, useEffect } from "react";
import { auth, db } from "../../Firebase/firebaseConnection";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./admin.css";
import { toast } from "react-toastify";

export default function Admin() {
  const [task, setTask] = useState("");
  const [user, setUser] = useState({});
  const [tarefas, setTarefas] = useState([]);
  const [edit, setEdit] = useState({});

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, "tarefas");

        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );

        // eslint-disable-next-line no-unused-vars
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });
          console.log(lista);
          setTarefas(lista);
        });
      }
    }
    loadTarefas();
  }, []);

  async function handleNewTask(e) {
    e.preventDefault();
    if (task === "") {
      toast.info("Digite sua tarefa");
      return;
    }

    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: task,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        toast.success("Tarefa criada!");
        setTask("");
      })
      .catch((error) => {
        toast.error("Erro ao criar tarefa" + error);
      });
  }

  async function deleteTarefa(id, tarefa) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
    toast.success(`Tarefa ${tarefa} concluida`);
  }

  function editTarefa(item) {
    setTask(item.tarefa);
    setEdit(item);
  }

  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit?.id);
    await updateDoc(docRef, {
      tarefa: task,
    })
      .then(() => {
        toast.success("Tarefa atualizada");
        setTask("");
        setEdit({});
      })
      .catch(() => {
        toast.error("erro ao atualizar");
        setTask("");
        setEdit({});
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="admin-container">
      <h1>minhas tarefas</h1>

      <form className="form" onSubmit={handleNewTask}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={task}
          onChange={(e) => {
            setTask(e.target.value);
          }}
        ></textarea>

        {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>
          <div>
            <button
              onClick={() => {
                editTarefa(item);
              }}
              className="btn-editar"
            >
              Editar
            </button>
            <button
              onClick={() => {
                deleteTarefa(item.id, item.tarefa);
              }}
              className="btn-delete"
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
