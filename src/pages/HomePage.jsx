import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection.jsx';
import CategorySection from '../components/CategorySection.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import NewsletterSection from '../components/NewsletterSection.jsx';
import { fetchFeaturedProducts, fetchCategory } from '../service/product';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchFeaturedProducts(),
          fetchCategory()
        ]);
        setFeaturedProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading home page data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategorySelect = (categoryId) => {
    if (categoryId) {
      navigate(`/products?category=${categoryId}`);
    } else {
      navigate('/products');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main>
      <HeroSection />
      <CategorySection 
        categories={categories} 
        onSelectCategory={handleCategorySelect} 
      />
      <FeaturedProducts products={featuredProducts} />
      <NewsletterSection />
    </main>
  );
};

export default Home;