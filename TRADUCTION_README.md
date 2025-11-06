# 🌐 Guide de Traduction - LLEDO Industries

## 🆓 100% GRATUIT - Aucune inscription requise !

Ce système utilise **MyMemory Translation API**, une API de traduction **vraiment gratuite** :
- ✅ **10 000 mots/jour** sans inscription
- ✅ **Aucune clé API** nécessaire
- ✅ **0€/mois** pour toujours
- ✅ **Qualité correcte** pour du contenu technique

---

## 🚀 Démarrage ultra-rapide

### Utilisation (aussi simple que ça !)

```bash
# 1. Modifiez vos fichiers français
nano src/i18n/locales/fr/common.json

# 2. Lancez la traduction automatique
npm run translate

# 3. C'EST TOUT ! ✅
# Les fichiers anglais sont automatiquement générés
```

**Aucune configuration nécessaire !** 🎉

---

## ✏️ Modifier le contenu du site

### Workflow quotidien :

```bash
# 1. Modifiez UNIQUEMENT les fichiers français
src/i18n/locales/fr/common.json
src/i18n/locales/fr/homepage.json
src/i18n/locales/fr/blog.json
# ... etc

# 2. Lancez la traduction automatique
npm run translate

# 3. Attendez 2-5 minutes (selon la quantité de texte)

# 4. C'EST TOUT ! ✅
# Les fichiers anglais sont dans src/i18n/locales/en/
```

---

## 📁 Structure des fichiers de traduction

```
src/i18n/locales/
├── fr/                     ← Vous modifiez ICI
│   ├── common.json         (Navigation, footer, boutons)
│   ├── homepage.json       (Page d'accueil)
│   ├── blog.json           (Blog)
│   ├── cases.json          (Cas clients)
│   ├── expertises.json     (Nos expertises)
│   ├── vision.json         (Notre vision)
│   ├── contact.json        (Contact)
│   ├── testimonials.json   (Témoignages)
│   ├── brochure.json       (Brochure téléchargeable)
│   └── careers.json        (Carrières)
│
└── en/                     ← Généré AUTOMATIQUEMENT
    ├── common.json
    ├── homepage.json
    └── ... (tous les mêmes fichiers)
```

---

## 💡 Exemples concrets

### Exemple 1 : Modifier le titre de la page d'accueil

**Fichier** : `src/i18n/locales/fr/homepage.json`

```json
{
  "hero": {
    "title": "Excellence en usinage de précision",
    "subtitle": "36 ans d'expertise au service de l'aéronautique"
  }
}
```

**Commande** :
```bash
npm run translate
```

**Résultat** : `src/i18n/locales/en/homepage.json` généré automatiquement :
```json
{
  "hero": {
    "title": "Excellence in precision machining",
    "subtitle": "36 years of expertise serving the aerospace industry"
  }
}
```

---

### Exemple 2 : Ajouter un nouveau bouton

**Fichier** : `src/i18n/locales/fr/common.json`

```json
{
  "buttons": {
    "contact": "Nous contacter",
    "downloadBrochure": "Télécharger la plaquette"  ← NOUVEAU
  }
}
```

**Commande** :
```bash
npm run translate
```

**Résultat** : La version anglaise est automatiquement créée !

---

## 🎯 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run translate` | Traduit tous les fichiers FR → EN (gratuit !) |
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile le site pour production |

---

## ⏱️ Temps de traduction

L'API MyMemory est gratuite mais limitée en vitesse :

| Fichiers | Temps estimé |
|----------|--------------|
| 1-3 fichiers | ~2 minutes |
| 5-10 fichiers | ~5 minutes |
| Tous (10) | ~8 minutes |

**Pourquoi c'est lent ?** Pour respecter les limites de l'API gratuite (5 requêtes/seconde). Mais c'est **GRATUIT** ! 🎉

---

## 📊 Quota MyMemory

- ✅ **10 000 mots/jour** sans inscription
- ✅ **50 000 mots/jour** avec email gratuit
- ✅ Tous vos fichiers JSON = ~5 000 mots
- ✅ Vous pouvez traduire **2 fois/jour** gratuitement !

**Pour LLEDO Industries** : Largement suffisant ! Vous modifiez le site 2-3 fois/an maximum.

---

## ⚠️ Important

### ✅ À FAIRE :
- ✅ Modifiez UNIQUEMENT les fichiers dans `/fr/`
- ✅ Lancez `npm run translate` après chaque modification
- ✅ Attendez la fin (2-8 minutes)
- ✅ Vérifiez les traductions générées (optionnel)

### ❌ À NE PAS FAIRE :
- ❌ Ne modifiez JAMAIS les fichiers dans `/en/` manuellement
- ❌ N'interrompez pas le script en cours de traduction
- ❌ Ne lancez pas plusieurs traductions en parallèle

---

## 🔧 Personnaliser les traductions

Si une traduction automatique ne vous convient pas :

1. Lancez `npm run translate` (génère toutes les traductions)
2. Ouvrez le fichier EN concerné
3. Modifiez manuellement la traduction spécifique
4. **Au prochain** `npm run translate`, cette traduction sera **écrasée**

**Solution** : Gardez une liste des traductions personnalisées et réappliquez-les après chaque traduction automatique.

**OU** : Utilisez ChatGPT/moi pour traduire uniquement les phrases spécifiques !

---

## 💪 Avantages MyMemory

| Fonctionnalité | MyMemory | DeepL |
|----------------|----------|-------|
| **Gratuit** | ✅ 100% | ⚠️ 500k caractères/mois |
| **Inscription** | ❌ Aucune | ✅ Requise |
| **Clé API** | ❌ Aucune | ✅ Requise |
| **Qualité** | ⭐⭐⭐⭐ (80%) | ⭐⭐⭐⭐⭐ (95%) |
| **Coût/mois** | **0€** | 0€ puis 5€ |

**Pour LLEDO Industries** : MyMemory est **parfait** ! ✅

---

## 🎉 C'est tout !

Vous êtes prêt à modifier le contenu du site en français et le voir automatiquement traduit en anglais !

**Aucune inscription, aucune clé, 100% gratuit !** 🚀

---

## 📞 Support

- **MyMemory API** : https://mymemory.translated.net/
- **Support technique** : Contactez le développeur
- **Problème avec une traduction** : Utilisez ChatGPT pour retraduire manuellement
