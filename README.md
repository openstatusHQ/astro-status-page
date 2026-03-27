# Astro Status Page by OpenStatus 🔭

Built by [OpenStatus](https://www.openstatus.dev)


## Demo 🚀

[https://astro.openstat.us](https://astro.openstat.us)

## What is this? 🤔

It's a simple status page, bring your OpenStatus API key and you're good to go!

Fork it, tweak it, make it yours 🚀


## Tech Stack 📚

- [Astro](https://astro.build)
- [OpenStatus](https://www.openstatus.dev)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [Tailwind CSS v4](https://tailwindcss.com)

## Getting Started 🚀

To start your own status page, you'll need to create an account on [OpenStatus](https://www.openstatus.dev) create some monitor. Once you've done that, you'll need to create a new API key in the settings and copy it.


### Development 🧑‍💻

1. Fork this repo, or clone it.

2. Go to the project folder

3. Install dependencies

```bash
     pnpm install
```

4. Set up your environment variables
   - Copy `.dev.vars.example` to `.dev.vars`
   - Fill `API_KEY` with your OpenStatus API key

5. Start the dev server

```bash
pnpm dev
```
6. Customize it 🧑‍🎨


### Deployment 🚀

You can easily deploy your status page on [Cloudflare Workers](https://workers.cloudflare.com).

1. Set the API key in the environment variables of your worker
   - Go to your worker settings
   - Add a new variable named `API_KEY` and paste your OpenStatus API key

2. Run the following command:

```bash
pnpm deploy
```

3. Profit 🔥






