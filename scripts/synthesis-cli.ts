#!/usr/bin/env bun

/**
 * Zo Synthesis Agent CLI
 * Interact with The Synthesis hackathon API
 */

const API_KEY = process.env.SYNTHESIS_API_KEY || "sk-synth-3573cfd3605117999f4f38a186076be73beaee1965feebc0";
const BASE_URL = "https://synthesis.devfolio.co";

interface Prize {
  uuid: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
}

interface Track {
  uuid: string;
  slug: string;
  name: string;
  company: string;
  description: string;
  prizes: Prize[];
}

// Parse CLI args
const args = process.argv.slice(2);
const command = args[0] || "help";

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function research() {
  console.log("🔍 Researching Synthesis hackathon...\n");
  
  // Fetch tracks
  const catalog = await fetchJSON<{ items: Track[] }>("/catalog");
  
  console.log("📊 TRACKS AVAILABLE:\n");
  for (const track of catalog.items.slice(0, 10)) {
    const totalPrize = track.prizes.reduce((sum, p) => sum + p.amount, 0);
    console.log(`• ${track.name} (${track.company})`);
    console.log(`  Slug: ${track.slug}`);
    console.log(`  Prizes: $${totalPrize.toLocaleString()} total`);
    console.log("");
  }
  
  console.log(`Total tracks: ${catalog.items.length}`);
}

async function tracks() {
  const catalog = await fetchJSON<{ items: Track[] }>("/catalog");
  
  console.log("📋 ALL TRACKS:\n");
  for (const track of catalog.items) {
    console.log(`${track.slug.padEnd(40)} | ${track.name}`);
  }
}

async function prizes(filterMin?: number) {
  const catalog = await fetchJSON<{ items: Track[] }>("/catalog");
  
  // Flatten prizes
  const allPrizes: (Prize & { track: string; company: string })[] = [];
  for (const track of catalog.items) {
    for (const prize of track.prizes) {
      allPrizes.push({ ...prize, track: track.name, company: track.company });
    }
  }
  
  // Sort by amount desc
  allPrizes.sort((a, b) => b.amount - a.amount);
  
  // Filter
  const filtered = filterMin ? allPrizes.filter(p => p.amount >= filterMin) : allPrizes;
  
  console.log(`🏆 PRIZES ${filterMin ? `(min $${filterMin})` : ""}:\n`);
  console.log("Amount".padStart(10), "|", "Name".padEnd(40), "|", "Track");
  console.log("-".repeat(80));
  
  for (const prize of filtered.slice(0, 20)) {
    console.log(
      `$${prize.amount.toLocaleString()}`.padStart(10),
      "|",
      prize.name.slice(0, 38).padEnd(40),
      "|",
      prize.track.slice(0, 30)
    );
  }
  
  console.log(`\nShowing ${Math.min(20, filtered.length)} of ${filtered.length} prizes`);
}

async function submit(name: string, description: string, track: string) {
  console.log("📤 Submitting project to Synthesis...\n");
  
  try {
    const result = await fetchJSON<{ submissionId: string; status: string }>("/submit", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        trackSlug: track,
        agentId: "9522e1a83c2b4d3facd4dcf955558ebd",
      }),
    });
    
    console.log("✅ Submission successful!");
    console.log(`   ID: ${result.submissionId}`);
    console.log(`   Status: ${result.status}`);
  } catch (err) {
    console.log("⚠️  Submission endpoint not yet available.");
    console.log("   Project details:");
    console.log(`   Name: ${name}`);
    console.log(`   Track: ${track}`);
    console.log(`   Description: ${description.slice(0, 100)}...`);
  }
}

async function status() {
  console.log("📊 Zo Synthesis Agent Status\n");
  console.log("Agent ID:     9522e1a83c2b4d3facd4dcf955558ebd");
  console.log("Team ID:      2cbb97e23be5479ab774735111753deb");
  console.log("Network:      Base Mainnet");
  console.log("Standard:     ERC-8004");
  console.log("\nRegistration: https://basescan.org/tx/0xa40fdc55c29773597c661598beecdf11e2001d3056ebd0dd64140e8dae787659");
}

function help() {
  console.log(`
Zo Synthesis Agent CLI

Usage:
  bun scripts/synthesis-cli.ts <command> [options]

Commands:
  research              Research hackathon tracks and prizes
  tracks                List all track slugs
  prizes [--min N]      List prizes (optionally filter by min amount)
  submit                Submit a project (interactive)
  status                Show agent status and identity
  help                  Show this help

Examples:
  bun scripts/synthesis-cli.ts research
  bun scripts/synthesis-cli.ts prizes --min 1000
  bun scripts/synthesis-cli.ts tracks
`);
}

// Run command
(async () => {
  try {
    switch (command) {
      case "research":
        await research();
        break;
      case "tracks":
        await tracks();
        break;
      case "prizes":
        const minIdx = args.indexOf("--min");
        const minAmount = minIdx >= 0 ? parseInt(args[minIdx + 1]) : undefined;
        await prizes(minAmount);
        break;
      case "submit":
        const nameIdx = args.indexOf("--name");
        const descIdx = args.indexOf("--description");
        const trackIdx = args.indexOf("--track");
        
        if (nameIdx >= 0 && descIdx >= 0 && trackIdx >= 0) {
          await submit(args[nameIdx + 1], args[descIdx + 1], args[trackIdx + 1]);
        } else {
          console.log("Usage: submit --name \"Name\" --description \"Desc\" --track \"slug\"");
        }
        break;
      case "status":
        await status();
        break;
      default:
        help();
    }
  } catch (err) {
    console.error("❌ Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
})();