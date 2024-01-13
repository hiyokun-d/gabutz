"use client";

import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebase";
import styles from "./login.module.css";
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithRedirect,
	getRedirectResult,
} from "firebase/auth";
import { useState } from "react";

function google() {
	const provider = new GoogleAuthProvider();
	signInWithRedirect(auth, provider);
	getRedirectResult(auth)
		.then((result) => {
			const user = result?.user;
			console.log(user);
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);

			console.error(
				errorCode + " " + errorMessage + " " + email + " " + credential
			);
		});
}

function CreateAccount() {
	const router = useRouter();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	function create(
		event: React.FormEvent<HTMLFormElement>,
		email: string,
		password: string
	): any {
		event.preventDefault(); // Prevent form submission's default behavior
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				setEmail("");
				setPassword("");
				router.push("/makeUser");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode + " => " + errorMessage);
			});
	}

	return (
		<form onSubmit={(e) => create(e, email, password)}>
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Example@gmail.com"
				maxLength={25}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="password"
				name="your password"
				id="password"
				placeholder="password"
				minLength={8}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<button type="submit">Let's sign in</button>
		</form>
	);
}

function SignUp() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	function submit(
		event: React.FormEvent<HTMLFormElement>,
		email: string,
		password: string
	) {
		event.preventDefault(); // Prevent form submission's default behavior
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// User created
				const user = userCredential.user;
				router.push("/chat");
				console.log(user);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode + " => " + errorMessage);
			});
	}

	return (
		<form onSubmit={(e) => submit(e, email, password)}>
			<input
				type="email"
				name="email"
				id="email"
				placeholder="Example@gmail.com"
				maxLength={25}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<input
				type="password"
				name="your password"
				id="password"
				placeholder="password"
				minLength={8}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<button type="submit">Let's go</button>
		</form>
	);
}


export default function Login() {
	const [login, setLogin] = useState<boolean>(true);

	return (
		<div className={`${styles.background} w-screen h-screen`}>
			<div className={`${styles.container}`}>
				<h1>gabutz</h1>
				<p>{login ? "Welcome Back!" : "Welcome!"}</p>

				<div className={styles.containerLine}>
					<div className={`${styles.line}`}></div>
				</div>

				<main className={`${styles.inputContainer}`}>
					{/* createAccount */}
					{login ? <SignUp /> : <CreateAccount />}
					{/* --------------------------------------------------------------- */}

					<div className={styles.containerLine}>
						<div className={`${styles.line} relative top-5`}></div>
					</div>

					<p className=" text-xs">
						Don't want to use your email? use this instead!
					</p>

					<button onClick={google} className={`${styles.googles}`}>
						<p className="relative right-5">Sign in with google</p>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							className=" absolute left-40 bottom-0"
							width="24"
							height="25"
							preserveAspectRatio="xMidYMid"
							viewBox="0 0 256 262"
							id="google"
						>
							<path
								fill="#4285F4"
								d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
							></path>
							<path
								fill="#34A853"
								d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
							></path>
							<path
								fill="#FBBC05"
								d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
							></path>
							<path
								fill="#EB4335"
								d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
							></path>
						</svg>
					</button>

					<div className={styles.containerLine}>
						<div className={`${styles.line} relative top-5`}></div>
					</div>
					<p>
						{login ? "Didn't have any account? " : "Already have an account?"}
					</p>
					<button
						className={styles.login}
						onClick={() => setLogin((prevLogin) => !prevLogin)}
					>
						{login ? "Make one" : "Login"}
					</button>
				</main>
			</div>
		</div>
	);
}
