import React, { useState } from 'react';
import { signUp, signIn } from './Firebase';

function Form({ option }) {

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.target);
		let email = data.get("email");
		let password = data.get("password");
		if (option === 1) {
			signIn(email, password);
		} else if (option === 2) {
			if (data.get("password") !== data.get("repeat-password")) {
				alert("Your password does not match the repeated password!");
				return;
			} else {
				let name = data.get("username");
				let displayName = data.get("displayName");
				let affiliation = data.get("affiliation");		
				signUp(email, password, name, displayName, affiliation);
			}
		}
	}

	return (
		<form className='account-form' onSubmit={handleSubmit}>
			<div className={'account-form-fields ' + (option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot'))}>
				<input id='email' name='email' type='email' placeholder='E-mail' required />
				<input id='password' name='password' type='password' placeholder='Password' required={option === 1 || option === 2 ? true : false} disabled={option === 3 ? true : false} />
				<input id='repeat-password' name='repeat-password' type='password' placeholder='Repeat password' required={option === 2 ? true : false} disabled={option === 1 || option === 3 ? true : false} />
				<input id='username' name='username' type='username' placeholder='Name' />
				<input id='displayName' name='displayName' type='displayName' placeholder='Display name (it will be used on the leaderboard only)' required/>
				<input id='affiliation' name='affiliation' type='affiliation' placeholder='Affiliation' />
				<div><input type="checkbox" name='gdpr' required/><span class="gdpr">(required) We are collecting your information for the purposes of storing your game results and displaying the best results on the leaderboard. Your personal data will not be used in any other way. By signing up you agree to these conditions and to your data being stored for this purpose. </span></div>
			</div>
			<button className='btn-submit-form' type='submit'>
				{option === 1 ? 'Sign in' : (option === 2 ? 'Sign up' : 'Reset password')}
			</button>
		</form>
	)
}

export function FormContainer() {
	const [option, setOption] = useState(1)

	return (
		<div className='container'>
			<header>
				<div className={'header-headings ' + (option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot'))}>
					<span>Sign in to your account</span>
					<span>Create an account</span>
					<span>Reset your password</span>
				</div>
			</header>
			<ul className='options'>
				<li className={option === 1 ? 'active' : ''} onClick={() => setOption(1)}>Sign in</li>
				<li className={option === 2 ? 'active' : ''} onClick={() => setOption(2)}>Sign up</li>
				<li className={option === 3 ? 'active' : ''} onClick={() => setOption(3)}>Forgot</li>
			</ul>
			<div className='account-form-container'>
				<Form option={option} />
			</div>
		</div>
	)
}