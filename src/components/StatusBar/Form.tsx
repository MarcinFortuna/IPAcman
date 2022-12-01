import * as React from "react";
import {signIn, signUp} from "../../api/Firebase";

interface FormProps {
    option: number
}

const Form = (props: FormProps) => {

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data: FormData = new FormData(event.currentTarget);
		let email: string | undefined = (data.get("email"))?.toString();
		let password: string | undefined = (data.get("password"))?.toString();
		if (props.option === 1) {
			if (!email || !password) {
				alert("Enter email and password!");
			} else {
				signIn(email, password);
			}
		} else if (props.option === 2) {
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
		<form className='account-form' onSubmit={handleSubmit}>
			<div className={'account-form-fields ' + (props.option === 1 ? 'sign-in' : (props.option === 2 ? 'sign-up' : 'forgot'))}>
				<input id='email' name='email' type='email' placeholder='E-mail' required />
				<input id='password' name='password' type='password' placeholder='Password' required={props.option === 1 || props.option === 2 ? true : false} disabled={props.option === 3 ? true : false} />
				<input id='repeat-password' name='repeat-password' type='password' placeholder='Repeat password' required={props.option === 2 ? true : false} disabled={props.option === 1 || props.option === 3 ? true : false} />
				<input id='username' name='username' type='username' placeholder='Name' />
				<input id='displayName' name='displayName' type='displayName' placeholder='Display name (it will be used on the leaderboard only)' required={props.option === 2 ? true : false} disabled={props.option === 1 || props.option === 3 ? true : false}/>
				<input id='affiliation' name='affiliation' type='affiliation' placeholder='Affiliation' />
				<div><input type="checkbox" name='gdpr' required={props.option === 2 ? true : false} disabled={props.option === 1 || props.option === 3 ? true : false}/><span className="gdpr">(required) We are collecting your information for the purposes of storing your game results and displaying the best results on the leaderboard. Your personal data will not be used in any other way. By signing up you agree to these conditions and to your data being stored for this purpose. </span></div>
			</div>
			<button className='btn-submit-form' type='submit'>
				{props.option === 1 ? 'Sign in' : (props.option === 2 ? 'Sign up' : 'Reset password')}
			</button>
		</form>
	)
}

export default Form;