# macalc — The Most Comprehensive Everyday Calculator MCP Server

[![macalc MCP server](https://glama.ai/mcp/servers/tresor4k/macalc-mcp/badges/card.svg)](https://glama.ai/mcp/servers/tresor4k/macalc-mcp)

**501 calculator tools** across **22 categories** covering **8 countries' tax systems**. Free, no API key required.

## Quick Start

Two install modes — pick whichever your MCP client supports.

### Option A — Remote (Streamable HTTP, zero install)

For clients with native remote MCP support (Claude Desktop ≥ 0.8, Cursor, Windsurf, VS Code MCP, etc.)

```json
{
  "mcpServers": {
    "macalc": {
      "url": "https://macalculatriceenligne.com/api/mcp"
    }
  }
}
```

### Option B — Local stdio proxy (works everywhere)

For clients that only speak stdio, or sandboxed environments:

```json
{
  "mcpServers": {
    "macalc": {
      "command": "npx",
      "args": ["-y", "macalc-mcp"]
    }
  }
}
```

Or with Docker:

```json
{
  "mcpServers": {
    "macalc": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "ghcr.io/tresor4k/macalc-mcp:latest"]
    }
  }
}
```

That's it. No API key, no auth, no setup.

## What's Inside — 501 Tools

### Finance (8 countries)
| Country | Tools | Examples |
|---------|-------|---------|
| 🇫🇷 France | 85+ | Income tax (IR 2026), salary gross→net, VAT, mortgage, notary fees, inheritance, retirement, unemployment, auto-entrepreneur |
| 🇧🇪 Belgium | 35+ | Precompte professionnel, bonus emploi, pension, cheques repas, droits donation |
| 🇨🇭 Switzerland | 30+ | Federal + cantonal tax, AVS/LPP, LAMal, 3rd pillar, frontalier |
| 🇨🇦 Canada/Quebec | 25+ | Federal + provincial tax, RRQ, RQAP, REER, CELI, TPS/TVQ |
| 🇺🇸 USA | 15+ | Federal income tax, FICA, state tax, 401k, HSA |
| 🇬🇧 UK | 10+ | Income tax, NI, SDLT, student loan repayment |
| 🇲🇦 Morocco | 10+ | IR, CNSS, TVA |
| 🇸🇳 Senegal | 10+ | IR, CSS, TVA |

### Health & Sport (50+ tools)
BMI, BMR (Mifflin/Harris-Benedict), TDEE, heart rate zones (Karvonen), 1RM (Epley/Brzycki), VMA (Cooper/Luc-Léger), VO2max, race prediction (Riegel), marathon/half pace, due date (3 methods), ovulation calendar, body fat (Navy method), daily calories, macros, hydration.

### Math (60+ tools)
Percentages (increase/decrease/ratio), averages (weighted/geometric/harmonic), Pythagoras, area (triangle/circle/rectangle/trapezoid/polygon), volume (sphere/cylinder/cone/cube), perimeter, equations (1st/2nd degree), sequences (arithmetic/geometric), fractions, statistics (mean/median/mode/std dev), GCD/LCM, base conversion.

### Construction (40+ tools)
Concrete volume & mix (B25 DTU 21), paint coverage, tile quantity, staircase dimensions (Blondel formula), insulation R-value, roof surface & slope, cable section (NF C 15-100), beam dimensioning (Eurocode 5), gravel/sand tonnage, wallpaper rolls, plasterboard sheets.

### Science (25+ tools)
Ohm's law, Newton's laws, pH calculation, dilution (C1V1=C2V2), density, radioactive decay, speed of sound, ideal gas law, molar mass, concentration.

### Conversions (40+ tools)
Temperature, distance, weight, volume, speed, pressure, energy, data storage, cooking units, shoe sizes, clothing sizes, currency.

### Running & Cycling (35+ tools)
Pace calculator, VMA (6 test methods), VO2max, FTP, heart rate zones, race prediction, training plan, calorie burn, hydration needs, bike gear ratio, tire pressure.

### Education (20+ tools)
GPA calculator (French bac/brevet system), weighted average, statistics, derivatives, combinatorics, probability distributions.

### Real Estate (15+ tools)
Rental yield (gross/net/net-net), Pinel tax reduction, PTZ eligibility, DPE energy class, Carrez surface, notary fees by department, loan comparison.

### Cooking & Nutrition (15+ tools)
Recipe nutrition calculator, baking conversions, glycemic load, caffeine intake, daily vitamins, unit conversions (cups/ml/oz).

### Travel (10+ tools)
Luggage weight calculator, jet lag recovery, travel budget, voltage adapters, sun exposure time.

### Animals (8+ tools)
Dog/cat food calculator, pet age converter (corrected formula), aquarium volume, breeding due date.

### Astronomy (8+ tools)
Sunrise/sunset, moon phase, solar panel output, wind chill, heat index, carbon sequestration.

### Textile (5+ tools)
Fabric yardage, knitting yarn calculator, ring/bra/hat size converters.

## Technical Details

| Property | Value |
|----------|-------|
| **Endpoint** | `https://macalculatriceenligne.com/api/mcp` |
| **Transport** | Streamable HTTP (stateless) |
| **Protocol** | MCP v1 (`@modelcontextprotocol/sdk ^1.27.1`) |
| **Auth** | None (free, no API key) |
| **Rate limit** | 1,000 calls/day |
| **Response format** | Structured JSON with formula, source, reference URL |
| **Discovery** | `https://macalculatriceenligne.com/.well-known/mcp/server.json` |

## Example Usage

Ask your AI assistant:

> "Calculate the French income tax on 45,000€ for a single person"

The assistant calls `calculate_ir_france` with `{revenu_net_imposable: 45000, parts: 1}` and returns:

```json
{
  "impot": 4611,
  "taux_effectif": "10.2%",
  "taux_marginal": "30%",
  "tranches": [
    {"min": 0, "max": 11624, "taux": "0%", "impot": 0},
    {"min": 11624, "max": 29638, "taux": "11%", "impot": 1982},
    {"min": 29638, "max": 45000, "taux": "30%", "impot": 2629}
  ],
  "source": "Article 197 CGI — Loi de finances 2026",
  "reference_url": "https://macalculatriceenligne.com/finance/fiscalite/calcul-impots/"
}
```

## All Tool Categories

```
Finance FR (85)     Finance BE (35)     Finance CH (30)
Finance CA (25)     Finance US (15)     Finance UK (10)
Finance MA (10)     Finance SN (10)     Health (30)
Sport/Running (35)  Math (60)           Construction (40)
Science (25)        Conversions (40)    Education (20)
Real Estate (15)    Cooking (15)        Travel (10)
Animals (8)         Astronomy (8)       Textile (5)
Automotive (10)
```

**Total: 501 tools**

## Links

- **Website**: [macalculatriceenligne.com](https://macalculatriceenligne.com)
- **MCP endpoint**: [macalculatriceenligne.com/api/mcp](https://macalculatriceenligne.com/api/mcp)
- **MCP info page**: [macalculatriceenligne.com/mcp/](https://macalculatriceenligne.com/mcp/)
- **API docs**: [macalculatriceenligne.com/api-docs/](https://macalculatriceenligne.com/api-docs/)
- **Chrome extension**: [Calculer Partout](https://macalculatriceenligne.com/extension-chrome/)
- **Telegram bot**: [@macalculatrice_bot](https://macalculatriceenligne.com/telegram/)

## License

MIT
