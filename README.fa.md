<div align="center" dir="rtl">

# frontend-starter

**ساخت پروژه‌های فرانت‌اند آمادهٔ تولید در چند ثانیه.**

از بین React، Next.js، Vue، Svelte، SolidJS، Qwik، Astro و Angular انتخاب کنید — سپس TypeScript یا JavaScript، Tailwind CSS نسخهٔ ۴، ESLint، Prettier و Git را با یک دستور تعاملی یا اسکریپتی اضافه کنید.

[![CI](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammadhossein-asadi/frontend-starter-cli/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![Node.js](https://img.shields.io/node/v/frontend-starter-cli)](https://www.npmjs.com/package/frontend-starter-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [📖 مستندات](#-مستندات) • [🚀 شروع سریع](#-شروع-سریع) • [🤝 مشارکت](#-مشارکت)

</div>

---

## 🌟 معرفی

<div dir="rtl">

**frontend-starter** یک ابزار خط فرمان (CLI) چندسکویی برای ساخت پایهٔ پروژه‌های فرانت‌اندِ کامل و آمادهٔ کار است. به‌جای اینکه با یک ابزار فریم‌ورک را انتخاب کنید و بعد استایل‌دهی، لینت، فرمت و تنظیمات Git را دستی سر هم کنید، یک‌بار گزینه‌ها را انتخاب می‌کنید و پروژهٔ یکدست را در یک مرحله می‌سازید.

می‌توانید از پرامپت‌های تعاملی برای انتخاب گزینه‌ها استفاده کنید، با فلگ‌ها یک راه‌اندازی تکرارپذیر اجرا کنید، یا ترجیحات خود را در کانفیگ سراسری ذخیره و بعداً دوباره استفاده کنید. قالب‌ها داخل CLI باندل شده‌اند، بنابراین فایل‌های پروژه پیش از نصب اختیاری وابستگی‌ها به‌صورت محلی تولید می‌شوند.

</div>

### 🎯 چرا frontend-starter؟

<div dir="rtl">

| شروع یک پروژه معمولاً یعنی… | frontend-starter کمک می‌کند با… |
| --- | --- |
| مقایسهٔ ژنراتورها و فلگ‌های مخصوص هر فریم‌ورک | ارائهٔ ۸ فریم‌ورک محبوب در یک CLI |
| سیم‌کشی دستی استایل و ابزارها | ترکیب قالب‌های Tailwind، ESLint و Prettier متناسب با فریم‌ورک |
| تکرار انتخاب‌های راه‌اندازی | ذخیرهٔ پیش‌فرض‌ها در کانفیگ سراسری چندسکویی |
| حدس زدن خروجی یک دستور | پیش‌نمایش درخت فایل و `package.json` با `--dry-run` |
| بازنویسی ناخواستهٔ فایل‌های موجود | جلوگیری از نوشتن ناامن مگر با `--force` |
| خطای شبکه وسط راه‌اندازی | نوشتن فایل‌های قالب باندل‌شده پیش از تلاش برای نصب پکیج‌ها |

</div>

---

## ✨ ویژگی‌ها

<div dir="rtl">

### 🧰 یک CLI، هشت فریم‌ورک

ساخت پروژه برای **React، Next.js، Vue 3، Svelte 5، SolidJS، Qwik، Astro** و **Angular**. فریم‌ورک را در جریان تعاملی انتخاب کنید یا با `--framework` مشخص کنید.

### 🧩 انتخاب راه‌اندازی پروژه

- **زبان‌ها:** TypeScript یا JavaScript در صورت پشتیبانی (Angular فقط TypeScript).
- **استایل:** Tailwind CSS نسخهٔ ۴، CSS Modules یا CSS ساده (بسته به فریم‌ورک).
- **ابزارها:** ESLint و Prettier اختیاری با تنظیمات مخصوص هر فریم‌ورک.
- **Git:** مقداردهی مخزن و کامیت اولیه، یا انصراف.
- **مدیر بسته:** pnpm، npm، yarn و bun.
- **پریست‌ها:** نقطه شروع‌های Blog، Dashboard و Landing page با گزینه‌های رایج.

### ✅ قالب‌های کامل و متناسب با فریم‌ورک

Tailwind فقط به‌عنوان import ساده اضافه نمی‌شود؛ برای ابزارهای همان فریم‌ورک پیکربندی می‌شود (پلاگین Vite، PostCSS یا یکپارچه‌سازی مخصوص فریم‌ورک). قالب‌های ESLint و Prettier هم پلاگین‌ها و نوع فایل‌های فریم‌ورک را در نظر می‌گیرند.

### 🛡️ تولید امن و قابل پیش‌بینی

- پوشه‌های موجود بی‌صدا بازنویسی نمی‌شوند؛ `--force` صریح است.
- `--dry-run` فایل‌های تولیدی را بدون نوشتن پیش‌نمایش می‌دهد.
- قالب‌ها محلی باندل شده‌اند؛ خود تولید به اتصال شبکه نیاز ندارد.
- اگر نصب وابستگی‌ها بعد از تولید شکست بخورد، فایل‌های پروژه برای نصب دستی باقی می‌مانند.
- در حالت غیرتعاملی، نصب غیرمنتظرهٔ پکیج‌ها انجام نمی‌شود.

### 🌍 چندسکویی

طراحی‌شده برای **Windows، macOS و Linux**. CI هر سه سیستم‌عامل را روی نسخه‌های پشتیبانی‌شدهٔ Node.js بررسی می‌کند.

</div>

---

## 🧰 فریم‌ورک‌های پشتیبانی‌شده

<div dir="rtl">

| فریم‌ورک | ابزار | زبان‌ها | گزینه‌های استایل |
| --- | --- | --- | --- |
| React | Vite | TypeScript، JavaScript | Tailwind v4، CSS Modules، CSS ساده |
| Next.js | App Router | TypeScript، JavaScript | Tailwind v4، CSS Modules، CSS ساده |
| Vue 3 | Vite | TypeScript، JavaScript | Tailwind v4، CSS Modules، CSS ساده |
| Svelte 5 | Vite | TypeScript، JavaScript | Tailwind v4، CSS ساده |
| SolidJS | Vite | TypeScript، JavaScript | Tailwind v4، CSS ساده |
| Qwik | Qwik City (Vite) | TypeScript، JavaScript | Tailwind v4، CSS ساده |
| Astro | Astro (Vite) | TypeScript، JavaScript | Tailwind v4، CSS ساده |
| Angular | `@angular/build` | TypeScript | Tailwind v4، CSS Modules، CSS ساده |

**نکته‌های قالب:**

- قالب‌های Angular از TypeScript و zoneless change detection استفاده می‌کنند.
- Qwik در حال حاضر از Vite 7 استفاده می‌کند تا با محدودهٔ peer پلاگین هماهنگ باشد.
- Astro در حال حاضر از خط Astro 5 استفاده می‌کند.
- قالب‌های React از React 19 استفاده می‌کنند. قالب‌های Svelte از runes نسخهٔ ۵ استفاده می‌کنند و پروژه‌های TypeScript شامل `svelte-check` هستند.
- پیکربندی Tailwind v4 برای ابزار متناظر (Vite، Next.js، Astro، Angular) تولید می‌شود.

</div>

---

## 🏗️ معماری

<div dir="rtl">

### پشتهٔ فنی (CLI)

| لایه | فناوری |
| --- | --- |
| **زبان** | TypeScript 5 (strict) |
| **CLI** | Commander |
| **پرامپت‌ها** | `@clack/prompts` |
| **اعتبارسنجی** | Zod |
| **اجرای فرایند** | execa |
| **استایل خروجی** | picocolors |
| **بیلد** | tsup |
| **تست** | Vitest |

### روند کار

</div>

```text
CLI and prompts
      ↓
Configuration and validation
      ↓
Template resolver (configuration → file map)
      ↓
Sandboxed generator (writes within the target directory)
      ↓
Optional post-generation tasks (dependency install, Git)
      ↓
Summary and next steps
```

### ساختار پروژه

```text
src/
├── index.ts              # سیم‌کشی CLI و نمایش خطا
├── types.ts              # تایپ‌های دامنه و کدهای خروج
├── commands/             # create, doctor, init, templates
├── config/               # کانفیگ سراسری و پیکربندی پروژه
├── prompts/              # جریان تعاملی راه‌اندازی
├── services/             # بررسی محیط، مدیر بسته، Git
├── templates/            # رجیستری فریم‌ورک، قطعات قالب، overlayها
├── generator/             # نویسندهٔ فایل sandboxed
└── utils/                # مسیرها، اجرا، لاگ، خطا، اعتبارسنجی
```

<div dir="rtl">

قالب‌های تولید پروژه shell اجرا نمی‌کنند و به شبکه دسترسی ندارند. فقط اقدامات اختیاری بعد از تولید (نصب وابستگی‌ها، Git) به ابزار خارجی یا اتصال نیاز دارند. ژنراتور مسیرهای خروجی را بررسی می‌کند تا نوشتن فقط داخل پوشهٔ پروژه انجام شود.

</div>

---

## 🚀 شروع سریع

<div dir="rtl">

### پیش‌نیازها

- **Node.js نسخهٔ 20.19 یا بالاتر**
- یکی از مدیرهای بسته در صورت تمایل به نصب خودکار وابستگی‌ها: **pnpm، npm، yarn** یا **bun**

### نصب سراسری

</div>

```bash
npm install -g frontend-starter-cli
```

<div dir="rtl">شروع جریان تعاملی:</div>

```bash
frontend-starter
```

### اجرا بدون نصب سراسری

```bash
npx frontend-starter-cli
```

### ساخت پروژه

```bash
# ساخت تعاملی پروژه
frontend-starter create

# گزینه‌های صریح
frontend-starter create my-app \
  --framework react \
  --typescript \
  --tailwind \
  --package-manager pnpm

# شروع با پریست
frontend-starter create my-blog --preset blog

# پیش‌نمایش قبل از ساخت فایل‌ها
frontend-starter create my-app \
  --framework next \
  --typescript \
  --tailwind \
  --dry-run
```

<div dir="rtl">

جریان تعاملی می‌تواند با **Blog**، **Dashboard**، **Landing page** یا **Custom** شروع شود و سپس شما را در انتخاب فریم‌ورک و گزینه‌های پروژه راهنمایی می‌کند.

</div>

---

## ⚙️ دستورات

<div dir="rtl">

| دستور | توضیح |
| --- | --- |
| `frontend-starter` | شروع جریان تعاملی ساخت پروژه. |
| `frontend-starter create [name]` | ساخت پروژه با پرامپت یا گزینه‌های صریح. |
| `frontend-starter init` | ذخیرهٔ پیش‌فرض‌های شخصی در کانفیگ سراسری. |
| `frontend-starter templates` | نمایش فریم‌ورک‌ها، پریست‌ها و گزینه‌ها (`list` هم معادل است). |
| `frontend-starter doctor` | بررسی محیط و ابزارهای در دسترس. |
| `frontend-starter --version` | نمایش نسخهٔ نصب‌شده. |
| `frontend-starter --help` | نمایش راهنما. |

فلگ‌های خروجی سراسری:

- `--verbose` — نمایش جزئیات بیشتر.
- `--quiet` — حذف خروجی اطلاع‌رسانی.

### گزینه‌های `create`

| گزینه | مقدار / رفتار |
| --- | --- |
| `--preset` | `blog`، `dashboard` یا `landing-page`. |
| `--framework` | `react`، `next`، `vue`، `svelte`، `solid`، `qwik`، `astro` یا `angular`. |
| `--language` | `typescript` یا `javascript` (در صورت پشتیبانی). |
| `--typescript`, `--javascript` | میان‌بر برای `--language`. |
| `--styling` | `tailwind`، `css-modules` یا `plain` (در صورت پشتیبانی). |
| `--tailwind` | میان‌بر برای `--styling tailwind`. |
| `--package-manager` | `pnpm`، `npm`، `yarn` یا `bun`؛ مدیر انتخابی باید نصب باشد. |
| `--eslint`, `--no-eslint` | فعال/غیرفعال کردن ESLint (پیش‌فرض: فعال). |
| `--prettier`, `--no-prettier` | فعال/غیرفعال کردن Prettier (پیش‌فرض: فعال). |
| `--git`, `--no-git` | مقداردهی Git یا انصراف (پیش‌فرض: فعال). |
| `--install`, `--no-install` | نصب وابستگی‌ها یا انصراف. |
| `--force` | افزودن فایل‌های قالب به پوشهٔ غیرخالی موجود. |
| `--dry-run` | پیش‌نمایش درخت فایل و `package.json` بدون نوشتن. |
| `--yes` | اجرا بدون پرامپت؛ گزینه‌های لازم باید با فلگ یا کانفیگ مشخص شوند. |

### استفادهٔ غیرتعاملی

با `--yes` (یا در ترمینال غیرتعاملی) چهار انتخاب اصلی را بدهید: فریم‌ورک، زبان، استایل و مدیر بسته. ESLint، Prettier و Git پیش‌فرض **فعال** هستند. نصب وابستگی‌ها در حالت غیرتعاملی پیش‌فرض **غیرفعال** است تا درخواست شبکهٔ غیرمنتظره رخ ندهد.

</div>

```bash
frontend-starter create my-app \
  --framework vue \
  --typescript \
  --tailwind \
  --package-manager npm \
  --yes
```

<div dir="rtl">

### پریست‌ها و اولویت گزینه‌ها

پریست‌ها فریم‌ورک، زبان، استایل و ابزارهای جانبی را بسته‌بندی می‌کنند؛ مدیر بسته وابسته به ماشین است و جداگانه تشخیص/انتخاب می‌شود.

اولویت وقتی یک گزینه در چند جا مشخص شده باشد:

**flags > preset > global config > prompts > defaults**

</div>

---

## 📦 مدیرهای بسته

<div dir="rtl">

مدیرهای پشتیبانی‌شده: **pnpm**، **npm**، **yarn** و **bun**. CLI گزینه‌های نصب‌شده را تشخیص می‌دهد و از ترتیب تشخیص قابل تنظیم استفاده می‌کند (پیش‌فرض: `pnpm`، `npm`، `yarn`، `bun`).

اگر مدیر بستهٔ درخواستی نصب نباشد، خطای قابل اقدام نمایش داده می‌شود. CLI مدیر بسته را برای شما نصب نمی‌کند.

</div>

---

## 🔧 پیکربندی

<div dir="rtl">

با `frontend-starter init` پیش‌فرض‌ها را ذخیره کنید. کانفیگ در مسیر مخصوص هر سیستم‌عامل ذخیره می‌شود:

- **Windows:** `%APPDATA%\frontend-starter\config.json`
- **macOS:** `~/Library/Preferences/frontend-starter/config.json`
- **Linux:** `$XDG_CONFIG_HOME/frontend-starter/config.json` (یا `~/.config/frontend-starter/config.json`)

فایل کانفیگ می‌تواند در `~/.frontend-starter/config.json` هم باشد. با `FRONTEND_STARTER_CONFIG_DIR` می‌توانید مسیر کانفیگ را تغییر دهید (مفید برای تست/محیط ایزوله). کانفیگ برای ترجیحات پروژه است و برای نگهداری secret طراحی نشده است.

</div>

```json
{
  "packageManager": "pnpm",
  "framework": "react",
  "language": "typescript",
  "styling": "tailwind",
  "eslint": true,
  "prettier": true,
  "git": true,
  "install": true,
  "detectionOrder": ["pnpm", "npm", "yarn", "bun"]
}
```

---

## 🛠️ توسعه

<div dir="rtl">

### راه‌اندازی محلی

</div>

```bash
git clone https://github.com/mohammadhossein-asadi/frontend-starter-cli.git
cd frontend-starter-cli
npm install
```

### اسکریپت‌ها

```bash
npm run dev          # بیلد در حالت watch
npm run build        # ساخت dist/
npm test             # تست‌های واحد و یکپارچه
npm run test:watch   # تست در حالت watch
npm run coverage     # پوشش تست
npm run lint         # ESLint
npm run typecheck    # بررسی TypeScript
npm run format       # فرمت با Prettier
npm run format:check # بررسی فرمت
```

<div dir="rtl">

تست‌های یکپارچه CLI بیلدشده را از `bin/` و `dist/` اجرا می‌کنند؛ بعد از تغییر سورس، قبل از اتکا به آن‌ها `npm run build` را اجرا کنید.

### چه چیزهایی تست می‌شود

- اعتبارسنجی نام/ورودی، اولویت کانفیگ، پریست‌ها و ترکیب قالب‌ها.
- ترکیب‌های فریم‌ورک، زبان و استایل.
- تولید end-to-end، رفتار dry-run، ایمنی پوشهٔ موجود، مقداردهی Git و کدهای خروج.
- قالب‌های تولیدشده در CI شامل install، lint و build تولید.

CI روی **Ubuntu، Windows و macOS** با **Node.js 20، 22 و 24** اجرا می‌شود. یک گردش‌کار زمان‌بندی‌شده هم پروژه‌های تولیدشده را در برابر تغییرات بالادستی وابستگی‌ها بررسی می‌کند.

</div>

---

## 🚨 رفع اشکال

<div dir="rtl">

### مدیر بسته پیدا نشد

مدیر بستهٔ انتخابی نصب نیست. آن را نصب کنید یا یک گزینهٔ در دسترس انتخاب کنید:

</div>

```bash
frontend-starter create my-app --package-manager npm
```

<div dir="rtl">

### پوشهٔ مقصد از قبل وجود دارد

CLI از بازنویسی بی‌صدا جلوگیری می‌کند. نام دیگری انتخاب کنید یا اگر عمداً می‌خواهید فایل‌ها را به پوشهٔ غیرخالی اضافه کنید از `--force` استفاده کنید.

### نصب وابستگی‌ها شکست خورد

فایل‌های پروژه ساخته شده‌اند. به‌صورت دستی نصب کنید:

</div>

```bash
cd my-app
pnpm install
```

<div dir="rtl">

### Git نتوانست کامیت اولیه بسازد

هویت Git را تنظیم و دوباره تلاش کنید:

</div>

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

<div dir="rtl">

### بررسی محیط

</div>

```bash
frontend-starter doctor --verbose
```

---

## 📚 مستندات

<div dir="rtl">

| سند | توضیح |
| --- | --- |
| [راهنمای مشارکت](CONTRIBUTING.md) | معماری، روند توسعه، افزودن فریم‌ورک/overlay |
| [تغییرات](CHANGELOG.md) | تاریخچهٔ انتشار و تغییرات مهم |
| [Issues](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues) | گزارش باگ و درخواست ویژگی |
| [Discussions](https://github.com/mohammadhossein-asadi/frontend-starter-cli/discussions) | پرسش و گفت‌وگوی جامعه |

</div>

---

## 📤 انتشار

<div dir="rtl">

انتشارها از طریق گردش‌کار release مخزن خودکار هستند. برای انتشار دستی:

</div>

```bash
npm run build
npm publish
```

---

## 🤝 مشارکت

<div dir="rtl">

مشارکت‌ها خوش‌آمد هستند — قالب‌های فریم‌ورک، پریست‌ها، بهبود پرامپت‌ها، مستندات و رفع باگ.

1. [راهنمای مشارکت](CONTRIBUTING.md) را بخوانید.
2. برای `good first issue`، طبق دستور issue قبل از شروع آن را claim کنید.
3. در صورت نیاز PR پیش‌نویس را زود باز کنید و تست برای رفتار جدید اضافه کنید.
4. اگر قالب‌ها را تغییر دادید، بررسی کنید پروژهٔ تولیدشده install، lint و build می‌شود.

</div>

---

## 📋 نقشهٔ راه

<div dir="rtl">

- [x] ۸ ژنراتور فریم‌ورک (React، Next.js، Vue، Svelte، SolidJS، Qwik، Astro، Angular)
- [x] TypeScript/JavaScript، Tailwind v4، ESLint، Prettier، Git
- [x] پریست‌ها (blog، dashboard، landing-page)
- [x] `--dry-run`، `--force`، کانفیگ سراسری، `doctor`
- [x] CI چندسکویی (Ubuntu، Windows، macOS)
- [ ] پریست‌ها و گونه‌های قالب بیشتر
- [ ] یکپارچه‌سازی‌های بیشتر استایل/ابزار (بر اساس درخواست)
- [ ] overlayهای فریم‌ورک مشارکتی جامعه

</div>

---

## 📄 مجوز

<div dir="rtl">

**مجوز MIT** — فایل [LICENSE](LICENSE) را ببینید.

</div>

---

## 🙏 قدردانی

<div dir="rtl">

- **Commander**، **@clack/prompts**، **Zod**، **execa**، **picocolors** — پایه‌های CLI
- **tsup**، **Vitest**، **TypeScript**، **ESLint**، **Prettier** — بیلد و کیفیت
- اکوسیستم‌های **React، Next.js، Vue، Svelte، SolidJS، Qwik، Astro، Angular، Vite، Tailwind CSS**

</div>

---

<div align="center" dir="rtl">

**پروژهٔ فرانت‌اند بعدی‌تان را با راه‌اندازی کمتر و شتاب بیشتر بسازید.**

[🇬🇧 English](README.md) • [🇮🇷 فارسی](README.fa.md) • [⭐ ستاره در GitHub](https://github.com/mohammadhossein-asadi/frontend-starter-cli) • [📦 مشاهده در npm](https://www.npmjs.com/package/frontend-starter-cli) • [🐛 گزارش مشکل](https://github.com/mohammadhossein-asadi/frontend-starter-cli/issues)

</div>
