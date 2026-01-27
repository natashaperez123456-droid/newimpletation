import { notFound } from "next/navigation";

// Contenido estático para independencia total
const STATIC_PAGES: Record<string, { title: string; content: string }> = {
	"about-us": {
		title: "About Us",
		content: `
      <p>Welcome to Tiny Tales & Bright Color!</p>
      <p>We believe creativity should be free and accessible to everyone. We are dedicated to providing high-quality, free printable coloring pages for families, teachers, and art lovers alike.</p>
      <p>Whether you are looking for fun, educational activities for kids (ages 3-9) or intricate, relaxing designs for adults, our library is yours to explore.</p>
      <p><strong>Our Mission:</strong> To spark joy and imagination without barriers. All our resources are completely free to download.</p>
      
      <h3>How it works:</h3>
      <ul>
        <li>Browse our collection.</li>
        <li>Click to download your favorite design.</li>
        <li>Print and start creating!</li>
      </ul>
      <p>No hidden fees, no subscriptions. Just pure creativity at your fingertips.</p>

      <hr class="my-8 border-neutral-200" />

      <h2 id="faq">Frequently Asked Questions</h2>
      
      <div class="space-y-6">
        <div>
          <p class="font-bold text-lg mb-2">Is everything really free?</p>
          <p>Yes! Every coloring page on our website is 100% free to download and print. We believe in sharing art with the world.</p>
        </div>
        
        <div>
          <p class="font-bold text-lg mb-2">Do I need to create an account to download?</p>
          <p>No account needed. Simply find the image you like and click the download button.</p>
        </div>

        <div>
          <p class="font-bold text-lg mb-2">What format are the files?</p>
          <p>Our designs are high-quality PDF/JPG files, formatted for standard Letter size (8.5 x 11 in) or A4, making them easy to print at home.</p>
        </div>

        <div>
          <p class="font-bold text-lg mb-2">Can I use these for my classroom or daycare?</p>
          <p>Absolutely! We love supporting teachers. You are welcome to print and distribute copies for educational and personal use.</p>
        </div>

        <div>
          <p class="font-bold text-lg mb-2">Can I resell the designs?</p>
          <p>No. While our pages are free for you to use and enjoy, the digital files and illustrations remain the copyright of Tiny Tales & Bright Color and cannot be resold or redistributed commercially.</p>
        </div>
      </div>
    `,
	},
	"terms-of-use": {
		title: "Terms of Use",
		content: `
      <p>Welcome to Tiny Tales & Bright Color! By using our website, you agree to the following terms.</p>
      <p>All coloring pages provided on this website are free for personal and educational use. You are welcome to print and distribute copies for your family, classroom, or daycare.</p>
      
      <h3>Prohibited Use</h3>
      <p>You may not resell the digital files, redistribute them commercially, or claim the illustrations as your own. All designs remain the copyright of Tiny Tales & Bright Color.</p>
      
      <p>The service is provided "as is" without warranties of any kind. We reserve the right to modify or discontinue the service at any time.</p>
    `,
	},
	"privacy-policy": {
		title: "Privacy Policy",
		content: `
      <p>At Tiny Tales & Bright Color, we take your privacy seriously.</p>
      
      <h3>Data Collection</h3>
      <p>We do not require an account to download our free coloring pages. If you choose to contact us or sign up for a newsletter in the future, we will only use your information for that specific purpose.</p>
      
      <h3>Cookies</h3>
      <p>We may use basic cookies to improve your browsing experience and analyze site traffic.</p>
      
      <h3>Third Parties</h3>
      <p>We do not sell or share your personal information with third parties for marketing purposes.</p>
      
      <p>If you have any questions about our privacy practices, please contact us.</p>
    `,
	},
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const slug = params.slug;
	const page = STATIC_PAGES[slug];

	if (!page) {
		notFound();
	}

	return (
		<div className="mx-auto max-w-3xl px-8 py-16">
			<h1 className="font-display mb-10 text-4xl font-bold text-[color:var(--ink)]">{page.title}</h1>
			<div
				className="prose-headings:font-display prose prose-neutral max-w-none text-[color:var(--moss)] prose-headings:text-[color:var(--ink)] prose-a:text-[color:var(--clay)]"
				dangerouslySetInnerHTML={{ __html: page.content }}
			/>
		</div>
	);
}
