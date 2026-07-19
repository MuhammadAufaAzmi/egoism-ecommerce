
## Strict Product Variant Guardrails
When parsing filenames or unstructured data to determine e-commerce product variants (like Color or Size):
1. **Never use blind string splitting**: Do not assume filenames perfectly follow a specific delimiter schema unless strictly validated. Blind splitting leads to invalid variants like timestamps or design names being saved as colors.
2. **Use an Allowed List**: Extracted colors MUST be validated against an explicit list of known, actual apparel colors provided by the user (e.g., BLACK, WHITE, NAVY, MAROON, GREY, LIGHT BLUE). If a parsed word is not in the allowed list, it must be flagged for manual review, not blindly inserted.
3. **Apparel vs. Design Color**: Be aware that color words in filenames (e.g., "red", "grey") might refer to the **ink/design color** printed on the shirt, not the fabric color. If a shirt only comes in Black and White, ensure the apparel variant is set to Black/White, and handle the design color separately (e.g., "BLACK - RED TEXT") or ask the user for the preferred naming convention.
