# Tailwind CSS Setup Guide

## Installation

Since there were issues with npm installation, you'll need to manually install the dependencies:

```bash
npm install -D tailwindcss postcss autoprefixer
```

## Configuration Files Created

### 1. `tailwind.config.js`
- Configured to scan all JS/JSX/TS/TSX files in the `src` directory
- Added custom color palette (primary and secondary)
- Extended spacing and border radius utilities
- Added Inter font family

### 2. `postcss.config.js`
- Configured PostCSS to use Tailwind CSS and Autoprefixer

### 3. `src/index.css`
- Added Tailwind directives at the top of the file
- Kept existing custom styles

## Usage

### Basic Classes
```jsx
// Text styling
<h1 className="text-4xl font-bold text-gray-900">Title</h1>
<p className="text-lg text-gray-600">Description</p>

// Layout
<div className="flex items-center justify-between p-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Content */}
  </div>
</div>

// Colors and backgrounds
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Button
</button>

// Spacing
<div className="m-4 p-6 space-y-4">
  {/* Content with margins, padding, and vertical spacing */}
</div>
```

### Custom Colors
The configuration includes custom primary and secondary color palettes:

```jsx
// Primary colors
<div className="bg-primary-500 text-primary-900">
  Primary content
</div>

// Secondary colors
<div className="bg-secondary-100 text-secondary-800">
  Secondary content
</div>
```

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* Responsive text */}
</div>
```

### Hover and Transitions
```jsx
<button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
  Hover me
</button>

<div className="transform hover:scale-105 transition-transform duration-300">
  {/* Hover scale effect */}
</div>
```

## Example Component

Check out `src/Components/TailwindExample.js` for a complete example of Tailwind CSS usage.

## Development

1. Start your development server:
   ```bash
   npm start
   ```

2. Tailwind CSS will automatically compile and watch for changes

3. Use the utility classes in your components

## Tips

- Use the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for VS Code
- Check the [Tailwind CSS documentation](https://tailwindcss.com/docs) for all available utilities
- Use the browser's developer tools to experiment with classes
- Consider using `@apply` directive for complex components:

```css
.custom-button {
  @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded;
}
```

## Troubleshooting

If styles aren't applying:
1. Make sure the dependencies are installed
2. Check that `src/index.css` is imported in your main component
3. Verify the `tailwind.config.js` content paths are correct
4. Restart your development server 