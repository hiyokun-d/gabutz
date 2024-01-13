"use client";
import { auth, db } from "../../firebase/firebase";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
} from "firebase/firestore";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import styles from "./styles.module.css"
import Image from "next/image";

function Bubbles({ Message, Who }: Message): any {
		const [currentUsr, setCurrentusr] = useState<object>({});
		const user = auth.currentUser;

			useEffect(() => {
				const collectionRef = collection(db, "user");

				const unsubscribe = onSnapshot(
					query(collectionRef),
					(querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const userData = doc.data();

							if (
								userData.email === user?.email &&
								userData.uid === user?.uid
							) {
								setCurrentusr(userData);
							}
						});
					}
				);

				return () => {
					unsubscribe();
				};
			}, [user]);

	//* CHAT BUBBLES

	 const senderName = currentUsr.username === Who ? "user" : Who;
	return (
		<div className="outline-3 outline-white mt-2 flex mb-14">
			<p
				className={`
        p-4 max-w-[80%] h-auto break-words
        ${
					senderName === "user"
						? "bg-green-700 rounded-l-lg ml-auto"
						: "bg-sky-500 rounded-r-lg mr-auto"
				}
      `}
			>
				{/* USERNAME */}
				<span
					className={`text-sm font-helvetica ${
						senderName === "user" ? "text-right block mb-1" : "text-left block mb-1"
					}`}
				>
					{senderName}
				</span>

				{/* MESSAGE CONTENT */}
				<span>{Message}</span>
			</p>
		</div>
	);
}

function InputMessage() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
	const maxHeight = 200;
	const [textInput, setTextInput] = useState<string>("");
	const [currentUsr, setCurrentusr] = useState<object>({});
	const user = auth.currentUser;

	useEffect(() => {
		adjustTextareaHeight();
	}, [textInput, maxHeight]);

	useEffect(() => {
		const collectionRef = collection(db, "user");

		const unsubscribe = onSnapshot(query(collectionRef), (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const userData = doc.data();

				if (userData.email === user?.email && userData.uid === user?.uid) {
					setCurrentusr(userData);
				}
			});
		});

		return () => {
			unsubscribe();
		};
	}, [user]);

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			gsap.to(textareaRef.current, 0.5, {
				height: `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`,
			});
			// textareaRef.current.style.height =
			setTextareaHeight(textareaRef.current.scrollHeight);
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setTextInput(e.target.value);
		adjustTextareaHeight();
	};

	const handleKeyPress = async (
		e: React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			// Create a new document at the end of Firestore collection when Enter is pressed without Shift
			if (textInput.trim() !== "") {
				try {
					await addDoc(collection(db, "messages"), {
						from: currentUsr.username,
						message: textInput.trim(),
						createdAt: serverTimestamp(),
					});
					setTextInput("");
				} catch (error) {
					console.error("Error adding document: ", error);
				}
			}
		}
	};

	return (
		<div className={`${styles.inputContainer} w-full text-black fixed bottom-0`}>
			<Image src={currentUsr?.profilePict} width={200} height={200} alt="yourPicture" priority placeholder="blur" blurDataURL="data:/fallback-profile.webp" />
			<textarea
				placeholder={`HI! ${currentUsr?.username}`}
				className={`${styles.input} rounded-s-xl placeholder:text-center`}
				ref={textareaRef}
				value={textInput}
				onChange={handleInputChange}
				onKeyDown={handleKeyPress}
				style={{
					resize: "none",
					overflowY: "hidden",
					height: textareaHeight ? `${textareaHeight}px` : "30px",
					width: "100%",
				}}
			/>
		</div>
	);
}

export default function Chat() {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Array<object>>([]);
	const [currentUsr, setCurrentusr] = useState<object>({});
	const router = useRouter();
	const user = auth.currentUser;

	useEffect(() => {
		const collectionRef = collection(db, "messages");

		const unsubscribe = onSnapshot(
			query(collectionRef, orderBy("createdAt", "asc")),
			(querySnapshot) => {
				const messageData: Array<object> = [];
				querySnapshot.forEach((doc) => {
					messageData.push({ id: doc.id, ...doc.data() });
				});

				setMessages(messageData);
			}
		);

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	useEffect(() => {
		if (!user?.email) {
			router.push("/");
			return;
		}
	}, [user]);

	return (
		<>
		<div className="message">
					{messages.map((message: any): any => {
						return (
							<Bubbles
								key={message.id}
								Message={message.message}
								Who={message.from}
							/>
						);
					})}
				</div>
	
				<div ref={messagesEndRef} />
	
			<InputMessage />
		</>
	);
}
