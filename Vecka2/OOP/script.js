class UserService {
  static baseUrl = "http://localhost:3000/users";

  static async getUsers() {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error("Fel vid hämtning");
    return await res.json();
  }

  static async createUser(userData) {
    if (!userData.name || !userData.email) {
      alert("Fyll i alla fält");
      return;
    }

    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await res.json();
  }

  static async deleteUser(id) {
    await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

// 🔥 STATE (detta ska du peka ut tydligt)
let users = []; //Datan vi vill visa
let loading = false; //Håller vi på att hämta data?
let error = null; ///Gick något fel?

// ================= LOAD =================
async function loadUsers() {
  loading = true;
  error = null;
  renderUsers();

  try {
    users = await UserService.getUsers();
  } catch (err) {
    error = "Kunde inte hämta data";
  }

  loading = false;
  renderUsers();
}

// ================= ADD =================
async function addUser() {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;

  await UserService.createUser({ name, email });

  // UX förbättring
  document.getElementById("nameInput").value = "";
  document.getElementById("emailInput").value = "";

  loadUsers();
}

// ================= DELETE =================
async function removeUser(id) {
  await UserService.deleteUser(id);
  loadUsers();
}

// ================= RENDER =================
function renderUsers() {
  const list = document.getElementById("userList");

  // 🔥 STATE → UI koppling
  if (loading) {
    list.innerHTML = "Laddar...";
    return;
  }

  if (error) {
    list.innerHTML = error;
    return;
  }

  list.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");

    li.textContent = `${user.name} (${user.email})`;

    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.onclick = () => removeUser(user.id);

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// INIT
loadUsers();
