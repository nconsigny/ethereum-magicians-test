import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://ethereum-magicians-test.vercel.app";

// frame preview metadata
const appName = process.env.NEXT_PUBLIC_FRAME_NAME || "Ethereum Magicians";
const buttonText = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT || "View Forum";
const appDescription = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "View the Ethereum Magicians forum.";

const splashImageUrl = `${appUrl}/splash.png`;
// const iconUrl = `${appUrl}/icon.png`;

const framePreviewMetadata = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: buttonText,
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appName,
    description: appDescription,
    openGraph: {
      title: appName,
      description: appDescription,
    },
    other: {
      "fc:frame": JSON.stringify(framePreviewMetadata),
    },
  };
}

export default function Home() {
  return (<App />);
}
