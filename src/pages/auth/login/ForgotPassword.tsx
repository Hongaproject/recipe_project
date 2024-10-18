import React, { useEffect, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import styles from './ForgotPassword.module.css';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
	const [name, setName] = useState('');
	const [contact, setContact] = useState('');
	const [email, setEmail] = useState('');
	const [isPasswordReset, setIsPasswordReset] = useState(true);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const auth = getAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setError('');

		if (isPasswordReset) {
			if (!email && !contact) {
				setError('이메일과 연락처를 입력해주세요.');
				return;
			} else if (!email) {
				setError('이메일을 입력해주세요.');
				return;
			} else if (!contact) {
				setError('연락처를 입력해주세요.');
				return;
			}

			try {
				await sendPasswordResetEmail(auth, email);
				setMessage(
					'비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해주세요.'
				);
			} catch (error: unknown) {
				setError('등록된 회원정보가 없습니다.');
			}
		} else {
			if (!name && !contact) {
				setError('이름과 연락처를 입력해주세요.');
				return;
			} else if (!name) {
				setError('이름을 입력해주세요.');
				return;
			} else if (!contact) {
				setError('연락처를 입력해주세요.');
				return;
			}

			setError('등록된 회원정보가 없습니다.');
		}
	};

	// url에 따른 스타일링
	useEffect(() => {
		const currentUrl = window.location.href;

		if (currentUrl.includes('/forgot-password')) {
			document.body.style.backgroundColor = '#fff9e9';
		}

		return () => {
			document.body.style.backgroundColor = '';
		};
	}, []);

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>
				<img src="./src/assets/icon_logo.png" alt="" />
			</h2>
			<div className={styles.toggleContainer}>
				<button
					className={`${styles.toggleButton} ${!isPasswordReset ? styles.active : ''}`}
					onClick={() => {
						setIsPasswordReset(false);
						setError('');
						setMessage('');
					}}
				>
					가입한 이메일 찾기
				</button>
				<button
					className={`${styles.toggleButton} ${isPasswordReset ? styles.active : ''}`}
					onClick={() => {
						setIsPasswordReset(true);
						setError('');
						setMessage('');
					}}
				>
					비밀번호 찾기
				</button>
			</div>
			<form onSubmit={handleSubmit} className={styles.form}>
				{!isPasswordReset ? (
					<>
						<label className={styles.inputLabel}>이름</label>
						<input
							type="text"
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							placeholder="이름을 입력해주세요"
							className={styles.input}
						/>
					</>
				) : (
					<>
						<label className={styles.inputLabel}>이메일</label>
						<input
							type="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							placeholder="이메일을 입력해주세요"
							className={styles.input}
						/>
					</>
				)}

				<label className={styles.inputLabel}>연락처</label>
				<input
					type="tel"
					value={contact}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setContact(e.target.value)
					}
					placeholder="등록한 연락처를 입력해주세요"
					className={styles.input}
				/>

				{error && <div className={styles.errorMessage}>{error}</div>}
				<button type="submit" className={styles.submitButton}>
					확인
				</button>
			</form>
			{message && <div className={styles.message}>{message}</div>}
			<div className={styles.footer}>
				<Link to="/login">로그인</Link> <span>|</span>{' '}
				<Link to="/signup">회원가입</Link>
			</div>
		</div>
	);
};

export default ForgotPassword;
