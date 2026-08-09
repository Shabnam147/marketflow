/**
 * Seed script — populates MongoDB with realistic demo data so the app
 * looks complete on first launch. Run with: npm run seed
 * Requires MONGODB_URI (and optionally ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD)
 * to be set in your .env file.
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../src/models/User";
import ClientProfile from "../src/models/ClientProfile";
import Service from "../src/models/Service";
import ServiceRequest from "../src/models/ServiceRequest";
import Project from "../src/models/Project";
import Task from "../src/models/Task";
import Lead from "../src/models/Lead";
import Appointment from "../src/models/Appointment";
import Invoice from "../src/models/Invoice";
import MarketingReport from "../src/models/MarketingReport";
import BlogPost from "../src/models/BlogPost";
import Notification from "../src/models/Notification";

const SERVICES = [
  { name: "Social Media Marketing", category: "Social", shortDescription: "Grow and manage your social presence.", description: "Full social media management including content, scheduling and analytics.", features: ["Instagram management", "Content calendar", "Analytics"], benefits: ["Consistent presence", "Engaged audience"], deliverables: ["Monthly content calendar", "Performance report"], startingPrice: 399 },
  { name: "SEO", category: "Organic", shortDescription: "Rank higher and earn free traffic.", description: "Keyword research, on-page and technical SEO, link building.", features: ["Keyword research", "On-page SEO", "Link building"], benefits: ["Compounding organic traffic"], deliverables: ["SEO audit", "Monthly report"], startingPrice: 599 },
  { name: "Google Ads", category: "Paid", shortDescription: "Capture high-intent search demand.", description: "Search and display campaigns with full conversion tracking.", features: ["Search campaigns", "Conversion tracking"], benefits: ["Immediate visibility"], deliverables: ["Campaign build", "Bi-weekly optimization"], startingPrice: 499 },
  { name: "Meta Ads", category: "Paid", shortDescription: "Reach and retarget on Facebook & Instagram.", description: "Prospecting and retargeting campaigns with creative testing.", features: ["Audience targeting", "Retargeting"], benefits: ["Recover lost visitors"], deliverables: ["Campaign launch", "Weekly creative tests"], startingPrice: 499 },
  { name: "Website Development", category: "Web", shortDescription: "Fast, conversion-focused websites.", description: "Landing pages, business sites and e-commerce builds.", features: ["Landing pages", "E-commerce"], benefits: ["Higher conversion rate"], deliverables: ["Design + build + launch"], startingPrice: 1499 },
];

const DEMO_CLIENTS = [
  { fullName: "Shabnam Iqbal", email: "shabnam@verdanthome.example", company: "Verdant Home" },
  { fullName: "James Okafor", email: "james@northlinefitness.example", company: "Northline Fitness" },
  { fullName: "Ana Ruiz", email: "ana@cursivestudio.example", company: "Cursive Studio" },
  { fullName: "Marco Belli", email: "marco@pathwise.example", company: "Pathwise Consulting" },
  { fullName: "Wei Chen", email: "wei@amberly.example", company: "Amberly Bakery" },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to your .env file before seeding.");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB. Seeding…");

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@marketflow.agency";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      fullName: "MarketFlow Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      isEmailVerified: true,
    });
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  }

  // --- Services ---
  const serviceDocs = [];
  for (const s of SERVICES) {
    const slug = s.name.toLowerCase().replace(/\s+/g, "-");
    let doc = await Service.findOne({ slug });
    if (!doc) doc = await Service.create({ ...s, slug, faqs: [] });
    serviceDocs.push(doc);
  }

  // --- Demo clients ---
  const clientDocs = [];
  for (const c of DEMO_CLIENTS) {
    let user = await User.findOne({ email: c.email });
    if (!user) {
      user = await User.create({
        fullName: c.fullName,
        email: c.email,
        companyName: c.company,
        passwordHash: await bcrypt.hash("Password123!", 12),
        role: "client",
        isEmailVerified: true,
      });
      await ClientProfile.create({ user: user._id, onboardingCompleted: true });
    }
    clientDocs.push(user);
  }

  // --- Leads (10) ---
  const existingLeads = await Lead.countDocuments();
  if (existingLeads === 0) {
    const sources = ["Contact Form", "Consultation Booking", "Website Form", "Manual Entry", "Free Tool"] as const;
    const statuses = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;
    await Lead.insertMany(
      Array.from({ length: 10 }).map((_, i) => ({
        name: `Demo Lead ${i + 1}`,
        email: `lead${i + 1}@example.com`,
        company: `Demo Company ${i + 1}`,
        source: sources[i % sources.length],
        status: statuses[i % statuses.length],
        estimatedValue: 500 + i * 250,
        serviceInterested: serviceDocs[i % serviceDocs.length].name,
      }))
    );
    console.log("Seeded 10 demo leads");
  }

  // --- Projects (5) + tasks ---
  const existingProjects = await Project.countDocuments();
  if (existingProjects === 0) {
    for (let i = 0; i < 5; i++) {
      const client = clientDocs[i];
      const service = serviceDocs[i % serviceDocs.length];
      const project = await Project.create({
        name: `${service.name} Growth Campaign`,
        client: client._id,
        service: service._id,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: [68, 40, 90, 20, 55][i],
        status: "In Progress",
      });
      await Task.insertMany([
        { project: project._id, title: "Kickoff & audit", isCompleted: true, order: 0 },
        { project: project._id, title: "Strategy approved", isCompleted: true, order: 1 },
        { project: project._id, title: "Execution in progress", isCompleted: false, order: 2 },
        { project: project._id, title: "Monthly report", isCompleted: false, order: 3 },
      ]);
    }
    console.log("Seeded 5 demo projects with tasks");
  }

  // --- Invoices ---
  const existingInvoices = await Invoice.countDocuments();
  if (existingInvoices === 0) {
    for (let i = 0; i < clientDocs.length; i++) {
      await Invoice.create({
        invoiceNumber: `INV-2026-${1000 + i}`,
        client: clientDocs[i]._id,
        service: serviceDocs[i % serviceDocs.length].name,
        amount: 500 + i * 100,
        tax: 0,
        total: 500 + i * 100,
        status: ["Paid", "Pending", "Overdue"][i % 3],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });
    }
    console.log("Seeded sample invoices");
  }

  // --- Marketing reports ---
  const existingReports = await MarketingReport.countDocuments();
  if (existingReports === 0) {
    for (const client of clientDocs) {
      await MarketingReport.create({
        client: client._id,
        month: "2026-07",
        websiteVisitors: 4200,
        leads: 34,
        conversionRate: 2.6,
        socialFollowers: 8200,
        engagementRate: 4.1,
        adSpend: 1800,
        revenue: 6800,
        roas: 3.8,
        seoTraffic: 2100,
        keywordRankings: [{ keyword: "digital marketing agency", position: 14 }],
      });
    }
    console.log("Seeded sample marketing reports");
  }

  // --- Appointments ---
  const existingAppointments = await Appointment.countDocuments();
  if (existingAppointments === 0) {
    const slots = ["09:00 AM", "11:00 AM", "02:00 PM"];
    for (let i = 0; i < 5; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i + 1);
      await Appointment.create({
        name: `Prospect ${i + 1}`,
        email: `prospect${i + 1}@example.com`,
        service: serviceDocs[i % serviceDocs.length].name,
        date: day,
        timeSlot: slots[i % slots.length],
        status: "Pending",
      });
    }
    console.log("Seeded sample appointments");
  }

  // --- Blog posts ---
  const existingPosts = await BlogPost.countDocuments();
  if (existingPosts === 0) {
    const posts = [
      { title: "5 Local SEO Wins Any Small Business Can Make This Month", category: "SEO" },
      { title: "How to Structure a Meta Ads Account for Retargeting", category: "Meta Ads" },
      { title: "A Simple Framework for Measuring Marketing ROI", category: "Business Growth" },
      { title: "Content Calendars That Actually Get Used", category: "Content Marketing" },
      { title: "Basic Cybersecurity Hygiene for Small Business Owners", category: "Cybersecurity for Businesses" },
    ];
    await BlogPost.insertMany(
      posts.map((p) => ({
        title: p.title,
        slug: p.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
        category: p.category,
        excerpt: `A practical, no-fluff guide: ${p.title.toLowerCase()}.`,
        content: `This is placeholder body content for "${p.title}". Replace with real, reviewed copy before publishing.`,
        author: admin._id,
        isPublished: true,
        publishedAt: new Date(),
      }))
    );
    console.log("Seeded 5 demo blog posts");
  }

  // --- Notifications ---
  const existingNotifs = await Notification.countDocuments();
  if (existingNotifs === 0) {
    await Notification.insertMany(
      clientDocs.map((c) => ({
        user: c._id,
        type: "report_uploaded",
        title: "New monthly report",
        body: "Your July marketing report is ready to view.",
        link: "/dashboard/reports",
      }))
    );
    console.log("Seeded sample notifications");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
