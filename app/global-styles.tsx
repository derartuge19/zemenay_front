"use client";

export function GlobalStyles() {
  return (
    <style jsx global>{
      `
      :root {
        --background: 0 0% 0%;
        --foreground: 0 0% 98%;
        --primary: 142 71% 45%;
        --primary-foreground: 0 0% 98%;
        --card: 0 0% 4%;
        --card-foreground: 0 0% 98%;
        --popover: 0 0% 4%;
        --popover-foreground: 0 0% 98%;
        --secondary: 0 0% 15%;
        --secondary-foreground: 0 0% 98%;
        --muted: 0 0% 15%;
        --muted-foreground: 0 0% 64%;
        --accent: 0 0% 15%;
        --accent-foreground: 0 0% 98%;
        --destructive: 0 84% 60%;
        --destructive-foreground: 0 0% 98%;
        --border: 0 0% 15%;
        --input: 0 0% 15%;
        --ring: 142 71% 45%;
      }
    `}
    </style>
  );
}
