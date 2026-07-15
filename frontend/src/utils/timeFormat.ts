/**
 * 将日期字符串解析为 Date 对象。
 * 支持 ISO 字符串、中文格式、服务端 "MM/DD HH:MM"、本地 "HH:MM" 等格式。
 *
 * 注意：必须先匹配已知格式，再用 new Date() 兜底。
 * V8 会把 "09/09 09:46" 解析为 2001-09-09（无年份默认 2001），
 * 所以 MM/DD 和 MM-DD 格式必须在 new Date() 之前拦下来。
 */
function parseDateInput(input: string): Date | null {
  if (!input) return null;

  const now = new Date();
  const trimmed = input.trim();

  // "今天 HH:mm"
  const todayMatch = trimmed.match(/今天\s*(\d{1,2}):(\d{2})/);
  if (todayMatch) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), +todayMatch[1], +todayMatch[2]);
  }

  // "昨天 HH:mm"
  const yesterdayMatch = trimmed.match(/昨天\s*(\d{1,2}):(\d{2})/);
  if (yesterdayMatch) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), +yesterdayMatch[1], +yesterdayMatch[2]);
  }

  // "HH:MM"（仅时间，视为今天）
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    const [h, m] = trimmed.split(":").map(Number);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  }

  // "MM/DD HH:MM"（斜杠，服务端 formatSessionTime 产出）
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (slashMatch) {
    return new Date(now.getFullYear(), +slashMatch[1] - 1, +slashMatch[2], +slashMatch[3], +slashMatch[4]);
  }

  // "MM-DD HH:mm"（横杠，mock 数据等）
  const dashMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (dashMatch) {
    return new Date(now.getFullYear(), +dashMatch[1] - 1, +dashMatch[2], +dashMatch[3], +dashMatch[4]);
  }

  // "YYYY-MM-DD HH:mm"（完整日期，锚定防止误匹配）
  const fullMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})$/);
  if (fullMatch) {
    return new Date(+fullMatch[1], +fullMatch[2] - 1, +fullMatch[3], +fullMatch[4], +fullMatch[5]);
  }

  // 兜底：ISO / 标准格式
  const direct = new Date(input);
  if (!isNaN(direct.getTime())) return direct;

  return null;
}

/**
 * 将日期转换为相对时间描述，用于对话历史列表。
 * 从小到大逐级匹配，向上取整，只保留最大有效单位。
 * - 刚刚（< 60 秒）
 * - x 分钟前（< 60 分钟）
 * - x 小时前（当天内）
 * - x 天前
 * - x 月前
 * - x 年前
 */
export function formatRelativeTime(input: string): string {
  const date = parseDateInput(input);
  if (!date) return input;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = diffMs / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;
  const diffMonths = diffDays / 30;
  const diffYears = diffDays / 365;

  // 从小到大：分钟 → 小时 → 天 → 月 → 年
  if (diffSeconds < 60) return "刚刚";
  if (diffMinutes < 60) return `${Math.ceil(diffMinutes)}分钟前`;
  if (diffHours < 24 && isSameDay(date, now)) return `${Math.ceil(diffHours)}小时前`;
  if (diffDays < 30) return `${Math.ceil(diffDays)}天前`;
  if (diffMonths < 12) return `${Math.ceil(diffMonths)}月前`;
  return `${Math.ceil(diffYears)}年前`;
}

/**
 * 将日期转换为完整时间戳，用于当前打开的对话。
 * 格式：yyyy年MM月dd日 HH:mm
 */
export function formatFullTime(input: string): string {
  const date = parseDateInput(input);
  if (!date) return input;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(year, date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24));

  let prefix = "";
  if (diffDays === 0) prefix = "今天 ";
  else if (diffDays === 1) prefix = "昨天 ";
  else if (year === now.getFullYear()) prefix = `${month}月${day}日 `;
  else prefix = `${year}年${month}月${day}日 `;

  return `${prefix}${hours}:${minutes}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
