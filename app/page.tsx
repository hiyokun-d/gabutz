"use client";

import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				router.push("/login");
			} else {
				router.push("/chat");
			}
		});

		return () => {
			// Unsubscribe when the component unmounts
			unsubscribe();
		};
	}, [router]);
	return <h1>CHECK IF YOU HAVE AN ACCOUNT OR NOT!!</h1>;
}
