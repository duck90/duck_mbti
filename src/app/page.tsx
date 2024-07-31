import Image from "next/image";
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/tests");

  return null;
}
