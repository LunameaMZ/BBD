function App() {
    const [user, setUser] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
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
            expiryDate: event.target.expiryDate.value,
            quantity: parseInt(event.target.quantity.value)
        };
        setProducts([...products, newProduct]);
        event.target.reset();
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedProducts = filteredProducts.sort((a, b) => 
        new Date(a.expiryDate) - new Date(b.expiryDate)
    );

    const isNearExpiry = (date) => {
        const today = new Date();
        const expiryDate = new Date(date);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
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
                <input name="quantity" type="number" placeholder="Quantité" required />
                <button type="submit">Ajouter</button>
            </form>

            <h2>Liste des produits</h2>
            <input 
                type="text" 
                placeholder="Rechercher un produit" 
                value={searchTerm} 
                onChange={handleSearch}
            />
            <ul>
                {sortedProducts.map((product, index) => (
                    <li key={index} style={{color: isNearExpiry(product.expiryDate) ? 'red' : 'black'}}>
                        {product.name} - Quantité: {product.quantity} - 
                        Date d'expiration : {product.expiryDate}
                        {isNearExpiry(product.expiryDate) && " - ATTENTION: Proche de la péremption!"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
