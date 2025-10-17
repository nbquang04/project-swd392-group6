# Shoe Shop Project - Group 7

A modern e-commerce application for selling shoes and accessories, built with React and Tailwind CSS.

## Features

### HomePage
- Hero section with promotional content
- Category section displaying product categories
- Featured products section with real data from database
- Newsletter subscription section

### ProductPage
- Advanced filtering system (category, subcategory, size, color, price range)
- Smart size filtering based on category:
  - **Giày**: Sizes 38-44
  - **Dép**: Sizes 38-42
  - **Phụ kiện - Tất**: Sizes S, M, L, XL
  - **Phụ kiện - Túi**: Size Standard
- Sorting options (newest, price low to high, price high to low)
- Pagination for better user experience
- Responsive design with mobile sidebar
- Real-time product filtering and search
- Subcategory filtering for accessories (Tất, Túi)

### DetailProduct
- Product gallery with multiple images
- Product information with variants (size, color)
- Add to cart and buy now functionality
- Related products from the same category
- Product tabs with detailed information

### Navigation
- **Header**: Dropdown menu for "Sản phẩm" with subcategories
  - Tất cả sản phẩm
  - Giày
  - Dép
  - Phụ kiện (with submenu for Tất and Túi)
- **Category Section**: Direct links to filtered product pages
- **Mobile Responsive**: Collapsible menu for mobile devices

## Technology Stack

- **Frontend**: React 19, Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Database**: JSON Server (for development)
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shoesshop-project-group-7
```

2. Install dependencies:
```bash
npm install
```

3. Start the JSON Server (database):
```bash
npm run server
```
This will start the JSON server on port 9999 with the database.json file.

4. In a new terminal, start the React development server:
```bash
npm start
```
This will start the React application on port 3000.

5. Open your browser and navigate to `http://localhost:3000`

## Database Structure

The application uses a JSON database with the following structure:

- **users**: User accounts and authentication
- **categories**: Product categories
- **products**: Product information with variants
- **cart**: Shopping cart items
- **reviews**: Product reviews and ratings
- **orders**: Order history and details

## API Endpoints

The application connects to the following API endpoints:

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /category` - Get all categories
- `GET /products?category_id=:id` - Get products by category
- `GET /products?category_id=:id&subcategory=:sub` - Get products by category and subcategory

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CategorySection.jsx
│   ├── FeaturedProducts.jsx
│   ├── Header1.jsx
│   ├── ProductGallery.jsx
│   ├── ProductInfo.jsx
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── ProductPage.jsx
│   ├── DetailProduct.jsx
│   └── ...
├── service/            # API service layer
│   ├── index.js
│   ├── endpoints.js
│   └── product.js
└── context/            # React context for state management
```

## Key Features Implemented

### HomePage Logic
- Fetches featured products and categories from database
- Displays loading states during data fetching
- Error handling for failed API requests
- Responsive design with proper data flow

### ProductPage Logic
- Real-time filtering by category, subcategory, size, color, and price
- Dynamic sorting with multiple options
- Pagination with configurable items per page
- URL parameter support for category and subcategory filtering
- Mobile-responsive sidebar with overlay
- Smart size filtering based on product category
- Subcategory filtering for accessories (Tất, Túi)

### DetailProduct Logic
- Fetches product details by ID from database
- Loads related products from the same category
- Handles product variants (size, color selection)
- Add to cart and buy now functionality
- Error handling for invalid product IDs
- Loading states and user feedback

### Navigation Logic
- Dropdown menu in header for product categories
- Direct category links from category section
- URL-based filtering with query parameters
- Mobile-responsive navigation
- Subcategory support for accessories

## Filtering Logic

### Category-Based Size Filtering
- **Giày (Shoes)**: Sizes 38, 39, 40, 41, 42, 43, 44
- **Dép (Sandals)**: Sizes 38, 39, 40, 41, 42
- **Phụ kiện - Tất (Socks)**: Sizes S, M, L, XL
- **Phụ kiện - Túi (Bags)**: Size Standard

### Subcategory Filtering
- **Tất**: Filters products containing "Tất", "tất", or "sock" in name
- **Túi**: Filters products containing "túi" or "bag" in name

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
