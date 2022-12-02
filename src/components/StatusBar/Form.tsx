import * as React from "react";
import {signIn, signUp} from "../../api/Firebase";
import {Box, Button} from "@chakra-ui/react";

interface FormProps {
    option: number
}

const Form = (props: FormProps) => {

	const {option} = props;

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data: FormData = new FormData(event.currentTarget);
		let email: string | undefined = (data.get("email"))?.toString();
		let password: string | undefined = (data.get("password"))?.toString();
		if (option === 1) {
			if (!email || !password) {
				alert("Enter email and password!");
			} else {
				signIn(email, password);
			}
		} else if (option === 2) {
			if (password && password.length < 6) {
				alert("Your password should have at least 6 characters!");
				return;
			}
			if (data.get("password") !== data.get("repeat-password")) {
				alert("Your password does not match the repeated password!");
				return;
			} else {
				let name: string | undefined = (data.get("username"))?.toString();
				let displayName: string | undefined = (data.get("displayName"))?.toString();
				let affiliation: string | undefined = (data.get("affiliation"))?.toString();
				if (!email || !password || !displayName) {
					alert("Email, password, and name are obligatory fields!");
				} else {
					signUp(email, password, name, displayName, affiliation);
				}
			}
		}
	}

	return (
		<form onSubmit={handleSubmit} style={{
			width: "90%",
			margin: "10px auto",
			display: "flex",
			flexDirection: "column"
		}}>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
				transition: "all 0.4s cubic-bezier(0.785, 0.135, 0.15, 0.86)",
				maxHeight: option === 1 ? "60px" : (option === 2 ? "240px" : "25px"),
				'& input': {
					border: '0',
					marginBottom: '7px',
					padding: '10px',
					fontSize: '1rem',
					fontFamily: 'Nunito, sans-serif',
					color: '#000',
					borderRadius: '5px',
					height: '25px',
					'&:focus': {
						outline: "none"
					},
					'&::placeholder, &::-webkit-input-placeholder, &::-ms-input-placeholder': {
						color: "#aaa"
					}
				}
			}}>
				<input id='email' name='email' type='email' placeholder='E-mail' required />
				<input id='password' name='password' type='password' placeholder='Password' required={option === 1 || option === 2 ? true : false} disabled={option === 3 ? true : false} />
				<input id='repeat-password' name='repeat-password' type='password' placeholder='Repeat password' required={option === 2 ? true : false} disabled={option === 1 || option === 3 ? true : false} />
				<input id='username' name='username' type='username' placeholder='Name' />
				<input id='displayName' name='displayName' type='displayName' placeholder='Display name (it will be used on the leaderboard only)' required={option === 2 ? true : false} disabled={option === 1 || option === 3 ? true : false}/>
				<input id='affiliation' name='affiliation' type='affiliation' placeholder='Affiliation' />
				<Box sx={{
					display: "flex",
					fontSize: "0.7rem"
				}}>
					<input type="checkbox" name='gdpr' required={option === 2 ? true : false} disabled={option === 1 || option === 3 ? true : false}/>
					<span>(required) We are collecting your information for the purposes of storing your game results and displaying the best results on the leaderboard. Your personal data will not be used in any other way. By signing up you agree to these conditions and to your data being stored for this purpose. </span>
				</Box>
			</Box>
			<Button colorScheme='yellow' mr={3} type='submit'
					sx={{
						marginTop: "20px",
						width: "fit-content",
						alignSelf: "flex-end"
					}}>
				{option === 1 ? 'Sign in' : option === 2 ? 'Sign up' : 'Reset password'}
			</Button>
		</form>
	)
}

export default Form;