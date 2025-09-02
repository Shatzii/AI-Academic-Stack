# OpenEdTex Design System

A comprehensive design system for the OpenEdTex educational platform, featuring a modern, accessible, and consistent visual language.

## Overview

This design system provides:
- **CSS Custom Properties** for consistent theming
- **Component-specific styles** for reusable UI elements
- **Utility classes** for rapid prototyping and development
- **Dark mode support** with automatic theme switching
- **Responsive design** patterns

## File Structure

```
src/styles/
├── index.css              # Main entry point - imports all modules
├── design-system.css      # CSS variables, base styles, dark mode
├── utilities.css          # Utility classes (spacing, colors, layout)
└── components/
    ├── layout.css         # Navbar, sidebar, footer styles
    ├── home.css           # Home page specific styles
    ├── auth.css           # Authentication forms and components
    └── courses.css        # Course-related components
```

## CSS Custom Properties (Variables)

### Brand Colors
```css
--brand-primary: #007bff;      /* Primary blue */
--brand-secondary: #6c757d;    /* Gray */
--brand-accent: #28a745;       /* Green */
--brand-success: #28a745;      /* Green */
--brand-warning: #ffc107;      /* Yellow */
--brand-danger: #dc3545;       /* Red */
--brand-info: #17a2b8;         /* Teal */
```

### Neutral Colors
```css
--color-white: #ffffff;
--color-gray-50: #f8f9fa;
--color-gray-100: #e9ecef;
/* ... up to --color-gray-900: #000000; */
```

### Typography
```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
/* ... up to --font-size-5xl: 3rem; (48px) */
```

### Spacing
```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

## Dark Mode

The design system includes comprehensive dark mode support:

### Enabling Dark Mode
```javascript
// Add data-theme attribute to document root
document.documentElement.setAttribute('data-theme', 'dark');

// Remove for light mode
document.documentElement.removeAttribute('data-theme');
```

### Theme Toggle Component
```jsx
import ThemeToggle from '../components/common/ThemeToggle.jsx';

// Use in your component
<ThemeToggle />
```

### Dark Mode Variables
```css
[data-theme="dark"] {
  --brand-primary: #4dabf7;      /* Lighter blue for dark backgrounds */
  --color-white: #212529;       /* Dark background */
  --color-gray-50: #343a40;     /* Darker grays */
  /* ... */
}
```

## Utility Classes

### Spacing
```html
<!-- Margin -->
<div class="m-3">Margin all sides</div>
<div class="mt-2">Margin top</div>
<div class="mb-4">Margin bottom</div>
<div class="mx-auto">Center horizontally</div>

<!-- Padding -->
<div class="p-3">Padding all sides</div>
<div class="pt-2">Padding top</div>
<div class="px-4">Padding left/right</div>
```

### Colors
```html
<div class="text-primary">Primary text</div>
<div class="text-success">Success text</div>
<div class="bg-primary text-white">Primary background</div>
```

### Layout
```html
<div class="d-flex">Flexbox container</div>
<div class="d-grid">Grid container</div>
<div class="justify-content-center">Center content</div>
<div class="align-items-center">Center items</div>
```

### Responsive
```html
<div class="d-none d-md-block">Hidden on mobile, visible on medium+</div>
<div class="d-flex d-lg-grid">Flex on mobile, grid on large screens</div>
```

## Component Classes

### Buttons
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline-primary">Outline Button</button>
```

### Cards
```html
<div class="card">
  <div class="card-header">Header</div>
  <div class="card-body">Content</div>
  <div class="card-footer">Footer</div>
</div>
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-control" />
  <div class="form-text">Helper text</div>
</div>
```

### Navigation
```html
<nav class="navbar">
  <div class="navbar-brand">Brand</div>
  <ul class="navbar-nav">
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
  </ul>
</nav>
```

## Best Practices

### 1. Use Design System Variables
```css
/* ✅ Good */
.my-component {
  color: var(--brand-primary);
  padding: var(--spacing-md);
}

/* ❌ Avoid */
.my-component {
  color: #007bff;
  padding: 16px;
}
```

### 2. Leverage Utility Classes
```html
<!-- ✅ Good -->
<div class="d-flex align-items-center justify-content-between p-3">
  <h2 class="mb-0">Title</h2>
  <button class="btn btn-primary">Action</button>
</div>

<!-- ❌ Avoid -->
<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px;">
  <h2 style="margin-bottom: 0;">Title</h2>
  <button style="background: #007bff; color: white; border: none; padding: 8px 16px;">Action</button>
</div>
```

### 3. Component-Specific Styles
```css
/* Use component-specific CSS files for complex styling */
.auth-form {
  /* Styles specific to authentication forms */
}

.course-card {
  /* Styles specific to course cards */
}
```

### 4. Responsive Design
```css
/* Mobile-first approach */
.my-component {
  padding: var(--spacing-sm);
}

@media (min-width: 768px) {
  .my-component {
    padding: var(--spacing-md);
  }
}
```

## Customization

### Adding New Colors
```css
:root {
  --brand-custom: #your-color;
}

[data-theme="dark"] {
  --brand-custom: #your-dark-color;
}
```

