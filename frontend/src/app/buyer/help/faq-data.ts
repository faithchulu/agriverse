export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    title: "Buying on AgriVerse",
    items: [
      {
        question: "Can I preview a dataset before buying it?",
        answer:
          "Listings show summary metadata - crop type, region, sample date range, and sampling method - so you can judge fit before purchasing. Full raw data is only released after payment.",
      },
      {
        question: "When am I charged for a purchase?",
        answer:
          "Payment is taken when you click Buy. It's held until the transaction moves to \"released\" status, at which point the seller is paid and your access is confirmed.",
      },
      {
        question: "Can I buy a dataset for someone else on my team?",
        answer:
          "Not directly yet - each purchase is tied to your account. For now, share exported data with teammates according to the license terms you purchased.",
      },
    ],
  },
  {
    title: "Licensing terms explained",
    items: [
      {
        question: "What's the difference between license types?",
        answer:
          "One-time download gives you a single export of the data. Time-limited access expires after a set period, shown as a countdown on your Active Licenses page. Research-only restricts use to non-commercial research.",
      },
      {
        question: "What happens when a time-limited license expires?",
        answer:
          "Access is revoked automatically. You can request a renewal from the Active Licenses page, which notifies the seller of your interest in extending access.",
      },
    ],
  },
  {
    title: "Payments & refunds",
    items: [
      {
        question: "Can I get a refund?",
        answer:
          "If a dataset doesn't match its listing description, raise a dispute from the Transactions page. Refunds are issued once a dispute is resolved in your favor.",
      },
      {
        question: "How long do refunds take?",
        answer:
          "Once approved, refunds typically post back to your original payment method within a few business days.",
      },
    ],
  },
  {
    title: "Disputes",
    items: [
      {
        question: "How do I raise a dispute?",
        answer:
          "From the Transactions page, use the dispute action on any paid or released transaction and describe the issue. This pauses payout to the seller until it's reviewed.",
      },
    ],
  },
];