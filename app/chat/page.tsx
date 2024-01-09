"use client";
import { db } from "../../firebase/firebase";
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
} from "firebase/firestore";
import gsap from "gsap";
import { useState, useRef, useEffect, ChangeEvent } from "react";

function Bubbles({ Message, Who }: Message): any {
	//* CHAT BUBBLES
	return (
		<div className="outline-3 outline-white mt-2 flex mb-10">
			<p
				className={`
        p-4 max-w-[80%] h-auto break-words
        ${
					Who === "user"
						? "bg-green-700 rounded-l-lg ml-auto"
						: "bg-sky-500 rounded-r-lg mr-auto"
				}
      `}
			>
				{/* USERNAME */}
				<span
					className={`text-sm font-helvetica ${
						Who === "user" ? "text-right block mb-1" : "text-left block mb-1"
					}`}
				>
					{Who === "user" ? "You" : Who}
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

	useEffect(() => {
		adjustTextareaHeight();
	}, [textInput, maxHeight]);

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
						from: "user",
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
		<div>
			<textarea
				placeholder="Type your message here!"
				className="w-full text-black fixed bottom-0 placeholder:text-center"
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
			// Unsubscribe when the component unmounts
			unsubscribe();
		};
	}, []);

	// Function to scroll to the bottom of the messages container
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollToBottom(); // Scroll to bottom on initial load
	}, [messages]); // Trigger scroll when messages change

	return (
		<>
			<div className="message">
				{messages.map((message: any): any => {
					console.log(message);
					return <Bubbles Message={message.message} Who={message.from} />;
				})}
			</div>

			<div ref={messagesEndRef} />

			<InputMessage />
		</>
	);
}
