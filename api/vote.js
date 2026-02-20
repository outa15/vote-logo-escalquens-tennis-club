import { Redis } from "@upstash/redis";

// Se connecte automatiquement grâce aux variables d'environnement créées par Vercel Marketplace
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Récupère l'IP du visiteur
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "Vote invalide" });

  const ipKey = `ip:${ip}`;

  // Vérifie si l'IP a déjà voté
  const existing = await redis.get(ipKey);
  if (existing) {
    return res.status(403).json({ error: "❌ Tu as déjà voté" });
  }

  // Stocke le vote (par IP) avec expiration 7 jours
  await redis.set(ipKey, image, { ex: 60 * 60 * 24 * 7 });

  // Incrémente le compteur pour l'image
  await redis.incr(`image:${image}`);

  res.json({ success: true });
}