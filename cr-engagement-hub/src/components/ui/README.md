# ClearRoute Design System Components

This directory contains reusable UI components that adhere to the ClearRoute design system guidelines.

## Available Components

### Button
A versatile button component with multiple variants and states.

```jsx
import { Button } from '@/components/ui';

// Primary button (default)
<Button>Primary Button</Button>

// Secondary button (outlined with teal)
<Button variant="secondary">Secondary Button</Button>

// Outline button (outlined with dark gray)
<Button variant="outline">Outline Button</Button>

// Ghost button (text only)
<Button variant="ghost">Ghost Button</Button>

// Size variants
<Button size="sm">Small Button</Button>
<Button size="md">Medium Button</Button> // Default
<Button size="lg">Large Button</Button>

// Loading state
<Button isLoading>Loading</Button>

// Full width
<Button fullWidth>Full Width Button</Button>
```

### Card
A card component for displaying content in a structured way.

```jsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>

// Card variants
<Card variant="outline">Outlined Card</Card>

// Padding options
<Card padding="none">No Padding</Card>
<Card padding="sm">Small Padding</Card>
<Card padding="md">Medium Padding</Card> // Default
<Card padding="lg">Large Padding</Card>
```

### Badge & StatusBadge
Badge components for displaying status and other pill-shaped indicators.

```jsx
import { Badge, StatusBadge } from '@/components/ui';

// Basic badge with variants
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="teal">Teal</Badge>

// Status badge (automatically picks the right color)
<StatusBadge status="On Track" />
<StatusBadge status="At Risk" />
<StatusBadge status="Behind" />
<StatusBadge status="Critical" />
<StatusBadge status="Completed" />
<StatusBadge status="In Progress" />
<StatusBadge status="Not Started" />

// Custom text with status color
<StatusBadge status="On Track">Custom Text</StatusBadge>
```

## CSS Classes

The design system also provides a set of utility classes in `globals.css` that you can use directly:

### Typography
```jsx
<h1 className="h1">Heading 1</h1>
<h2 className="h2">Heading 2</h2>
<h3 className="h3">Heading 3</h3>
<p className="body-text">Body text</p>
<p className="small-text">Small text</p>
<p className="caption">Caption text</p>
```

### Buttons
```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-disabled">Disabled Button</button>
```

### Status Pills
```jsx
<span className="status-pill status-on-track">On Track</span>
<span className="status-pill status-at-risk">At Risk</span>
<span className="status-pill status-critical">Critical</span>
```

### Progress Bars
```jsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '75%' }}></div>
</div>
```

## Color System

The design system uses the following color palette:

- Primary Colors:
  - Navy (`#1A1E23`): Primary background color
  - Teal (`#00E9A3`): Primary accent color

- Secondary Colors:
  - White (`#FFFFFF`): For text on dark backgrounds
  - Light Gray (`#E0E0E0`): For secondary text
  - Dark Gray (`#2D3239`): For secondary backgrounds and cards

- Status Colors:
  - Green (`#198754`): "On Track" status
  - Amber (`#FFC107`): "At Risk" status
  - Red (`#DC3545`): "Critical" status

Use the Tailwind color classes to apply these colors:
- `bg-navy`, `text-navy`
- `bg-teal`, `text-teal`
- `bg-light-gray`, `text-light-gray`
- `bg-dark-gray`
- `bg-success`, `text-success`
- `bg-warning`, `text-warning`
- `bg-danger`, `text-danger` 