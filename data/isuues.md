Here’s the lean, no-nonsense MVP feature list to ship first:

### 1) Scanner → Answer (single screen)

* Barcode/PLU scan (offline-capable).
* Result: **Approved / Not approved**.
* If **not approved**: clear **reason** (size/brand/flavor/limit) + **1–3 on-shelf alternatives**.

### 2) Live benefits view (this month)

* Per-category remaining amounts exactly as WIC counts them (ounces, units, $).
* Simple “what this buys now” suggestions (e.g., “36 oz ≈ two 18-oz boxes”).
* Reset date shown; no-rollover note.

### 3) Rules engine (local + updatable)

* Encodes container/size rules (e.g., half-gallons vs gallons), strict sizes (16-oz bread), mixable ounces (cereal), brand/flavor limits.
* Runs fully offline; syncs rule updates in background.

### 4) Produce & variable-weight support

* PLU entry + quick “lbs remaining” math.
* Guidance for split purchases (e.g., “you can add up to 1.6 lb more”).

### 5) Language & literacy access

* Full Haitian-Creole, English, Spanish coverage for **all** UI, balances, and reasons.
* Tap-to-hear audio for key messages.
* Large icons and plain language.

### 6) Post-shop reconciliation

* Quick confirm of what was bought (manual or receipt photo stub).
* Instantly updates remaining benefits.

### 7) “Show cashier” summary

* One clean screen listing approved items and quantities to reduce checkout friction.

### 8) Offline resilience

* Scanning, matching, and rules work with no signal; queued sync for balances/rules.

### 9) Data/update pipeline

* Lightweight config feed for approved items and rules (no app release required).
* Error reporting: “flag this item” to fix bad mappings fast.

### 10) Privacy & accounts

* Guest mode for scanning (no sign-in).
* Minimal data collection; clear consent if linking eWIC balance.

### 11) Performance & reliability

* Scan → decision in ≤3 seconds on average hardware.
* Graceful fallback messages when data is stale or partial.

### 12) Basic analytics (non-sensitive)

* Count where users get blocked (by reason) to prioritize rule fixes and alternatives.

If you want, I’ll turn this into a checklist with acceptance criteria per feature so you can assign tasks and test quickly.
