import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({error:"Méthode non autorisée"});

    const { image, pseudo } = req.body;
    if (!image) return res.status(400).json({error:"Vote invalide"}); // <-- juste image obligatoire

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    // Vérifie si l’IP a déjà voté
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('ip', ip)
      .single();

    if (existing) return res.status(403).json({error:"❌ Vous avez déjà voté"});

    // Enregistre le vote avec pseudo facultatif
    const { error } = await supabase
      .from('votes')
      .insert([{ ip, image_id: image, pseudo: pseudo || null }]); // si pseudo vide, stocke NULL

    if (error) return res.status(500).json({error:"Erreur serveur Supabase"});

    res.json({success:true});

  } catch (e) {
    console.error(e);
    res.status(500).json({error:"Erreur serveur inattendue"});
  }
}