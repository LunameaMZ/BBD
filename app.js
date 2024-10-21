function App() {
    const [user, setUser] = React.useState(null);
    const [articles, setArticles] = React.useState([]);
    const [storeProducts, setStoreProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        // Charger la base d'articles
        const savedArticles = JSON.parse(localStorage.getItem('articles')) || [];
        setArticles(savedArticles);

        // Charger les produits du magasin si un utilisateur est connecté
        if (user && user.role === 'store') {
            const savedStoreProducts = JSON.parse(localStorage.getItem(`storeProducts_${user.username}`)) || [];
            setStoreProducts(savedStoreProducts);
        }
    }, [user]);

    const handleLogin = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        if (username === "admin" && password === "password") {
            setUser({ username: username, role: 'admin' });
        } else if (username === "magasin1" && password === "password") {
            setUser({ username: username, role: 'store' });
        } else {
            alert("Identifiants incorrects");
        }
    };

    const handleLogout = () => {
        setUser(null);
        setStoreProducts([]);
    };

    const handleAddArticle = (event) => {
        event.preventDefault();
        const newArticle = {
            code: event.target.code.value,
            designation: event.target.designation.value,
            category: event.target.category.value,
            prixHT: parseFloat(event.target.prixHT.value)
        };
        const updatedArticles = [...articles, newArticle];
        setArticles(updatedArticles);
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
        event.target.reset();
    };

    const handleAddStoreProduct = (event) => {
        event.preventDefault();
        const code = event.target.code.value;
        const article = articles.find(a => a.code === code);
        if (!article) {
            alert("Article non trouvé");
            return;
        }
        const newStoreProduct = {
            ...article,
            quantity: parseInt(event.target.quantity.value),
            expiryDate: event.target.expiryDate.value
        };
        const updatedStoreProducts = [...storeProducts, newStoreProduct];
        setStoreProducts(updatedStoreProducts);
        localStorage.setItem(`storeProducts_${user.username}`, JSON.stringify(updatedStoreProducts));
        event.target.reset();
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStoreProducts = storeProducts.filter(product =>
        product.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.includes(searchTerm)
    );

    const sortedStoreProducts = filteredStoreProducts.sort((a, b) => 
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
            
            {user.role === 'admin' && (
                <div>
                    <h2>Ajouter un article à la base</h2>
                    <form onSubmit={handleAddArticle}>
                        <input name="code" type="text" placeholder="Code article" required />
                        <input name="designation" type="text" placeholder="Désignation" required />
                        <input name="category" type="text" placeholder="Catégorie" required />
                        <input name="prixHT" type="number" step="0.01" placeholder="Prix HT" required />
                        <button type="submit">Ajouter</button>
                    </form>
                    <h2>Liste des articles</h2>
                    <ul>
                        {articles.map((article, index) => (
                            <li key={index}>
                                {article.code} - {article.designation} - {article.category} - {article.prixHT}€ HT
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {user.role === 'store' && (
                <div>
                    <h2>Ajouter un produit au stock</h2>
                    <form onSubmit={handleAddStoreProduct}>
                        <input name="code" type="text" placeholder="Code article" required />
                        <input name="quantity" type="number" placeholder="Quantité" required />
                        <input name="expiryDate" type="date" required />
                        <button type="submit">Ajouter</button>
                    </form>
                    <h2>Rechercher un produit</h2>
                    <input 
                        type="text" 
                        placeholder="Rechercher par code ou désignation" 
                        value={searchTerm} 
                        onChange={handleSearch}
                    />
                    <h2>Liste des produits du magasin</h2>
                    <ul>
                        {sortedStoreProducts.map((product, index) => (
                            <li key={index} style={{color: isNearExpiry(product.expiryDate) ? 'red' : 'black'}}>
                                {product.code} - {product.designation} - Catégorie: {product.category} - 
                                Prix: {product.prixHT}€ HT - Quantité: {product.quantity} - 
                                Date d'expiration : {product.expiryDate}
                                {isNearExpiry(product.expiryDate) && " - ATTENTION: Proche de la péremption!"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
