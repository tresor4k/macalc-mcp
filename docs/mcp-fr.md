# MaCalculatriceEnLigne — compact French calculator server (`/api/mcp-fr`)

**Endpoint:** `https://macalculatriceenligne.com/api/mcp-fr` — MCP over Streamable HTTP, no authentication, no API key, free.
**Publisher:** Les Créavores (MaCalculatriceEnLigne.com) · **Support:** contact@macalculatriceenligne.com · https://macalculatriceenligne.com/contact/

17 read-only calculation tools for French (and some Belgian and Canadian) tax and social rules. Every answer returns the
result, the formula applied, the official source with its date, and a link to the matching calculator page on
macalculatriceenligne.com. The tools never write anything, never call third-party services and never ask for personal data.

## Connect

- **Claude:** Settings → Connectors → Add custom connector → URL `https://macalculatriceenligne.com/api/mcp-fr`, no OAuth.
- **Any MCP client (Streamable HTTP):** `{"mcpServers": {"macalc-fr": {"url": "https://macalculatriceenligne.com/api/mcp-fr"}}}`

## Tools (all read-only)

| Tool | What it computes | Main inputs |
|---|---|---|
| `calculate_french_income_tax` | French income tax 2026 (income 2025): brackets, family quotient cap, décote (art. 197 CGI) | income, parts, couple |
| `calculate_french_vat` | VAT from net or gross amount at 20, 10, 5.5 or 2.1 % (art. 278 CGI) | amount, rate, mode (`ht`/`ttc`) |
| `get_smic_france` | French minimum wage in force (hourly, monthly), mainland or Mayotte | hours_per_week, territory |
| `calculate_unemployment_benefit` | ARE daily allowance from the daily reference wage (SJR), floor and 75 % cap | daily_ref_salary |
| `calculate_inheritance_tax` | French inheritance tax by relationship (art. 777 CGI) | amount, relationship |
| `calculate_severance_pay` | Statutory severance pay (art. L1234-9 and R1234-2 Code du travail) | monthly_salary, years_seniority |
| `calculate_overtime_fr` | Overtime pay at +25 % / +50 % | base_hours, actual_hours, hourly_rate |
| `calculate_puissance_fiscale` | French fiscal horsepower (CV) | power_kw, regime, co2_g_km |
| `calculate_belgian_salary` | Belgian gross-to-net monthly salary | gross_monthly |
| `calculate_quebec_income_tax` | Quebec provincial income tax | income_cad |
| `calculate_canada_rrq` | Quebec Pension Plan (RRQ) contributions | gross_annual_cad |
| `calculate_canada_sales_tax` | GST/HST/PST/QST by province | province, amount, mode |
| `calculate_compound_interest` | Compound interest | principal, annual_rate, years, compounds_per_year |
| `calculate_loan_payment` | Monthly loan payment | principal, annual_rate, months |
| `calculate_percentage` | Percentages (share, variation, increase) | operation, a, b |
| `calculate_area` | Area of common shapes | shape and dimensions |
| `calculate_life_path_numerology` | Life path number (numerology, entertainment) | birth_date |

## Examples (checked against the live server on 25 November 2026)

| Ask | Expected answer |
|---|---|
| Income tax for a married couple, no children, taxable income EUR 60,000 | EUR 4,207.98 (marginal rate 30 %) |
| Inheritance tax on EUR 300,000 received by a child | EUR 38,194.35 (EUR 100,000 allowance) |
| EUR 1,200 excluding VAT at the standard rate | EUR 1,440 including VAT (VAT EUR 240) |
| Unemployment benefit for a gross salary of EUR 2,500 a month (SJR ≈ EUR 82.19) | EUR 46.85 a day, about EUR 1,405 a month |
| Severance pay, EUR 3,000 a month, 8 years of service | EUR 6,000 |

## Data and privacy

The server keeps only aggregated counters: number of calls per tool name, and per client name/version and user agent,
kept 90 days. It does not store the values you send, nor IP addresses, nor any account data. No advertising, sponsored
content or affiliate links appear in the server's answers. Site privacy policy:
https://macalculatriceenligne.com/politique-confidentialite/ · Legal notice: https://macalculatriceenligne.com/mentions-legales/

## Limits

Results are estimates based on the official rules cited in each answer; they are not tax, legal or financial advice.
Official values change on set dates (for example the French minimum wage on 1 December 2026); each answer states the
rule and date it applies.
