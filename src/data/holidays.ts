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
  { date: "02-19", name: "Shivaji Jayanti", type: "national" },
  { date: "02-26", name: "Maha Shivaratri", type: "religious" },

  // March
  { date: "03-08", name: "International Women's Day", type: "international" },
  { date: "03-14", name: "Holi 🎨", type: "religious" },
  { date: "03-17", name: "St. Patrick's Day", type: "international" },
  { date: "03-31", name: "Eid-ul-Fitr", type: "religious" },

  // April
  { date: "04-01", name: "Bank Holiday / April Fools", type: "international" },
  { date: "04-06", name: "Ugadi / Gudi Padwa", type: "religious" },
  { date: "04-10", name: "Ram Navami", type: "religious" },
  { date: "04-13", name: "Baisakhi", type: "religious" },
  { date: "04-14", name: "Ambedkar Jayanti", type: "national" },
  { date: "04-18", name: "Good Friday", type: "religious" },
  { date: "04-20", name: "Easter Sunday", type: "religious" },

  // May
  { date: "05-01", name: "May Day / Labour Day", type: "international" },
  { date: "05-12", name: "Buddha Purnima", type: "religious" },
  { date: "05-11", name: "Mother's Day", type: "international" },

  // June
  { date: "06-07", name: "Eid-ul-Adha", type: "religious" },
  { date: "06-15", name: "Father's Day", type: "international" },
  { date: "06-21", name: "International Yoga Day", type: "international" },

  // July
  { date: "07-06", name: "Muharram", type: "religious" },
  { date: "07-17", name: "Guru Purnima", type: "religious" },

  // August
  { date: "08-15", name: "Independence Day 🇮🇳", type: "national" },
  { date: "08-16", name: "Raksha Bandhan", type: "religious" },
  { date: "08-26", name: "Janmashtami", type: "religious" },

  // September
  { date: "09-05", name: "Teachers' Day", type: "national" },
  { date: "09-07", name: "Ganesh Chaturthi", type: "religious" },
  { date: "09-15", name: "Milad-un-Nabi", type: "religious" },
  { date: "09-21", name: "International Peace Day", type: "international" },

  // October
  { date: "10-02", name: "Gandhi Jayanti 🇮🇳", type: "national" },
  { date: "10-02", name: "Navratri Begins", type: "religious" },
  { date: "10-12", name: "Dussehra / Vijayadashami", type: "religious" },
  { date: "10-20", name: "Diwali 🪔", type: "religious" },
  { date: "10-22", name: "Govardhan Puja", type: "religious" },
  { date: "10-23", name: "Bhai Dooj", type: "religious" },
  { date: "10-31", name: "Halloween", type: "international" },

  // November
  { date: "11-01", name: "Chhath Puja", type: "religious" },
  { date: "11-14", name: "Children's Day 🇮🇳", type: "national" },
  { date: "11-15", name: "Guru Nanak Jayanti", type: "religious" },
  { date: "11-27", name: "Thanksgiving (US)", type: "international" },

  // December
  { date: "12-25", name: "Christmas Day 🎄", type: "international" },
  { date: "12-31", name: "New Year's Eve", type: "international" },
];

export function getHolidayForDate(month: number, day: number): Holiday | undefined {
  const key = `${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return holidays.find((h) => h.date === key);
}
