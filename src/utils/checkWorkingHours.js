/**
 * Fetches the availability schedule and checks whether the current
 * local time falls within a working window.
 *
 * Returns: { available: boolean, message: string }
 *
 * TODO: Replace DUMMY_SCHEDULE and the resolver below with a real API call:
 *   const { data } = await api.get("/admin/settings");
 *   const schedule = data.availability_hours;
 */

// ─────────────────────────────────────────────────────────────────────────────
// DEV TOGGLE — flip to false and uncomment the API call when endpoint is ready
// ─────────────────────────────────────────────────────────────────────────────
const USING_DUMMY_SCHEDULE = true;

const DUMMY_SCHEDULE = [
  { day: "Monday", enabled: true, open: "09:00 AM", close: "09:00 PM" },
  { day: "Tuesday", enabled: true, open: "09:00 AM", close: "09:00 PM" },
  { day: "Wednesday", enabled: true, open: "09:00 AM", close: "09:00 PM" },
  { day: "Thursday", enabled: true, open: "09:00 AM", close: "09:00 PM" },
  { day: "Friday", enabled: true, open: "09:00 AM", close: "11:00 PM" },
  { day: "Saturday", enabled: false, open: "10:00 AM", close: "11:00 PM" },
  { day: "Sunday", enabled: false, open: null, close: null },
];
// ─────────────────────────────────────────────────────────────────────────────

export const checkWorkingHourAvailability = async () => {
  try {
    let schedule;

    if (USING_DUMMY_SCHEDULE) {
      await new Promise((res) => setTimeout(res, 300)); // simulate network
      schedule = DUMMY_SCHEDULE;
    } else {
      const { data } = await api.get("/admin/settings");
      schedule = data.availability_hours;
    }

    if (!schedule || schedule.length === 0) {
      return { available: true, message: "" };
    }

    const now = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = dayNames[now.getDay()];
    const todaySchedule = schedule.find((d) => d.day === todayName);

    if (!todaySchedule || !todaySchedule.enabled) {
      return {
        available: false,
        message: `Sorry, we are closed today (${todayName}). Please check back on an operating day.`,
        schedule,
      };
    }

    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const openTime = parseTime(todaySchedule.open);
    const closeTime = parseTime(todaySchedule.close);

    if (now < openTime) {
      return {
        available: false,
        message: `We're not open yet. Orders open at ${todaySchedule.open} today.`,
        schedule,
      };
    }

    if (now > closeTime) {
      return {
        available: false,
        message: `We've closed for today. Orders closed at ${todaySchedule.close}. See you tomorrow!`,
        schedule,
      };
    }

    return { available: true, message: "", schedule };
  } catch (err) {
    console.error("Working hours check failed:", err);
    return { available: true, message: "", schedule: [] }; // fail open
  }
};
