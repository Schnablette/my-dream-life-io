# MyDreamLife.io

**Live at:** [MyDreamLife.io](https://mydreamlife.io)

## Overview

MyDreamLife.io is a lifestyle salary calculator that helps you determine exactly how much money you need to earn to live your dream life. Instead of restricting your lifestyle to fit a budget, this tool calculates the salary required to support your desired lifestyle — because "Budget? I don't even know it!"

## Features

- 💰 **Lifestyle Calculator**: Add and manage all your lifestyle expenses with customizable frequencies (daily, weekly, monthly, yearly)
- 📊 **Automatic Salary Calculation**: Instantly see the annual and monthly salary needed based on your expenses, tax rate, and savings goals
- ⚙️ **Customizable Rates**: Adjust tax and savings rates to match your financial situation
- 📸 **Export Results**: Download your calculator results as a high-quality image to share or save
- ✏️ **Edit & Update**: Easily edit or delete expenses as your lifestyle changes
- 🎨 **Modern UI**: Clean, beautiful interface built with Radix UI and Tailwind CSS

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with TypeScript
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with custom styling
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Image Export**: html-to-image
- **Theming**: next-themes for dark/light mode
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/my-dream-life-io.git

# Navigate to project directory
cd my-dream-life-io

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## How It Works

The calculator uses a simple formula to determine your required salary:

```
Required Salary = Total Annual Expenses / ((1 - Tax Rate) × (1 - Savings Rate))
```

1. Add your expenses with their frequency (daily, weekly, monthly, or yearly)
2. Set your expected tax rate percentage
3. Set your desired savings rate percentage
4. The calculator automatically shows your required annual and monthly salary

## Project Structure

```
my-dream-life-io/
├── components/
│   ├── calculator/          # Calculator component modules
│   │   ├── Calculator.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── SalaryResults.tsx
│   │   └── RatesSettings.tsx
│   └── ui/                  # Reusable UI components
├── src/
│   ├── pages/               # Next.js pages
│   └── styles/              # Global styles
└── public/                  # Static assets
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is private and proprietary.

---

Built with 💸 by the MyDreamLife.io team

