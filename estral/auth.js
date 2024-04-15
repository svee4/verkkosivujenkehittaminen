
/**
 * @typedef UserData
 * @property {string} username
 * @property {string} password plaintext password! this should be hashed but im not bothering with that for this website
 * @property {string} [profilePicture]
 */

/**
 * Key is username
 * @typedef {{string: UserData}} LocalData
 */

/**
 * Get logged in user data or null of not logged in
 * @returns {UserData | null}
 */
export const getUser = () => {
	const currentuser = localStorage["currentuser"];
	if (!currentuser) return null;
	const localdata = getLocalData();
	const data = localdata[currentuser];
	if (!data) return null;
	return data;
}

export const isLoggedIn = () => {
	return !!getUser();
}

/** 
 * Tries to authenticate with the provided username and password.<br>
 * If such username does not exists, returns the string "username".<br>
 * If the username exists, but the password is incorrect, returns the string "password".<br>
 * Else, returns the matching user.
 * @returns {"username" | "password" | UserData} 
 */
export const tryLogin = (/** @type {string} */ username, /** @type {string} */ password) => {
	const data = getLocalData();
	const userdata = data[username];
	if (!userdata) return "username";
	if (password !== userdata.password) return "password";
	localStorage["currentuser"] = username;
	return userdata;
}

/**
 * Tries to register new user.
 * If username or password is unsuitable, returns "badparams.<br>
 * If username is already in used, returns "exists".<br>
 * Else registers user and returns data
 * @returns {"badparams"|"exists"|UserData}
 */
export const tryRegister = (/** @type {string} */ username, /** @type {string} */ password) => {
	if (!username || !password) return "badparams";
	if (tryLogin(username, password) !== "username") {
		// already exists
		return "exists";
	}
	const data = /** @type {UserData} */ {
		username, 
		password
	}
	setUserData(data);
	return data;
}

/**
 * Returns "exists" if username is in use
 * @returns {"exists"|null}
 */
export const changeUsername = (/** @type {string} */ username) => {
	const exists = !!getLocalData()[username];
	if (exists) return "exists";
	const data = getUser();
	if (!data) throw new Error("Tried to change username without being logged in");
	
	// remove old data
	removeUserData(data.username);
	data.username = username;
	setUserData(data);
	tryLogin(username, data.password);
}

export const setProfilePicture = (/** @type {string} */ dataUrl) => {
	const data = getUser();
	if (!data) return false;
	data.profilePicture = dataUrl;
	setUserData(data);
	return true;
}

export const logout = () => {
	localStorage.removeItem("currentuser");
}

/** @returns {LocalData} */
const getLocalData = () => {
	const str = localStorage["localdata"];
	return str ? JSON.parse(str) : /** @type {LocalData} */ {};
}

const setLocalData = (/** @type {LocalData} */ data) => {
	localStorage["localdata"] = JSON.stringify(data);
}

const setUserData = (/** @type {UserData} */ userdata) => {
	const data = getLocalData();
	if (data[userdata.username]) {
		data[userdata.username] = { ...data[userdata.username], ...userdata };
	}
	else {
		data[userdata.username] = userdata;
	}
	setLocalData(data);
}

const removeUserData = (username) => {
	const data = getLocalData();
	if (data[username]) {
		delete data[username];
	}
	setLocalData(data);
}