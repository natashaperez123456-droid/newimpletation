"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { type ComponentProps } from "react";

export const LinkWithChannel = ({
	href,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) => {
	const { channel } = useParams<{ channel?: string }>();

	if (!href.startsWith("/")) {
		return <Link {...props} href={href} />;
	}

	const encodedChannel = encodeURIComponent(channel ?? "");

	// Si es default-channel, no agregar prefijo a la URL (Rewrite se encargará)
	if (encodedChannel === "default-channel") {
		return <Link {...props} href={href} />;
	}

	const hrefWithChannel = `/${encodedChannel}${href}`;
	return <Link {...props} href={hrefWithChannel} />;
};
