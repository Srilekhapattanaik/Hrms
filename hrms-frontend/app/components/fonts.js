import { Poppins } from "next/font/google";

// same rounded modern font as the reference design
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});