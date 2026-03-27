# Rallye de l'Odyssee

## Prérequis
- Node.js 18+

## Installation
```bash
npm install
```

## Démarrer en local
```bash
npm run dev
```
Ouvre ensuite `http://localhost:3000`.

## Configuration du créneau horaire (Europe/Paris)
Modifie `config.json` pour définir la fenêtre pendant laquelle l'oeil de Nyx peut apparaître.

Exemple:
```json
{
  "timeWindowParis": {
    "start": { "hour": 14, "minute": 42 },
    "end": { "hour": 14, "minute": 45 }
  }
}
```
Tu peux aussi ajouter le message et la solution:

```json
{
  "enableSecretLink": true,
  "timeWindowParis": {
    "start": { "hour": 14, "minute": 42 },
    "end": { "hour": 14, "minute": 45 }
  },
  "nyx": {
    "lines": [
      "Premiere ligne",
      "Deuxieme ligne"
    ],
    "solution": "Asteria"
  }
}
```

## Détails
- La page publique est statique.
- Le message secret n'est plus embarqué dans le HTML initial.
- Le front interroge `/api/nyx-status` pour savoir si l'oeil doit apparaître.
- Le message est renvoyé uniquement par `/api/nyx-claim`.
- L'accès est limité à une fois par jour par IP, selon la date Europe/Paris.

## Deploiement Netlify
Le projet contient maintenant:

- `netlify/functions/nyx-status.js`
- `netlify/functions/nyx-claim.js`
- `netlify.toml`

### Preparation locale

1. Lance `npm install` pour installer `@netlify/blobs`.
2. Verifie que `config.json` contient bien ta fenetre horaire et ton message Nyx.
3. Commit et pousse le repo sur GitHub.

### Etapes dans Netlify

1. Clique sur `Add new site` puis `Import an existing project`.
2. Connecte ton repo GitHub.
3. Dans les options de build:
   - `Base directory`: laisse vide
   - `Build command`: laisse vide
   - `Publish directory`: `.`
4. Une fois le site cree, va dans `Site configuration` puis `Environment variables`.
5. Ajoute `NYX_IP_SALT` avec une valeur longue et secrete.
6. Redeploie le site.

### Apres deploiement

1. Ouvre `/api/nyx-status` sur ton domaine Netlify pour verifier que la fonction repond.
2. Pendant le creneau horaire, recharge la page d'accueil et verifie que l'oeil apparait.
3. Clique une fois sur l'oeil, puis recharge la page:
   l'oeil ne doit plus apparaitre pour la meme IP le meme jour.

### Remarques utiles

- La limite est "une fois par jour par IP publique".
- Si plusieurs joueurs partagent le meme Wi-Fi, ils peuvent partager la meme restriction.
- `NYX_IP_SALT` doit rester stable dans le temps, sinon les anciennes empreintes IP ne correspondront plus.

## Limites
- "Une fois par jour par IP" n'est pas parfait: des joueurs sur le meme Wi-Fi peuvent partager la meme IP publique.
- Un VPN ou un changement de reseau peut contourner la limite.
- Si tu veux quelque chose de plus robuste plus tard, on pourra combiner IP + cookie signe ou code equipe.
