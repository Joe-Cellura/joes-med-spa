export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readingTimeMinutes: number;
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-often-should-you-get-a-cleaning",
    title: "How Often Should You Get a Teeth Cleaning?",
    excerpt:
      "Most patients do well with cleanings every six months, but your ideal schedule depends on your oral health history and risk factors.",
    readingTimeMinutes: 3,
    body: `How Often Should You Get a Teeth Cleaning?

The six-month rule is a good starting point, but it isn't right for everyone.

Why Every Six Months?

Professional cleanings remove plaque and tartar that regular brushing and flossing can't reach. Twice a year gives your dental team enough frequency to catch small problems before they become expensive ones — cavities, early gum disease, or changes in your bite.

Who Might Need More Frequent Cleanings?

Some patients benefit from cleanings every three to four months. This is often recommended for people with a history of gum disease, patients who are prone to heavy tartar buildup, those with certain health conditions like diabetes, and people undergoing cancer treatment.

Who Might Be Fine with Once a Year?

Patients with excellent oral hygiene, minimal tartar buildup, and no history of gum disease may be candidates for annual cleanings. Your dentist or hygienist will let you know based on what they see at each visit.

What Happens If You Skip?

Tartar buildup is the main concern. Unlike plaque, tartar can only be removed by a professional. Left untreated, it contributes to gum inflammation, bone loss, and cavities — all of which are more costly and uncomfortable to treat later.

The Bottom Line

If you haven't had a cleaning in over a year, schedule one now and let the team assess where you stand. From there, they'll give you a personalized recommendation based on your actual oral health — not just a one-size-fits-all schedule.`,
  },
  {
    slug: "veneers-vs-whitening",
    title: "Veneers vs. Whitening: Which Is Right for You?",
    excerpt:
      "Both can dramatically improve your smile, but they work differently and suit different concerns. Here is how to think about the decision.",
    readingTimeMinutes: 4,
    body: `Veneers vs. Whitening: Which Is Right for You?

Both treatments can give you a dramatically brighter, more confident smile — but they work very differently and are suited to different concerns.

What Whitening Does

Professional whitening uses peroxide-based agents to lighten the natural color of your enamel. It's effective, non-invasive, and relatively affordable. In-office treatment typically delivers results in a single visit. Take-home kits from your dentist are also available and work gradually over a few weeks.

Whitening works best when your teeth are structurally sound but stained from coffee, tea, red wine, or natural aging. It won't change the shape of your teeth, fix chips or cracks, or affect existing dental work like crowns or veneers.

What Veneers Do

Porcelain veneers are thin shells bonded to the front surface of your teeth. They can change the color, shape, length, and even the spacing of your smile all at once. Results are dramatic and long-lasting — typically 10 to 20 years with proper care.

Veneers are the right choice when whitening alone won't get you where you want to go. Common reasons include teeth that are significantly discolored or stained in ways whitening can't reach, chipped or worn teeth, minor gaps or misalignment, and teeth that are uneven in shape or length.

Which Should You Choose?

If your concern is primarily color and your teeth are otherwise healthy and well-shaped, start with professional whitening. It's less invasive, faster, and less expensive.

If you want a more comprehensive change to your smile's color and shape — or if whitening hasn't given you the results you were hoping for — veneers are worth a consultation.

The best way to decide is to come in for an exam. We can show you what's realistic for your situation and give you honest guidance on which option makes sense.`,
  },
  {
    slug: "what-to-expect-with-invisalign",
    title: "What to Expect With Invisalign",
    excerpt:
      "Clear aligners have come a long way. Here is an honest look at the process, timeline, and what most patients wish they had known going in.",
    readingTimeMinutes: 5,
    body: `What to Expect With Invisalign

Invisalign is one of the most popular treatments we offer, and for good reason. But there are a few things most patients wish they'd known before starting.

How It Works

Invisalign uses a series of custom clear aligners — each one slightly different from the last — to gradually shift your teeth into their target position. You wear each set of aligners for about one to two weeks before moving to the next, and you're in for check-ins every six to eight weeks so we can monitor your progress.

The Timeline

Most adult patients complete treatment in 12 to 18 months. Simpler cases can finish in as little as six months. More complex tooth movements take longer. We'll give you a realistic estimate at your consultation based on your specific situation.

What It Actually Feels Like

The aligners are comfortable, but "comfortable" doesn't mean invisible. Each new set creates mild pressure as your teeth begin to shift. This typically fades within a day or two and is a sign that the treatment is working.

You'll also notice you're talking slightly differently at first. Most patients adapt within a week or two. The aligners are barely noticeable to other people, but you'll be aware of them while you adjust.

Compliance Matters

Invisalign works when you wear the aligners. The recommended wear time is 20 to 22 hours per day, which means taking them out only to eat, drink anything besides water, and brush your teeth. Patients who wear them less than this extend their treatment time.

The Lifestyle Adjustment

You'll be brushing after every meal before putting the aligners back in. You can eat and drink whatever you like — just remove the aligners first. Many patients find this actually improves their eating habits since snacking becomes less casual.

Is It Worth It?

For most patients, yes. The results are genuinely life-changing, and the process is far more comfortable than traditional braces. If you're on the fence, come in for a consultation. We can scan your teeth digitally and show you a simulation of what your smile could look like before you commit to anything.`,
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
