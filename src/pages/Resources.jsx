import { useEffect } from 'react';

const BLOGS = [
  {
    slug: 'carrier-window-ac-buying-guide',
    title: 'Buying Guide: Best Carrier Window ACs in India',
    image: '/blogs/blog1.jpg',
    htmlPath: '/blogs/carrier-window-ac-buying-guide.html',
  },
  {
    slug: 'lloyd-split-ac-buyers-guide',
    title: 'A Buyer’s Guide to Top Lloyd Split ACs',
    image: '/blogs/blog2.jpeg',
    htmlPath: '/blogs/lloyd-split-ac-buyers-guide.html',
  },
  {
    slug: 'sell-old-refrigerator-chennai',
    title: 'How to Sell Your Old Refrigerator in Chennai Without Getting Underpaid',
    image: '/blogs/blog3.png',
    htmlPath: '/blogs/sell-old-refrigerator-chennai.html',
  },
  {
    slug: 'best-time-sell-old-washing-machine-chennai',
    title: 'Best Time to Sell Old Washing Machines in Chennai',
    image: '/blogs/blog4.png',
    htmlPath: '/blogs/best-time-sell-old-washing-machine-chennai.html',
  },
  {
    slug: 'prepare-old-appliance-for-pickup',
    title: 'Simple Guide: How to Prepare Any Old Appliance for Pickup',
    image: '/blogs/blog5.png',
    htmlPath: '/blogs/prepare-old-appliance-for-pickup.html',
  },
];

export default function Resources() {
  useEffect(() => {
    document.title = 'Resources | Chennai Scraps Blogs';
  }, []);

  const openBlogPage = (blogPath) => {
    window.location.href = blogPath;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Blog Resources</h1>
        <p className="text-gray-600 mb-8">
          Explore appliance buying guides and resale tips to make smarter upgrade decisions in Chennai.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOGS.map((blog) => (
            <button
              key={blog.slug}
              type="button"
              onClick={() => openBlogPage(blog.htmlPath)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden text-left"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-800 leading-snug">{blog.title}</h2>
                <p className="text-blue-600 font-semibold mt-3">Read article</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
