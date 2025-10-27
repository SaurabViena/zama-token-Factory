"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function WalletButton() {
  return (
    <ConnectButton
      chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
      accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
      showBalance={{ smallScreen: false, largeScreen: true }}
    />
  );
}


