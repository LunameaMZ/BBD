function App() {
    const [user, setUser] = React.useState(null);
    const [products, setProducts] = React.useState([]);

    const login = (username, password) => {
        // Simuler une connexion
        if (username === "admin" && password === "password") {
            setUser({ username: "admin", role: "admin" });
        } else {
            alert("Identifiants incorrects");
        }
    };

    const logout = () => {
        setUser(null);
    };

    if (!user) {
        return (
            <div>
                <h1>Connexion</h1>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    login(e.target.username.value, e.target.password.value);
                }}>
                    <input name="username" type="text" placeholder="Nom d'utilisateur" required />
                    <input name="password" type="password" placeholder="Mot de passe" required />
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        );
    }

    return (
        <div>
            <h1>Bienvenue, {user.username}</h1>
            <button onClick={logout}>Déconnexion</button>
            {/* Ajoutez ici le reste de votre interface utilisateur */}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
