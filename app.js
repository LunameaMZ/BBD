function App() {
    // États existants
    const [user, setUser] = React.useState(null);
    const [articles, setArticles] = React.useState([]);
    const [storeProducts, setStoreProducts] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState('accueil');

    // Fonctions de calcul
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

        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) return 30;
        if (daysUntilExpiry <= 0 && daysUntilExpiry >= -30) return 50;
        if (daysUntilExpiry < -30) return 100;
        return 0;
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

    const renderGestionArticles = () => {
        return React.createElement('div', null,
            React.createElement('h2', null, "Gestion des Articles"),
            React.createElement('form', { onSubmit: handleAddArticle },
                React.createElement('input', {
                    name: 'code',
                    type: 'text',
                    placeholder: 'Code article',
                    required: true
                }),
                React.createElement('input', {
                    name: 'designation',
                    type: 'text',
                    placeholder: 'Désignation',
                    required: true
                }),
                React.createElement('input', {
                    name: 'category',
                    type: 'text',
                    placeholder: 'Catégorie',
                    required: true
                }),
                React.createElement('input', {
                    name: 'prixHT',
                    type: 'number',
                    step: '0.01',
                    placeholder: 'Prix HT',
                    required: true
                }),
                React.createElement('input', {
                    name: 'prixAchat',
                    type: 'number',
                    step: '0.01',
                    placeholder: 'Prix d\'achat',
                    required: true
                }),
                React.createElement('button', { type: 'submit' }, "Ajouter")
            ),
            React.createElement('div', { className: 'stats-card' },
                React.createElement('h3', null, "Liste des articles"),
                React.createElement('ul', null,
                    articles.map((article, index) =>
                        React.createElement('li', { key: index },
                            `${article.code} - ${article.designation} - ${article.category} - 
                            Prix HT: ${article.prixHT}€ - Prix d'achat: ${article.prixAchat}€`
                        )
                    )
                )
            )
        );
    };

    const renderSaisieProduits = () => {
        return React.createElement('div', null,
            React.createElement('h2', null, "Saisie de Produits"),
            React.createElement('form', { onSubmit: handleAddStoreProduct },
                React.createElement('input', {
                    name: 'code',
                    type: 'text',
                    placeholder: 'Code article',
                    required: true
                }),
                React.createElement('input', {
                    name: 'quantity',
                    type: 'number',
                    placeholder: 'Quantité',
                    required: true
                }),
                React.createElement('input', {
                    name: 'expiryDate',
                    type: 'date',
                    required: true
                }),
                React.createElement('button', { type: 'submit' }, "Ajouter")
            )
        );
    };

    // ... le reste du code de l'application (Menu, etc.)

    return React.createElement('div', { className: 'container' },
        React.createElement('h1', null, `Bienvenue, ${user.username}`),
        React.createElement(Menu),
        currentPage === 'accueil' && React.createElement('div', { className: 'stats-card' },
            React.createElement('h2', null, "Tableau de Bord"),
            React.createElement('p', null, "Bienvenue dans l'application de gestion des péremptions.")
        ),
        currentPage === 'gestionArticles' && user.role === 'admin' && renderGestionArticles(),
        currentPage === 'saisie' && user.role === 'store' && renderSaisieProduits()
        // ... autres conditions pour les différentes pages
    );
}

ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
);
