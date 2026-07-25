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
    title: "Selling on AgriVerse",
    items: [
      {
        question: "What kind of data can I sell?",
        answer:
          "Soil metrics, yield records, sensor readings, pest/disease logs, and similar farm data. Anything with clear provenance and a defined sampling method tends to sell better.",
      },
      {
        question: "How is my data stored?",
        answer:
          "Your file is encrypted before it leaves your device. Right now it's stored securely on our servers; once the decentralized storage layer is live, it will move to encrypted storage on IPFS/Filecoin instead.",
      },
      {
        question: "Can I edit or remove a listing after publishing?",
        answer:
          "You can edit or withdraw a listing any time before it's sold. Once a buyer has purchased it, the listing becomes read-only so the transaction record stays accurate.",
      },
    ],
  },
  {
    title: "Licensing terms explained",
    items: [
      {
        question: "What's the difference between license types?",
        answer:
          "One-time download gives the buyer a single export of the data. Time-limited access expires after a set period. Research-only restricts use to non-commercial research, which you can note in your listing description.",
      },
      {
        question: "Can a buyer resell my data?",
        answer:
          "No — license terms apply only to the buyer who purchased them. Resale or redistribution outside the agreed terms is a violation you can report through a dispute.",
      },
    ],
  },
  {
    title: "Payouts",
    items: [
      {
        question: "When do I get paid after a sale?",
        answer:
          "Once a transaction moves to \"released\" status on the Sales page, the amount is added to your available balance, which you can withdraw from the Payouts page.",
      },
      {
        question: "How long does a payout take?",
        answer:
          "Bank transfers and mobile money payouts are typically processed within a few business days once requested.",
      },
    ],
  },
  {
    title: "Disputes",
    items: [
      {
        question: "What happens if a buyer disputes my data?",
        answer:
          "The transaction is flagged and payout is paused until it's resolved. You'll be able to respond with context from the Transactions page, and our team reviews the evidence from both sides.",
      },
    ],
  },
];