import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://ynmcpoauuvigqonbwgoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubWNwb2F1dXZpZ3FvbmJ3Z29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDQ4ODYsImV4cCI6MjA4OTA4MDg4Nn0.lqN2h75fUk9UVaD6Cflr5ZLKwUi6jYdFAFY_-Xio1nA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const topics = [
  {
    title: "10 Best Online Graphic Design Degree Programs in 2026",
    topic: "online graphic design degree",
    category: "Technology"
  },
  {
    title: "Oura vs. Whoop vs. Apple Watch: Best Sleep Tracker 2026",
    topic: "best sleep tracker 2026",
    category: "Technology"
  },
  {
    title: "How to Use AI Design Tools for Professional Branding",
    topic: "AI design tools for business",
    category: "Technology"
  },
  {
    title: "The Future of Neurowellness: 5 Devices to Reduce Stress",
    topic: "neurowellness technology",
    category: "Health"
  },
  {
    title: "Best Professional Laptops for Motion Designers (2026 Guide)",
    topic: "best laptops for motion design",
    category: "Technology"
  },
  {
    title: "7 Personalized Nutrition Apps for Metabolic Health 2026",
    topic: "personalized nutrition apps",
    category: "Health"
  },
  {
    title: "Home Office Design Ideas for Better Mental Productivity",
    topic: "productive home office design",
    category: "Lifestyle"
  },
  {
    title: "Top 5 Cybersecurity Certifications to Boost Your Salary",
    topic: "cybersecurity certifications 2026",
    category: "Technology"
  },
  {
    title: "Sustainable Luxury Travel: 2026 Lifestyle Trends",
    topic: "sustainable luxury travel",
    category: "Travel"
  },
  {
    title: "How to Transition to a Career in UX Design (2026 Roadmap)",
    topic: "career in UX design",
    category: "Technology"
  }
];

const apiKey = 'AIzaSyAR5H9rVETPkngVtdwtlAnf25dvmrH_0z8';

async function generateArticle(topicObj) {
  const prompt = `You are an expert content writer for an AdSense blog. Write a full SEO-optimized article on "${topicObj.title}". Primary keyword: "${topicObj.topic}". 
Rules: 
- H1 title -> Introduction (100-150 words) -> Body H2/H3 -> Mid-article key takeaway box -> FAQ -> Conclusion with internal CTA.
- Format entirely in HTML (no markdown wrappers). Use <h1>, <h2>, <p>, <ul>, <li>, <strong>. No HTML outer structures, just body components.
- Short active-voice paragraphs.
- One internal link placeholder [INTERNAL LINK: relevance] and one external link to an authority.
- 100% original, brand-safe.
Ensure it is extremely thorough (700+ words). AT THE END OF THE HTML, append exactly this format:
<div id="seo-meta-data" data-title="[META TITLE HERE]" data-desc="[META DESC HERE]" data-slug="[SLUG HERE]" data-alt="[ALT TEXT HERE]"></div>`;

  console.log(`Generating article for: ${topicObj.title}...`);
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse metadata
    const metaMatch = text.match(/<div id="seo-meta-data"[^>]*data-title="([^"]*)"[^>]*data-desc="([^"]*)"[^>]*data-slug="([^"]*)"[^>]*data-alt="([^"]*)"[^>]*><\/div>/i);
    const cleanHtml = text.replace(/<div id="seo-meta-data".*?<\/div>/is, '').replace(/```html/g, '').replace(/```/g, '').trim();
    
    return {
      title: metaMatch?.[1] || topicObj.title,
      html: cleanHtml,
      slug: metaMatch?.[3] || topicObj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: metaMatch?.[2] || cleanHtml.replace(/<[^>]+>/g, '').substring(0, 150),
      alt: metaMatch?.[4] || 'Hero graphic banner for article'
    };
  } catch (err) {
    console.error('Gemini error:', err);
    return null;
  }
}

async function run() {
  const { data: categories } = await supabase.from('categories').select('*');
  const catMap = {};
  for(let c of (categories || [])) catMap[c.name] = c.id;

  let sqlChunks = [];
  sqlChunks.push(`DO $$`);
  sqlChunks.push(`DECLARE`);
  sqlChunks.push(`  author_id uuid;`);
  sqlChunks.push(`  cat_id uuid;`);
  sqlChunks.push(`BEGIN`);
  sqlChunks.push(`  SELECT user_id INTO author_id FROM public.profiles WHERE email = 'williegabriel08@gmail.com' LIMIT 1;`);
  sqlChunks.push(`  IF author_id IS NULL THEN`);
  sqlChunks.push(`     RAISE EXCEPTION 'User williegabriel08@gmail.com not found. Cannot publish articles.';`);
  sqlChunks.push(`  END IF;`);

  for (let topic of topics) {
    if (!catMap[topic.category]) {
      const { data: newCat } = await supabase.from('categories').insert({ name: topic.category, slug: topic.category.toLowerCase() }).select('id').single();
      if(newCat) catMap[topic.category] = newCat.id;
    }
    
    const start = Date.now();
    const article = await generateArticle(topic);
    if (!article) continue;
    
    const catId = catMap[topic.category];
    
    let htmlSafe = article.html.replace(/'/g, "''");
    let titleSafe = article.title.replace(/'/g, "''");
    let slugSafe = article.slug.replace(/'/g, "''");
    let excerptSafe = article.excerpt.replace(/'/g, "''");
    let imageSafe = `https://image.pollinations.ai/prompt/${encodeURIComponent(article.alt)}?width=1200&height=600&nologo=true`.replace(/'/g, "''");
    let readingTime = Math.floor((article.html.split(' ').length / 200) * 60);

    sqlChunks.push(`  SELECT id INTO cat_id FROM public.categories WHERE name = '${topic.category}' LIMIT 1;`);
    sqlChunks.push(`  INSERT INTO public.posts (author_user_id, category_id, title, slug, excerpt, content, featured_image, status, is_story, reading_time_seconds, published_at)`);
    sqlChunks.push(`  VALUES (author_id, cat_id, '${titleSafe}', '${slugSafe}', '${excerptSafe}', '${htmlSafe}', '${imageSafe}', 'approved', false, ${readingTime}, now());`);
    
    console.log("Buffered:", topic.title, `(${Math.floor((Date.now() - start)/1000)}s)`);
    await new Promise(r => setTimeout(r, 2000));
  }
  
  sqlChunks.push(`END $$;`);
  fs.writeFileSync('publish_articles_willie.sql', sqlChunks.join('\\n'));
  console.log("SQL script written to publish_articles_willie.sql!");
}

run();
