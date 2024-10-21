// app.js
function App() {
    const [user, setUser] = React.useState(null);
    const [products, setProducts] = React.useState([]);

    const handleLogin = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        // Vérification simplifiée des identifiants
        if (username === "admin" && password === "password") {
            setUser({ username: username });
        } else {
            alert("Identifiants incorrects");
        }
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleAddProduct = (event) => {
        event.preventDefault();
        const newProduct = {
            name: event.target.name.value,
            expiryDate: event.target.expiryDate.value
        };
        setProducts([...products, newProduct]);
        event.target.reset();
    };

    if (!user) {
        return (
            <div>
                <h1>Connexion</h1>
                <form onSubmit={handleLogin}>
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
            <button onClick={handleLogout}>Déconnexion</button>
            
            <h2>Ajouter un produit</h2>
            <form onSubmit={handleAddProduct}>
                <input name="name" type="text" placeholder="Nom du produit" required />
                <input name="expiryDate" type="date" required />
                <button type="submit">Ajouter</button>
            </form>

            <h2>Liste des produits</h2>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>{product.name} - Date d'expiration : {product.expiryDate}</li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
