import { redirect } from "next/navigation";

// Backstop for anything that reaches the not-found boundary rather than the
// catch-all route — e.g. a segment calling notFound() directly. Same policy:
// visitors go home instead of hitting a dead end.
export default function NotFound() {
  redirect("/");
}
