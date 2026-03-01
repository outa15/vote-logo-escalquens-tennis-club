import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { data, error } = await supabase
    .from("votes")
    .select("image_id")

  if (error) {
    return res.status(500).json({ error: "Erreur Supabase" });
  }

  // Comptage des votes par image
  const results = {};

  data.forEach(vote => {
    results[vote.image_id] = (results[vote.image_id] || 0) + 1;
  });

  // Transformation en tableau + tri décroissant
  const sortedResults = Object.entries(results)
    .map(([image, count]) => ({ image, count }))
    .sort((a, b) => b.count - a.count);

  res.json(sortedResults);
}