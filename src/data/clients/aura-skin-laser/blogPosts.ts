export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "laser-hair-reduction-what-to-expect",
    title: "Laser Hair Reduction: What to Expect at Your First Session",
    excerpt:
      "First-time clients often come in not knowing what to expect. Here is an honest walkthrough of the process, from prep to results.",
    readingTimeMinutes: 4,
    body: `Laser Hair Reduction: What to Expect at Your First Session

Laser hair reduction has come a long way. At Aura, we use the Motus AZ+ laser, which is designed to be effective for all skin tones with minimal discomfort. Here is what most first-time clients want to know before they come in.

Preparation

Shave the area you want treated 24 hours before your appointment. Do not wax, tweeze, or thread for at least four weeks prior, because the laser needs the hair follicle to be intact to be effective. Avoid tanning or significant sun exposure before your session.

What Happens During the Session

Dipna will review your skin type and hair characteristics before beginning. The Motus AZ+ uses a unique sweeping motion rather than individual pulses, which makes the treatment faster and more comfortable than traditional lasers. Most clients describe the sensation as mild warmth.

How Many Sessions Will You Need

Most clients need 6 to 12 sessions for optimal results. Hair grows in cycles, and laser treatment is most effective during the active growth phase. You may start seeing smoother, slower-growing hair after just 1 to 3 sessions.

Aftercare

Avoid sun exposure for at least a week after treatment. Wear SPF daily. Avoid heat, strenuous exercise, and hot showers for 24 hours post-treatment.

If you have questions specific to your skin or hair type, the best next step is a free consultation with Dipna.`,
  },
  {
    slug: "all-skin-tones-laser-treatments",
    title: "Why Laser Treatments Work for All Skin Tones at Aura",
    excerpt:
      "Older laser technology was not always safe for darker skin. Here is why the Motus AZ+ changes that, and what it means for your treatment.",
    readingTimeMinutes: 3,
    body: `Why Laser Treatments Work for All Skin Tones at Aura

For years, people with medium to dark skin tones were told that laser treatments were not safe or effective for them. That was largely true with older laser technology, which had difficulty distinguishing between melanin in hair and melanin in skin.

The Motus AZ+ Changes the Equation

The Motus AZ+ laser platform uses Alexandrite and Nd:YAG wavelengths that can be calibrated for different skin tones. The system is designed to target the hair follicle while minimizing risk to the surrounding skin, making it one of the safest and most effective options available for darker complexions.

What This Means for You

If you have previously been turned away from laser hair removal or have had a poor experience elsewhere, it is worth having a conversation with Dipna. She will assess your skin type, explain what results are realistic, and design a protocol that is right for you.

All skin types are welcome at Aura. That is not a marketing line. It is how the practice was built.`,
  },
  {
    slug: "skinwave-aqua-facial-guide",
    title: "Everything You Need to Know About the Skinwave Aqua Facial",
    excerpt:
      "The Skinwave is one of the most requested treatments at Aura. Here is what it does, who it is right for, and what to expect.",
    readingTimeMinutes: 3,
    body: `Everything You Need to Know About the Skinwave Aqua Facial

The Skinwave Aqua Facial is one of the most popular treatments at Aura, and for good reason. It delivers immediate, visible results with no downtime and works for virtually every skin type.

What the Skinwave Does

The Skinwave combines deep cleansing, exfoliation, and hydration in a single session. It uses aqueous solutions and gentle suction to remove impurities while delivering antioxidants and hydrating serums into the skin. A contouring roller component helps stimulate lymphatic circulation and relax the skin surface.

Who Is It Right For

The Skinwave works well for oily skin, dry skin, acne-prone skin, and sensitive skin. It is a great option before an event when you want an immediate glow without the risk of downtime from a more intensive treatment.

How Often Should You Get One

For maintenance, once a month is ideal. For pre-event skin prep, booking 3 to 5 days before your event allows any mild redness to settle while keeping your skin at its best.

What to Expect After

Your skin may feel slightly tight or appear mildly flushed for up to 72 hours. Wear SPF 50 daily. Avoid retinols and exfoliants for 5 days post-treatment.`,
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
