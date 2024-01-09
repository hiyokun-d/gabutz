"use client";
import styles from "./user.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

function ProfilePict({ setImageUrl }: { setImageUrl: Function }) {
	const [imageLocalUrl, setLocalImageUrl] = useState("");

	useEffect(() => {
		async function fetchImage() {
			try {
				const response = await axios.get("https://api.waifu.pics/sfw/waifu");
				const url = response.data.url;
				setLocalImageUrl(url);
				setImageUrl(url);
			} catch (error) {
				console.error("Error fetching image:", error);
			}
		}
		fetchImage();
	}, []);

	return (
		<div
			className={styles.profilePict}
			style={{
				backgroundImage: `url(${
					imageLocalUrl ? imageLocalUrl : "/fallback-profile.webp"
				})`,
			}}
		></div>
	);
}

export default function makeUser() {
	const [username, setUsername] = useState<string>("");
	const [imageUrl, setImageUrl] = useState<string>("");
	/* email
"example@gmail.com"
(string)

profilePict
"https://i.waifu.pics/P65Fb_X.jpg"
(string)

uid
"927oadjw987adw89a"
(string)

username
"Jono"
(string) */
	async function submit() {
        const user = auth.currentUser;
		// console.log(username + " " + imageUrl + " " + user?.email);
        const router = useRouter()
		try {
			if (username !== "") {
				await addDoc(collection(db, "user"), {
					email: user?.email,
					uid: user?.uid,
					profilePict: imageUrl,
					username: username,
				}).then(() => {
                    router.push("/chat")
                })
				setUsername("");
			}
		} catch (error) {
			console.error("Error for adding a new user: " + error);
		}
	}

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Enter") {
			event.preventDefault();
			submit();
		}
	}

	return (
		<div
			className={`${styles.container} flex justify-center items-center w-screen h-screen`}
		>
			<div className={`${styles.userContainer}`}>
				<ProfilePict setImageUrl={setImageUrl} />

				<form onSubmit={submit}>
					<input
						type="text"
						placeholder="YOUR NAME"
						onChange={(e) => setUsername(e.target.value)}
						maxLength={15}
						minLength={4}
						onKeyDown={handleKeyPress} // Call handleKeyPress on "Enter" key press
					/>
					<button type="submit">LET'S GO</button>
				</form>
			</div>
		</div>
	);
}
