import { useEffect, useState } from 'react';

const BLOGS = [
  {
    slug: 'carrier-window-ac-buying-guide',
    title: 'Buying Guide: Best Carrier Window ACs in India',
    image: '/blogs/blog1.jpg',
    htmlPath: '/blogs/carrier-window-ac-buying-guide.html',
    categories: ['Air Conditioner', 'Buying Guide'],
    excerpt:
      'From small study rooms to large family halls, this guide helps you choose the right Carrier window AC without overspending in Chennai summers.',
    modified: '25 Mar 2026',
  },
  {
    slug: 'lloyd-split-ac-buyers-guide',
    title: 'A Buyer’s Guide to Top Lloyd Split ACs',
    image: '/blogs/blog2.jpeg',
    htmlPath: '/blogs/lloyd-split-ac-buyers-guide.html',
    categories: ['Air Conditioner', 'Buying Guide'],
    excerpt:
      'Compare capacity, star rating, and inverter options to pick a Lloyd split AC that matches your room size and daily usage pattern.',
    modified: '25 Mar 2026',
  },
  {
    slug: 'sell-old-refrigerator-chennai',
    title: 'How to Sell Your Old Refrigerator in Chennai Without Getting Underpaid',
    image: '/blogs/blog3.png',
    htmlPath: '/blogs/sell-old-refrigerator-chennai.html',
    categories: ['Refrigerator', 'Smart Selling Tips'],
    excerpt:
      'A practical step-by-step method to get fair value for your old fridge with clean pickup and quick payment.',
    modified: '25 Mar 2026',
  },
  {
    slug: 'best-time-sell-old-washing-machine-chennai',
    title: 'Best Time to Sell Old Washing Machines in Chennai',
    image: '/blogs/blog4.png',
    htmlPath: '/blogs/best-time-sell-old-washing-machine-chennai.html',
    categories: ['Washing Machine', 'Smart Selling Tips'],
    excerpt:
      'Know the right time to sell before value drops, so you can upgrade earlier and avoid recurring repair costs.',
    modified: '25 Mar 2026',
  },
  {
    slug: 'prepare-old-appliance-for-pickup',
    title: 'Simple Guide: How to Prepare Any Old Appliance for Pickup',
    image: '/blogs/blog5.png',
    htmlPath: '/blogs/prepare-old-appliance-for-pickup.html',
    categories: ['Smart Selling Tips', 'Kitchen Appliances'],
    excerpt:
      'Use this quick checklist to disconnect, clean, and stage appliances for a faster and safer pickup process.',
    modified: '25 Mar 2026',
  },
];

const BLOG_FILTERS = [
  'All',
  'Smart Selling Tips',
  'Washing Machine',
  'Air Conditioner',
  'Refrigerator',
  'Kitchen Appliances',
];

export default function Resources() {
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    document.title = 'Resources | Chennai Scraps Blogs';
  }, []);

  const openBlogPage = (blogPath) => {
    window.location.href = blogPath;
  };

  const filteredBlogs =
    activeFilter === 'All'
      ? BLOGS
      : BLOGS.filter((blog) => blog.categories.includes(activeFilter));

  return (
    <div className="min-h-screen bg-gray-100 py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Blogs</h1>
        <p className="text-gray-600 text-lg font-semibold mb-8">
          Explore appliance buying guides and resale tips to make smarter upgrade decisions in Chennai.
        </p>

        <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
          {BLOG_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold border transition-colors ${
                activeFilter === filter
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-blue-50 text-blue-900 border-blue-100 hover:bg-blue-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filteredBlogs.map((blog) => (
            <button
              key={blog.slug}
              type="button"
              onClick={() => openBlogPage(blog.htmlPath)}
              className="w-full text-left bg-white border border-gray-300 rounded-2xl p-5 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-4 py-1.5 rounded-xl border-2 border-blue-600 text-blue-700 font-bold text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                  <p className="text-gray-700 text-lg font-bold leading-relaxed mb-2">
                    {blog.excerpt}
                    <span className="text-blue-700 underline ml-2">Read more</span>
                  </p>
                  <p className="text-gray-600 text-xl font-bold italic">Last Modified: {blog.modified}</p>
                </div>

                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full lg:w-56 h-44 object-cover rounded-xl border border-gray-200"
                />
              </div>
            </button>
          ))}

          {filteredBlogs.length === 0 && (
            <div className="bg-white border border-gray-300 rounded-2xl p-8">
              <p className="text-lg font-bold text-gray-700">No blogs found in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
