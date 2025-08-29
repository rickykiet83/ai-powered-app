import './App.css'

import { useEffect, useState } from 'react';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetch('/api/hello')
			.then((res) => res.json())
			.then((data) => setMessage(data.message));
	}, []);

	return <p>{message}</p>;
}

export default App