### Extending Components
```css
/* In component-specific CSS file */
.my-custom-button {
  @extend .btn;
  background: var(--brand-custom);
}
```

## Accessibility

- All interactive elements have proper focus states
- Color contrast ratios meet WCAG 2.1 AA standards
- Semantic HTML structure is maintained
- ARIA labels are included where necessary

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new styles:

1. Use CSS custom properties for any new values
2. Add utility classes for common patterns
3. Document new components in this README
4. Test in both light and dark modes
5. Ensure responsive behavior

## Migration Guide

### From Inline Styles
```jsx
// Before
<div style={{ padding: '16px', color: '#007bff' }}>Content</div>

// After
<div className="p-3 text-primary">Content</div>
```

### From Bootstrap Classes
```jsx
// Before
<div className="mt-3 mb-4 text-center">Content</div>

// After (same classes work, now with design system variables)
<div className="mt-3 mb-4 text-center">Content</div>
```

This design system ensures consistency, maintainability, and a professional appearance across the entire OpenEdTex platform.

### Spacing Scale

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## Component Styles

### BEM Methodology

Components follow BEM (Block Element Modifier) naming convention:

```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--primary { }
.card--large { }
```

### Component Organization

Each major component has its own CSS file:
- `layout.css`: Navigation, sidebar, footer
- `home.css`: Home page specific styles
- Component-specific files for complex components

## Utility Classes

Utility classes follow a consistent naming pattern:

### Spacing
```css
.m-3 { margin: var(--spacing-md); }
.mt-2 { margin-top: var(--spacing-sm); }
.p-4 { padding: var(--spacing-lg); }
```

### Colors
```css
.text-primary { color: var(--brand-primary); }
.bg-secondary { background-color: var(--brand-secondary); }
```

### Layout
```css
.d-flex { display: flex; }
.justify-content-center { justify-content: center; }
.align-items-center { align-items: center; }
```

### Responsive
```css
.d-md-none { display: none; } /* Hidden on medium screens and up */
.d-lg-flex { display: flex; } /* Flex on large screens and up */
```

## Best Practices

### 1. Use CSS Variables
Always use CSS variables for colors, spacing, and other design tokens:

```css
/* ✅ Good */
.my-component {
  color: var(--brand-primary);
  padding: var(--spacing-md);
}

/* ❌ Avoid */
.my-component {
  color: #007bff;
  padding: 16px;
}
```

### 2. Follow BEM Naming
Use BEM for component-specific styles:

```css
/* ✅ Good */
.hero-section { }
.hero-section__title { }
.hero-section__subtitle { }
.hero-section--dark { }

/* ❌ Avoid */
.heroTitle { }
.dark-hero { }
```

### 3. Prefer Utilities for Common Patterns
Use utility classes for common styling needs:

```jsx
{/* ✅ Good */}
<div className="d-flex align-items-center justify-content-between p-3">
  <h3 className="mb-0">Title</h3>
  <button className="btn btn-primary">Action</button>
</div>

{/* ❌ Avoid */}
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
  <h3 style={{ marginBottom: 0 }}>Title</h3>
  <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Action</button>
</div>
```

### 4. Responsive Design
Use mobile-first approach with responsive utilities:

```css
/* Mobile first */
.my-component {
  padding: var(--spacing-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .my-component {
    padding: var(--spacing-md);
  }
}

/* Desktop and up */
@media (min-width: 992px) {
  .my-component {
    padding: var(--spacing-lg);
  }
}
```

### 5. Component-Specific Styles
For complex component styling, create dedicated CSS files:

```css
/* components/MyComponent.css */
.my-component {
  /* Component-specific styles */
}

.my-component__header {
  /* Header element styles */
}

.my-component--variant {
  /* Modifier styles */
}
```

## Migration Guide

### From Old Architecture

If you're migrating from the old CSS structure:

1. **Replace imports**: Update `App.jsx` to import `./styles/index.css`
2. **Update class names**: Use new utility classes and BEM naming
3. **Use CSS variables**: Replace hardcoded values with CSS variables
4. **Organize styles**: Move component styles to appropriate files

### Example Migration

**Before:**
```css
.my-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**After:**
```css
.my-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  box-shadow: var(--shadow-md);
}
```

## Performance Considerations

1. **CSS Variables**: Use CSS variables for theming - they're fast and don't require CSS-in-JS
2. **Utility Classes**: Utility-first approach reduces CSS bundle size
3. **Component Styles**: Scoped component styles prevent style conflicts
4. **Critical CSS**: Consider inlining critical CSS for better performance

## Browser Support

- CSS Variables: Supported in all modern browsers
- CSS Grid & Flexbox: Full support in modern browsers
- Fallbacks: Graceful degradation for older browsers

## Tools & Resources

- **CSS Variables**: For dynamic theming
- **PostCSS**: For CSS processing and optimization
- **Stylelint**: For CSS linting and consistency
- **CSS Modules**: For scoped component styles (optional)

## Contributing

When adding new styles:

1. Follow the established naming conventions
2. Use CSS variables for design tokens
3. Add responsive breakpoints as needed
4. Document any new utility classes
5. Test across different screen sizes
