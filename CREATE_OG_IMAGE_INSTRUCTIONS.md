# Creating Your VeyraTech OG Image

## What is an OG Image?

An OG (Open Graph) image is the preview image that appears when you share your website link on:
- LinkedIn
- Facebook
- WhatsApp
- Twitter/X
- Slack
- Email previews

**It makes your links look professional and increases click-through rates by 40%!**

## Specifications

- **Size:** 1200 x 630 pixels (exactly)
- **Format:** PNG or JPG
- **File size:** Under 1MB (smaller is better)
- **File name:** `og-image.png`
- **Location:** Save in `public/og-image.png`

## Design Recommendations

### Option 1: Use Canva (Easiest)

1. Go to https://www.canva.com
2. Create custom size: 1200 x 630 px
3. Use this layout:

```
┌─────────────────────────────────────┐
│  [VeyraTech Logo]                   │
│                                     │
│  Technology & AI Consulting         │
│  That Actually Makes Sense          │
│                                     │
│  • AI Strategy                      │
│  • Digital Transformation           │
│  • Business Automation              │
│                                     │
│  veyratech.co.ke | Nairobi, Kenya  │
└─────────────────────────────────────┘
```

### Design Elements to Include:

**Background:**
- Use your brand colors (primary: #1a1a2e, secondary: #FF6B35)
- Or use a gradient from dark blue to orange
- Keep it clean and not too busy

**Text:**
- Company name: VeyraTech (large, bold)
- Tagline: "Technology Consulting That Actually Works"
- Location: "Nairobi, Kenya"
- Keep text readable even when small

**Logo:**
- Place in top left or center
- Should be clear and visible

**Colors:**
- Primary: #1a1a2e (dark blue)
- Secondary: #FF6B35 (orange)
- Text: White or light gray
- Background: Use gradient or solid dark color

### Option 2: Use Figma (Professional)

1. Go to https://www.figma.com
2. Create 1200 x 630 frame
3. Design similar to Canva instructions above
4. Export as PNG

### Option 3: Hire a Designer on Fiverr

Search for "og image design" - usually costs $10-30
Provide them with:
- Your logo
- Brand colors
- Tagline: "Technology & AI Consulting That Actually Makes Sense"
- Location: "Nairobi, Kenya"
- Services list

## Example Text Layouts

### Layout 1 (Recommended):
```
VeyraTech
━━━━━━━━━━━━━━━━━━━━━━━
Technology Consulting That
Actually Makes Sense

✓ AI Strategy & Implementation
✓ Digital Transformation
✓ Business Automation

Nairobi, Kenya | veyratech.co.ke
```

### Layout 2 (Alternative):
```
Transform Your Business
with VeyraTech

Expert Technology Consulting
in Nairobi, Kenya

AI • Cloud • Automation • Strategy

veyratech.co.ke
```

## After Creating the Image

1. **Save as:** `og-image.png`
2. **Place in:** `c:\Users\HomePC\Documents\RoyalTech\royaltech\public\og-image.png`
3. **Test it:**
   - Share your website link on LinkedIn
   - Check if the image appears
   - Use this tool: https://www.opengraph.xyz/

## Testing Tools

1. **LinkedIn Post Inspector**
   https://www.linkedin.com/post-inspector/

2. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

3. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

4. **Open Graph Check**
   https://www.opengraph.xyz/

## Quick Tips

✓ Keep important text in the center (some platforms crop edges)
✓ Use high contrast (dark background, light text)
✓ Make text large enough to read on mobile
✓ Include your website URL
✓ Add "Kenya" or "Nairobi" for local branding
✓ Test on multiple platforms before finalizing

## Current Setup

Your metadata in `app/layout.tsx` is already configured:

```typescript
openGraph: {
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'VeyraTech - Technology Consulting Kenya',
    },
  ],
},
```

So once you create and save the image, it will automatically work!

## Need Help?

If you want me to create specific design instructions or provide more examples, just ask!

---

**Priority:** High - Do this within 24 hours for maximum SEO impact
**Time Required:** 30 minutes - 2 hours depending on method
**Cost:** Free (Canva/Figma) or $10-30 (Fiverr)
