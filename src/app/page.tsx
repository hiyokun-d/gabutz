"use client";
import { db } from "@/firebase/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import gsap from "gsap";
import { useState, useRef, useEffect, ChangeEvent } from "react";



function Bubbles({ Message, Who }: Message): any {
	//* CHAT BUBBLES
	return (
		<div className="outline-3 outline-white mt-2 flex mb-10">
			<p
				className={`
        p-4 max-w-[80%] 
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
				textareaRef.current.style.height = `${Math.min(
					textareaRef.current.scrollHeight,
					maxHeight
				)}px`;
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
					placeholder="Hello World"
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

export default function Home() {
	const [messages, setMessages] = useState<Array<object>>([])
useEffect(() => {
	const collectionRef = collection(db, "messages");

	const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
		const messageData:Array<object> = []
		querySnapshot.forEach((doc) => {
			       messageData.push({ id: doc.id, ...doc.data() });
			// Access individual document properties using doc.data()
		});

		setMessages(messageData)
	});

	return () => {
		// Unsubscribe when the component unmounts
		unsubscribe();
	};
}, []);

	return (
		<>
			<div className="message">
				{messages.map((message: any): any => {
					return <Bubbles Message={message.message} Who={message.from} />
				})}
			</div>

		<InputMessage/>
		</>
	);
}
