export default function formatMessageTime(dateStr: number) {
  const date = new Date(dateStr);
  const now = new Date();

  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // hoje → mostra só a hora
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "ontem";
  } else if (diffDays === 2) {
    return "anteontem";
  } else {
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  }
}
