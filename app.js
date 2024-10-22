function App() {
    const [user, setUser] = React.useState(null);
    const [articles, setArticles] = React.useState([]);
    const [storeProducts, setStoreProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState('accueil');

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
        setCurrentPage('accueil');
    };

    const Menu = () => {
        if (!user) return null;

        return (
            React.createElement('nav', null,
                React.createElement('button', { onClick: () => setCurrentPage('accueil') }, "Accueil"),
                user.role === 'admin' && [
                    React.createElement('button', { 
                        key: 'gestion', 
                        onClick: () => setCurrentPage('gestionArticles') 
                    }, "Gestion des Articles"),
                    React.createElement('button', { 
                        key: 'rapports', 
                        onClick: () => setCurrentPage('rapports') 
                    }, "Rapports")
                ],
                user.role === 'store' && [
                    React.createElement('button', { 
                        key: 'saisie', 
                        onClick: () => setCurrentPage('saisie') 
                    }, "Saisie de Produits"),
                    React.createElement('button', { 
                        key: 'stock', 
                        onClick: () => setCurrentPage('gestionStock') 
                    }, "Gestion du Stock"),
                    React.createElement('button', { 
                        key: 'stats', 
                        onClick: () => setCurrentPage('statistiques') 
                    }, "Statistiques")
                ],
                React.createElement('button', { onClick: handleLogout }, "Déconnexion")
            )
        );
    };

    if (!user) {
        return React.createElement('div', { className: 'login-form' },
            React.createElement('h1', null, "Connexion"),
            React.createElement('form', { onSubmit: handleLogin },
                React.createElement('input', {
                    name: 'username',
                    type: 'text',
                    placeholder: 'Nom d\'utilisateur',
                    required: true
                }),
                React.createElement('input', {
                    name: 'password',
                    type: 'password',
                    placeholder: 'Mot de passe',
                    required: true
                }),
                React.createElement('button', { type: 'submit' }, "Se connecter")
            )
        );
    }

    return React.createElement('div', { className: 'container' },
        React.createElement('h1', null, `Bienvenue, ${user.username}`),
        React.createElement(Menu),
        currentPage === 'accueil' && React.createElement('div', { className: 'stats-card' },
            React.createElement('h2', null, "Tableau de Bord"),
            React.createElement('p', null, "Bienvenue dans l'application de gestion des péremptions.")
        ),
        currentPage === 'gestionArticles' && user.role === 'admin' && React.createElement('div', null,
            React.createElement('h2', null, "Gestion des Articles"),
            React.createElement('div', { className: 'stats-card' },
                React.createElement('p', null, "Section de gestion des articles")
            )
        ),
        currentPage === 'saisie' && user.role === 'store' && React.createElement('div', null,
            React.createElement('h2', null, "Saisie de Produits"),
            React.createElement('div', { className: 'stats-card' },
                React.createElement('p', null, "Section de saisie des produits")
            )
        ),
        currentPage === 'gestionStock' && user.role === 'store' && React.createElement('div', null,
            React.createElement('h2', null, "Gestion du Stock"),
            React.createElement('div', { className: 'stats-card' },
                React.createElement('p', null, "Section de gestion du stock")
            )
        )
    );
}

ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
);
