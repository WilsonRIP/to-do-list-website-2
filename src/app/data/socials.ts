export interface SocialLink {
  name: string;
  icon: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Twitter",
    icon: "/social-icons/twitter-x.svg",
    url: "https://x.com/WilsonIIRIP",
  },
  { name: "Discord", icon: "/social-icons/icons8-discord-94.png", url: "#" },
  {
    name: "YouTube",
    icon: "/social-icons/icons8-youtube.svg",
    url: "https://www.youtube.com/@wilsonrip",
  },
  {
    name: "GitHub",
    icon: "/social-icons/icons8-github-94.png",
    url: "https://github.com/wilsonrip",
  },
  {
    name: "Twitch",
    icon: "/social-icons/icons8-twitch-64.png",
    url: "https://www.twitch.tv/wilsoniirip",
  },
];
