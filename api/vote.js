import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Méthode non autorisée"});

  const { image, pseudo } = req.body;
  if (!image || !pseudo) return res.status(400).json({error:"Vote invalide"});

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  // Vérifie si l’IP a déjà voté
  const { data: existing } = await supabase
    .from('votes')
    .select('id')
    .eq('ip', ip)
    .single();

  if (existing) return res.status(403).json({error:"❌ Vous avez déjà voté"});

  // Enregistre le vote avec le pseudo
  const { error } = await supabase
    .from('votes')
    .insert([{ ip, image_id: image, pseudo }]);

  if (error) return res.status(500).json({error:"Erreur serveur"});

  res.json({success:true});
}