import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiStar, FiBookOpen, FiSun, FiRefreshCw } = FiIcons;

function MotivationPage() {
  const [currentSection, setCurrentSection] = useState('quotes');

  const islamicQuotes = [
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
      text: "And whoever does righteous deeds, whether male or female, while being a believer - those will enter Paradise.",
      reference: "Quran 4:124",
      arabic: "وَمَن يَعْمَلْ مِنَ الصَّالِحَاتِ مِن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ"
    }
  ];

  const motivationalMessages = [
    {
      title: "You're Building Paradise",
      message: "Every good deed you do is like planting a tree in Paradise. Your consistent habits are creating a beautiful garden for your afterlife.",
      icon: FiStar
    },
    {
      title: "Small Steps, Big Rewards",
      message: "The Prophet (PBUH) said: 'The most beloved deeds to Allah are those done consistently, even if they are small.' Keep going!",
      icon: FiHeart
    },
    {
      title: "Allah Sees Your Efforts",
      message: "Even when no one else notices, Allah sees every effort you make to better yourself. He is proud of your dedication.",
      icon: FiSun
    }
  ];

  const dua = [
    {
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fi'd-dunya hasanatan wa fi'l-akhirati hasanatan wa qina 'adhab an-nar",
      translation: "Our Lord, give us good in this world and good in the next world, and save us from the punishment of the Fire."
    },
    {
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      transliteration: "Rabbi ishrah li sadri wa yassir li amri",
      translation: "My Lord, expand for me my breast and ease for me my task."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-6"
      >
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">Motivation & Inspiration</h1>
        <p className="text-emerald-600">Find strength and encouragement in Islamic teachings</p>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex justify-center space-x-2 bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-emerald-100">
        {[
          { key: 'quotes', label: 'Quotes', icon: FiBookOpen },
          { key: 'motivation', label: 'Motivation', icon: FiHeart },
          { key: 'dua', label: 'Du\'a', icon: FiStar }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentSection(tab.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
              currentSection === tab.key
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <SafeIcon icon={tab.icon} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Islamic Quotes Section */}
      {currentSection === 'quotes' && (
        <div className="space-y-4">
          {islamicQuotes.map((quote, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="space-y-4">
                <p className="text-right text-lg font-arabic leading-relaxed text-emerald-50">
                  {quote.arabic}
                </p>
                <p className="text-lg leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-emerald-100 text-sm font-semibold text-right">
                  - {quote.reference}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Motivational Messages Section */}
      {currentSection === 'motivation' && (
        <div className="space-y-4">
          {motivationalMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <SafeIcon icon={msg.icon} className="text-2xl text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                    {msg.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Encouragement Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl p-6 text-white shadow-lg text-center"
          >
            <SafeIcon icon={FiHeart} className="text-4xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">You're Doing Amazing!</h3>
            <p className="text-lg leading-relaxed">
              Every step you take towards becoming a better Muslim is a victory. 
              Allah loves consistency, and you're showing beautiful dedication. 
              Keep going, and may Allah bless your efforts! 🤲
            </p>
          </motion.div>
        </div>
      )}

      {/* Du'a Section */}
      {currentSection === 'dua' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-emerald-800 mb-2">Du'a for Success</h2>
            <p className="text-emerald-600">Supplications to help you in your journey</p>
          </div>

          {dua.map((prayer, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.3 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100"
            >
              <div className="space-y-4">
                <p className="text-right text-xl font-arabic leading-relaxed text-emerald-800">
                  {prayer.arabic}
                </p>
                <p className="text-emerald-600 italic text-center">
                  {prayer.transliteration}
                </p>
                <p className="text-gray-700 text-center leading-relaxed">
                  "{prayer.translation}"
                </p>
              </div>
            </motion.div>
          ))}

          {/* Prayer Reminder */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg text-center"
          >
            <SafeIcon icon={FiStar} className="text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Make Du'a Regularly</h3>
            <p className="leading-relaxed">
              Remember to make du'a throughout your day. Allah loves to hear from His servants, 
              and du'a is a powerful tool for spiritual growth and success in both worlds.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default MotivationPage;