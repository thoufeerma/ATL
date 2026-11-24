# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Every kind of buyer and owner of weighing, billing and packaging equipment in Kerala (confirmed: all of these matter):

- **Shops and small businesses**: supermarkets, bakeries, vegetable and fish stalls, jewellers, retailers. They need a scale or billing machine that works, and they want a price and a person to talk to, usually by WhatsApp or phone.
- **Industry and institutions**: factories, hospitals, laboratories, government offices. They need specifications, quotes, calibration and compliance paperwork.
- **Existing customers**: people who need service, repair, AMC or calibration for equipment they already own.
- **Dealers and resellers**: businesses buying in volume to resell.

## Product Purpose

The public website of Accurate Trade Links (ATL), a Thiruvananthapuram-based dealer, distributor and service provider of precision weighing scales, billing/POS systems, printing scales, counting machines, sealing, labelling and filling machinery. It lets visitors browse the catalogue (headless WooCommerce at backend.accuratetradelinks.com), see prices (MRP and selling price, incl. GST), and enquire by WhatsApp, phone or the contact form. There is no online checkout. A separate engineer area (/engineer) serves ATL's own technicians.

Success means a visitor finds the right product or service quickly and contacts ATL.

## Positioning

A local, long-established Kerala dealer that sells *and* services: authorised distributor for many brands, its own AMC and calibration team, installation included, support across Kerala. The selling point is the relationship and after-sales service, not just the box.

## Operating Context

- Enquiries happen on WhatsApp (+91 97475 41006) and phone (+91 97475 41006, 0471 2334553); email accuratetradelinks@gmail.com.
- Office: TC 26/640(3), Future Centre, Oottukuzhy Road, Trivandrum-1.
- Catalogue, categories, attributes (Brand, Max Capacity, Platform Size) and prices come from WooCommerce; category display order is fixed in `src/lib/category-order.ts`.
- Many visitors browse on phones.

## Capabilities and Constraints

- Next.js 15 App Router, Tailwind v4, deployed on Vercel; WooCommerce data cached for 5 minutes.
- Products listing with faceted filters, product detail with variations, WhatsApp enquiry with product context.
- No online payment or cart. Prices are shown incl. GST, MRP struck through when higher.
- Almost no products have photos yet (99 of 100 had none at last check).

## Brand Commitments

- Name: Accurate Trade Links, short form ATL. Existing red ATL logo (`public/images/logo.png`).
- Brand red (#e30613) and dark navy; WhatsApp green for WhatsApp actions.

## Evidence on Hand

Confirmed real by the owner:
- Founded 2003 in Thiruvananthapuram; timeline milestones on the About page (2003, 2008, 2012, 2016, 2020, 2024).
- 1,00,000+ customers; 50+ brands; 5,000+ active AMC contracts.
- The four customer testimonials on the home page (Rajesh Menon, Dr. Priya Nair, Sunil Thomas, Abdul Hameed). Their headshots are stock photos and must not be presented as the real people.
- Brands carried include ATL Casio, Essae, Phoenix, CAS, Mettler Toledo, TSC, Citizen, Epson, Honeywell and others listed in the code.

Open: the site says both "25+ years" and "founded 2003" (23 years in 2026); the owner has not said which wording to keep.

Not available: real photos of the office, team, installations or products. Do not fabricate them; stock imagery must not pose as ATL's own people or premises.

## Product Principles

1. Contact is the conversion: every page should make WhatsApp/call/enquiry obvious without shouting.
2. Prove it with real facts (since 2003, brands, AMC contracts, service across Kerala), never with invented ones.
3. Serve the shopkeeper and the procurement officer alike: plain language first, specs available for those who need them.
4. The catalogue must stay fast and usable on a phone.
