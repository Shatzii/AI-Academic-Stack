#!/bin/bash

# Accessibility Audit Script
# Run this script to check for accessibility issues

echo "Running accessibility audit..."

# Check for alt text on images
echo "Checking for missing alt attributes..."
find src -name "*.jsx" -exec grep -l "<img" {} \; | xargs grep -L "alt="

# Check for semantic HTML
echo "Checking for semantic HTML usage..."
grep -r "<div" src/ | wc -l
grep -r "<main\|<header\|<footer\|<nav\|<section\|<article" src/ | wc -l

# Check for ARIA labels
echo "Checking for ARIA labels..."
grep -r "aria-label\|aria-labelledby\|aria-describedby" src/ | wc -l

# Check for keyboard navigation
echo "Checking for keyboard event handlers..."
grep -r "onKeyDown\|onKeyUp\|onKeyPress" src/ | wc -l

# Check for focus management
echo "Checking for focus management..."
grep -r "autoFocus\|focus()" src/ | wc -l

echo "Accessibility audit completed. Review the output above."
