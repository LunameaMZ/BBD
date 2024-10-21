function App() {
    const [user, setUser] = React.useState(null);
    const [articles, setArticles] = React.useState([]);
    const [storeProducts, setStoreProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const savedArticles = JSON.parse(localStorage.getItem('articles')) || [];
        setArticles(savedArticles);

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
            prixHT: parseFloat(event.target.prixHT.value),
            prixAchat: parseFloat(event.target.prixAchat.value)
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

    const getDiscountPercentage = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            return 30;
        } else if (daysUntilExpiry <= 0 && daysUntilExpiry >= -30) {
            return 50;
        } else if (daysUntilExpiry < -30) {
            return 100; // Product should be removed
        }
        return 0;
    };

    const calculateProfit = (product) => {
        const discountPercentage = getDiscountPercentage(product.expiryDate);
        const sellingPrice = product.prixHT * (1 - discountPercentage / 100);
        return (sellingPrice - product.prixAchat) * product.quantity;
    };

    const getTotalProfit = () => {
        return storeProducts.reduce((total, product) => total + calculateProfit(product), 0);
    };

    const getTotalStock = () => {
        return storeProducts.reduce((total, product) => total + product.quantity, 0);
    };

    const getExpiredProducts = () => {
        return storeProducts.filter(product => new Date(product.expiryDate) < new Date()).length;
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
                        <input name="prixAchat" type="number" step="0.01" placeholder="Prix d'achat" required />
                        <button type="submit">Ajouter</button>
                    </form>
                    <h2>Liste des articles</h2>
                    <ul>
                        {articles.map((article, index) => (
                            <li key={index}>
                                {article.code} - {article.designation} - {article.category} - 
                                Prix HT: {article.prixHT}€ - Prix d'achat: {article.prixAchat}€
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
                    <h2>Statistiques du magasin</h2>
                    <p>Profit total estimé: {getTotalProfit().toFixed(2)}€</p>
                    <p>Total des produits en stock: {getTotalStock()}</p>
                    <p>Nombre de produits périmés: {getExpiredProducts()}</p>
                    <h2>Liste des produits du magasin</h2>
                    <ul>
                        {sortedStoreProducts.map((product, index) => {
                            const discountPercentage = getDiscountPercentage(product.expiryDate);
                            const profit = calculateProfit(product);
                            return (
                                <li key={index} style={{color: isNearExpiry(product.expiryDate) ? 'red' : 'black'}}>
                                    {product.code} - {product.designation} - Catégorie: {product.category} - 
                                    Prix HT: {product.prixHT}€ - Quantité: {product.quantity} - 
                                    Date d'expiration: {product.expiryDate} - 
                                    Réduction: {discountPercentage}% - 
                                    Profit estimé: {profit.toFixed(2)}€
                                    {isNearExpiry(product.expiryDate) && " - ATTENTION: Proche de la péremption!"}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
