// AUTO-CURATED core profile (15 tools) exposed by default by the stdio wrapper.
// inputSchema objects are copied VERBATIM from the hosted server's tools/list
// (https://macalculatriceenligne.com/api/mcp) — do not edit schemas by hand;
// re-run the generator against a fresh tools/list dump instead.
// Descriptions are curated locally for clarity (purpose, usage, behavior, params).
// Set MACALC_MCP_FULL=1 to expose the full remote catalog (446 tools) instead.
export const CORE_TOOLS = [
  {
    "name": "calculate_french_income_tax",
    "description": "Calculate French personal income tax (impôt sur le revenu) for the 2026 tax year using the official progressive brackets (Article 197 CGI) and the family-quotient system. Use when the user asks how much income tax they owe in France. Inputs: `income` (annual net taxable income in EUR) and optional `parts` (number of family-quotient shares, default 1 — e.g. 2 for a married couple, 2.5 with one child). Returns total tax, effective and marginal rates, and the per-bracket breakdown. Read-only and deterministic: same inputs always give the same result; no data is stored. Not tax advice. For payroll gross-to-net conversion use calculate_french_salary instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "income": {
          "type": "number",
          "minimum": 0,
          "description": "Annual net taxable income in euros"
        },
        "parts": {
          "type": "number",
          "minimum": 0.5,
          "maximum": 20,
          "default": 1,
          "description": "Number of fiscal shares (1=single, 2=married, +0.5 per child)"
        }
      },
      "required": [
        "income"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_french_salary",
    "description": "Convert a French gross salary to net salary for 2026, applying the social-contribution rates of the selected employment status. Use when the user knows their gross pay and wants their take-home pay in France. Inputs: `gross_monthly` (gross monthly salary in EUR) and optional `status` ('cadre', 'non-cadre' or civil servant — see the enum). Returns monthly and annual net, total social contributions, and employer cost. Read-only, deterministic estimate based on standard rates; individual company agreements may differ. For income tax on that salary, use calculate_french_income_tax.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "gross_monthly": {
          "type": "number",
          "minimum": 0,
          "description": "Gross monthly salary in euros"
        },
        "status": {
          "type": "string",
          "enum": [
            "cadre",
            "non_cadre",
            "fonction_publique"
          ],
          "default": "cadre",
          "description": "Employment status"
        }
      },
      "required": [
        "gross_monthly"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_us_federal_tax",
    "description": "Calculate US federal income tax for tax year 2026 using the IRS progressive brackets and the standard deduction for the chosen filing status. Use for a quick federal-only estimate; it does NOT include state income tax or FICA payroll taxes. Inputs: `income` (annual gross income in USD) and optional `filing_status`. Returns taxable income after standard deduction, federal tax, effective and marginal rates. Read-only and deterministic. Estimates only — not tax advice.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "income": {
          "type": "number",
          "minimum": 0,
          "description": "Gross annual income in USD"
        },
        "filing_status": {
          "type": "string",
          "enum": [
            "single",
            "married_joint",
            "married_separate",
            "head_of_household"
          ],
          "default": "single",
          "description": "Filing status"
        }
      },
      "required": [
        "income"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_uk_income_tax",
    "description": "Calculate UK income tax for the 2025/26 tax year using HMRC bands, including the personal-allowance taper above £100,000. Use for England/Wales/NI income tax questions (National Insurance is not included; Scottish bands are not modelled). Input: `income` (annual gross income in GBP). Returns personal allowance, taxable income, income tax, effective and marginal rates. Read-only, deterministic, estimate only.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "income": {
          "type": "number",
          "minimum": 0,
          "description": "Annual gross income in GBP"
        }
      },
      "required": [
        "income"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_canada_federal_tax",
    "description": "Calculate Canadian FEDERAL income tax using CRA brackets and the basic personal amount. Use for a federal-only estimate; provincial/territorial tax and CPP/EI are NOT included, so the real total tax is higher. Input: `income_cad` (annual income in CAD). Returns basic personal amount, taxable income, federal tax, effective and marginal rates. Read-only, deterministic, estimate only.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "income_cad": {
          "type": "number",
          "minimum": 0,
          "description": "Annual income in Canadian dollars (CAD)"
        }
      },
      "required": [
        "income_cad"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_mortgage",
    "description": "Calculate the fixed monthly payment, total interest and total cost of a mortgage or amortizing loan, with an optional month-by-month amortization schedule. Use for home-loan or any fixed-rate amortizing loan questions in any currency. Inputs: `principal` (amount borrowed), `annual_rate` (nominal annual interest rate in percent, e.g. 3.5), `years` (term in years), optional `with_schedule` (boolean — include the full amortization table). Read-only and deterministic. Does not include insurance, taxes or fees.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "minimum": 1,
          "description": "Loan amount in currency units"
        },
        "annual_rate": {
          "type": "number",
          "minimum": 0.01,
          "maximum": 30,
          "description": "Annual interest rate in %"
        },
        "years": {
          "type": "number",
          "minimum": 1,
          "maximum": 50,
          "description": "Loan duration in years"
        },
        "with_schedule": {
          "type": "boolean",
          "default": false,
          "description": "Include first 12 months + last month amortization"
        }
      },
      "required": [
        "principal",
        "annual_rate",
        "years"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_compound_interest",
    "description": "Compute compound growth of a lump sum with A = P·(1+r/n)^(n·t). Use for savings, investment or retirement projections without periodic contributions. Inputs: `principal` (initial amount), `annual_rate` (annual rate in percent), `years` (duration), optional `compounds_per_year` (compounding frequency, default annual). Returns final amount, total interest earned and a yearly breakdown. Read-only, deterministic. For loans/repayments use calculate_loan_payment or calculate_mortgage instead.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "minimum": 0,
          "description": "Initial amount"
        },
        "annual_rate": {
          "type": "number",
          "description": "Annual interest rate in %"
        },
        "years": {
          "type": "number",
          "minimum": 0,
          "description": "Investment duration in years"
        },
        "compounds_per_year": {
          "type": "number",
          "minimum": 1,
          "default": 12,
          "description": "Compounding frequency per year"
        }
      },
      "required": [
        "principal",
        "annual_rate",
        "years"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_loan_payment",
    "description": "Calculate the fixed monthly payment of a generic amortizing loan when the term is expressed in months. Inputs: `principal` (amount borrowed), `annual_rate` (annual interest rate in percent), `months` (term in months). Returns monthly payment, total cost and total interest. Read-only and deterministic. Prefer calculate_mortgage if you want a term in years or an amortization schedule.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "principal": {
          "type": "number",
          "minimum": 1,
          "description": "Loan amount"
        },
        "annual_rate": {
          "type": "number",
          "minimum": 0.01,
          "maximum": 50,
          "description": "Annual interest rate in %"
        },
        "months": {
          "type": "number",
          "minimum": 1,
          "maximum": 600,
          "description": "Loan duration in months"
        }
      },
      "required": [
        "principal",
        "annual_rate",
        "months"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_percentage",
    "description": "Perform one of three percentage operations selected by `operation`: the value of a percent of a total, the percentage change between two values, or what percent one value is of another. Inputs: `operation` (see enum), `a` and `b` (the two operands — their meaning depends on the operation, as described in the parameter docs). Returns the numeric result with the applied formula. Read-only and deterministic.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "operation": {
          "type": "string",
          "enum": [
            "of",
            "change",
            "what_pct"
          ],
          "description": "of: X% of Y; change: from A to B; what_pct: X is what % of Y"
        },
        "a": {
          "type": "number",
          "description": "First value"
        },
        "b": {
          "type": "number",
          "description": "Second value"
        }
      },
      "required": [
        "operation",
        "a",
        "b"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_vat_generic",
    "description": "Add or remove VAT/GST/sales tax at any custom rate, for any country. Inputs: `amount`, `rate` (tax rate in percent) and optional `mode` (whether `amount` is before-tax or after-tax — see enum). Returns amount before tax, amount after tax and the tax amount. Read-only and deterministic. Country-specific helpers (French/UK/Swiss VAT…) exist in the full catalog via get_bundle_tools('finance-universal').",
    "inputSchema": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number",
          "minimum": 0,
          "description": "Amount"
        },
        "rate": {
          "type": "number",
          "minimum": 0,
          "maximum": 100,
          "description": "Tax rate in %"
        },
        "mode": {
          "type": "string",
          "enum": [
            "ht",
            "ttc"
          ],
          "default": "ht",
          "description": "ht=before tax, ttc=after tax"
        }
      },
      "required": [
        "amount",
        "rate"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_bmi",
    "description": "Calculate Body Mass Index and the corresponding WHO weight category for an adult. Inputs: `weight_kg` (kilograms) and `height_cm` (centimeters). Returns the BMI value and category. Read-only and deterministic. Screening indicator only — not a medical diagnosis; not valid for children or athletes with high muscle mass.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "weight_kg": {
          "type": "number",
          "minimum": 1,
          "description": "Weight in kilograms"
        },
        "height_cm": {
          "type": "number",
          "minimum": 50,
          "description": "Height in centimeters"
        }
      },
      "required": [
        "weight_kg",
        "height_cm"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "calculate_tdee",
    "description": "Calculate Total Daily Energy Expenditure (maintenance calories) by multiplying a Basal Metabolic Rate by a standard activity factor. Inputs: `bmr` (basal metabolic rate in kcal — compute it first if unknown) and `activity_level` (see enum, from sedentary to very active). Returns TDEE in kcal/day. Read-only and deterministic. General guidance, not medical or dietary advice.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bmr": {
          "type": "number",
          "minimum": 1,
          "description": "Basal Metabolic Rate in kcal"
        },
        "activity_level": {
          "type": "string",
          "enum": [
            "sedentary",
            "light",
            "moderate",
            "active",
            "very_active"
          ],
          "description": "Activity level"
        }
      },
      "required": [
        "bmr",
        "activity_level"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "list_bundles",
    "description": "List the 31 thematic bundles that organize the full macalc catalog of 446 calculators (finance by country, real-estate, health, math, construction, conversions…). Use this FIRST when the user needs a calculator that is not among this server's core tools, then call get_bundle_tools to see the tools of the relevant bundle. Takes no meaningful parameters. Read-only, deterministic, returns the same catalog every time.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "_unused": {
          "type": "string",
          "description": "No parameters needed"
        }
      },
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "get_bundle_tools",
    "description": "Return the tool names and descriptions inside one thematic bundle of the full macalc catalog. Use after list_bundles to discover a specific calculator, then invoke it with call_any_calculator. Input: `bundle_id` (one of the enum values, e.g. 'finance-france', 'sante', 'math'). Read-only and deterministic.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bundle_id": {
          "type": "string",
          "enum": [
            "finance-france",
            "finance-belgique",
            "finance-suisse",
            "finance-us",
            "finance-uk",
            "finance-afrique-quebec",
            "finance-universal",
            "immobilier",
            "sante",
            "sport",
            "math",
            "conversions",
            "education",
            "construction",
            "science",
            "auto-transport",
            "vie-quotidienne",
            "temps-rh",
            "cuisine",
            "animaux",
            "astronomie-nature",
            "voyage",
            "jardinage",
            "photographie",
            "musique",
            "crypto",
            "jeux-probabilites",
            "plomberie",
            "textile-mode",
            "fun",
            "energie"
          ],
          "description": "Bundle ID from list_bundles"
        }
      },
      "required": [
        "bundle_id"
      ],
      "additionalProperties": false,
      "$schema": "http://json-schema.org/draft-07/schema#"
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "call_any_calculator",
    "description": "Invoke ANY of the 446 calculators of the hosted macalc catalog by name — not just the core tools listed by this server. Workflow: 1) list_bundles to find the right domain, 2) get_bundle_tools(bundle_id) to get the exact tool name and its parameters, 3) call_any_calculator with that `tool_name` and its `arguments` object. The call is forwarded verbatim to the hosted macalc API (network request, no authentication, nothing stored beyond anonymous usage counters). Read-only and deterministic for a given catalog version. Returns the target calculator's JSON result ({result, formula, source, reference_url}) or a clear error if the tool name is unknown.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tool_name": {
          "type": "string",
          "description": "Exact name of the target calculator as returned by get_bundle_tools (e.g. 'calculate_french_notary_fees')."
        },
        "arguments": {
          "type": "object",
          "description": "Arguments object for the target calculator, matching the parameter names given by get_bundle_tools. Pass {} if the tool takes no parameters.",
          "additionalProperties": true
        }
      },
      "required": [
        "tool_name"
      ],
      "additionalProperties": false
    },
    "annotations": {
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  }
];
