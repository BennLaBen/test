# Variables d'environnement i18n

## Configuration du mode strict

Ajoutez ces variables à votre fichier `.env.local` ou `.env.production`:

```bash
# Mode strict i18n (bloque si clé manquante en production)
NEXT_PUBLIC_I18N_STRICT=true

# Activer le logging des clés manquantes (dev uniquement)
NEXT_PUBLIC_I18N_DEBUG=true
```

## Comportement par environnement

| Variable | Développement | Production |
|----------|---------------|------------|
| `NEXT_PUBLIC_I18N_STRICT=true` | Log + marqueur visuel | **ERREUR FATALE** |
| `NEXT_PUBLIC_I18N_STRICT=false` | Log + marqueur visuel | Log warning |
| `NEXT_PUBLIC_I18N_DEBUG=true` | Console détaillée | Ignoré |

## Recommandation

**Production**: Toujours activer `NEXT_PUBLIC_I18N_STRICT=true` pour garantir que toutes les traductions sont présentes.
