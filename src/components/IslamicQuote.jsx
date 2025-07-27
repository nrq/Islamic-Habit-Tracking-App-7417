import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBookOpen, FiRefreshCw } = FiIcons;

function IslamicQuote() {
  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      text: "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.",
      reference: "Quran 65:3",
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ"
    },
    {
      text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
      reference: "Quran 2:152",
      arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ"
    },
    {
      text: "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth.",
      reference: "Quran 6:73",
      arabic: "وَهُوَ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ بِالْحَقِّ"
    },
    {
      text: "And whoever does righteous deeds, whether male or female, while being a believer - those will enter Paradise.",
      reference: "Quran 4:124",
      arabic: "وَمَن يَعْمَلْ مِنَ الصَّالِحَاتِ مِن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ"
    },
    {
      text: "The believers in their mutual kindness, compassion, and sympathy are just one body.",
      reference: "Hadith - Bukhari",
      arabic: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  return (
    <motion.div
      key={currentQuote}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <SafeIcon icon={FiBookOpen} className="text-2xl text-emerald-100" />
        <button
          onClick={nextQuote}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="text-lg" />
        </button>
      </div>
      
      <div className="space-y-3">
        <p className="text-right text-lg font-arabic leading-relaxed text-emerald-50">
          {quotes[currentQuote].arabic}
        </p>
        <p className="text-lg leading-relaxed">
          "{quotes[currentQuote].text}"
        </p>
        <p className="text-emerald-100 text-sm font-semibold">
          - {quotes[currentQuote].reference}
        </p>
      </div>
    </motion.div>
  );
}

export default IslamicQuote;