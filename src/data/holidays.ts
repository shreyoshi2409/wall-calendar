export interface Holiday {
  date: string; // MM-DD
  name: string;
  type?: "national" | "religious" | "international";
}

export const holidays: Holiday[] = [
  // January
  { date: "01-01", name: "New Year's Day", type: "international" },
  { date: "01-14", name: "Makar Sankranti / Pongal", type: "religious" },
  { date: "01-26", name: "Republic Day 🇮🇳", type: "national" },

  // February
  { date: "02-14", name: "Valentine's Day", type: "international" },
  { date: "02-17", name: "Maha Shivaratri", type: "religious" },

  // March
  { date: "03-03", name: "Holika Dahan", type: "religious" },
  { date: "03-04", name: "Holi 🎨", type: "religious" },
  { date: "03-08", name: "International Women's Day", type: "international" },
  { date: "03-19", name: "Ugadi / Gudi Padwa", type: "religious" },
  { date: "03-26", name: "Ram Navami 🙏", type: "religious" },
  { date: "03-31", name: "Eid-ul-Fitr ☪️", type: "religious" },

  // April
  { date: "04-01", name: "April Fools' Day", type: "international" },
  { date: "04-02", name: "Hanuman Jayanti", type: "religious" },
  { date: "04-03", name: "Good Friday", type: "religious" },
  { date: "04-05", name: "Easter Sunday", type: "religious" },
  { date: "04-14", name: "Ambedkar Jayanti / Baisakhi / Tamil New Year", type: "national" },

  // May
  { date: "05-01", name: "May Day / Labour Day", type: "international" },
  { date: "05-08", name: "Narasimha Jayanti", type: "religious" },
  { date: "05-11", name: "Mother's Day", type: "international" },

  // June
  { date: "06-07", name: "Eid-ul-Adha ☪️", type: "religious" },
  { date: "06-15", name: "Father's Day", type: "international" },
  { date: "06-21", name: "International Yoga Day", type: "international" },
  { date: "06-26", name: "Ganga Dussehra", type: "religious" },

  // July
  { date: "07-21", name: "Guru Purnima", type: "religious" },

  // August
  { date: "08-08", name: "Raksha Bandhan", type: "religious" },
  { date: "08-15", name: "Independence Day 🇮🇳 / Janmashtami 🦚", type: "national" },

  // September
  { date: "09-05", name: "Teachers' Day", type: "national" },
  { date: "09-12", name: "Ganesh Chaturthi", type: "religious" },
  { date: "09-21", name: "International Peace Day", type: "international" },
  { date: "09-24", name: "Pitru Paksha Begins", type: "religious" },

  // October
  { date: "10-02", name: "Gandhi Jayanti 🇮🇳", type: "national" },
  { date: "10-08", name: "Navratri Begins", type: "religious" },
  { date: "10-17", name: "Dussehra / Vijayadashami", type: "religious" },
  { date: "10-26", name: "Diwali 🪔", type: "religious" },
  { date: "10-31", name: "Halloween", type: "international" },

  // November
  { date: "11-14", name: "Children's Day 🇮🇳", type: "national" },
  { date: "11-21", name: "Tulsi Vivah", type: "religious" },
  { date: "11-29", name: "Karthigai Deepam / Guru Nanak Jayanti", type: "religious" },

  // December
  { date: "12-21", name: "Vaikunta Ekadasi", type: "religious" },
  { date: "12-25", name: "Christmas Day 🎄", type: "international" },
  { date: "12-31", name: "New Year's Eve", type: "international" },
];

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  const key = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return holidays.find((h) => h.date === key);
}