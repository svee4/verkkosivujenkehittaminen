
/**
 * @typedef UserData
 * @property {string} username
 * @property {string} password plaintext password! this should be hashed but im not bothering with that for this website
 * @property {string} [profilePicture]
 */

/**
 * Key is username
 * @typedef {{string: UserData}} LocalUserData
 */

/**
 * @typedef {{username: string; title: string; description: string; base64url: string; id: string;}} ImageData
 */

/**
 * @typedef {ImageData[]} LocalImageData
 */

/**
 * Get logged in user data or null of not logged in
 * @returns {UserData | null}
 */
export const getUser = () => {
	const currentuser = localStorage["currentuser"];
	if (!currentuser) return null;
	const localUserData = getLocalUserData();
	const data = localUserData[currentuser];
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
	const localUserData = getLocalUserData();
	const userdata = localUserData[username];
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
	const localUserData = getLocalUserData();
	if (localUserData[username]) {
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
	const exists = !!getLocalUserData()[username];
	if (exists) return "exists";
	const data = getUser();
	if (!data) throw new Error("Tried to change username without being logged in");
	
	// remove old data
	removeUserData(data.username);
	// change username for images
	setLocalImageData(getLocalImageData().map(item => item.username !== data.username ? item : {...item, username}));
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


/**
 * 
 * @returns {LocalImageData}
 */
export const getLocalImageData = () => {
	const str = localStorage["localimagedata"]
	return str ? JSON.parse(str) : [];
}

const setLocalImageData = (/** @type {LocalImageData} */ data) => {
	localStorage["localimagedata"] = JSON.stringify(data);
}

/**
 * Returns a string representing the error reason, or the generated id if successful
 * @param {{title: string; description: string?; base64url: string}} params
 * @returns {"unauthenticated"|"title"|"url"|"dupetitle"|"string"}
 */
export const uploadImage = (params) => {
	if (!isLoggedIn()) return "unauthenticated";
	if (!params.title) return "title";
	if (!params.base64url) return "url";
	params.description ??= "";
	
	const data = /** @type {ImageData} */ { ...params, username: getUser().username };
	const existing = getLocalImageData();

	if (existing.some(ex => ex.username === data.username && ex.title === data.title))
		return "dupetitle";

	do {
		data.id = crypto.randomUUID();
	} while (existing.some(ex => ex.id === data.id));
	
	existing.push(data);
	setLocalImageData(existing);
	return data.id;
}

/**
 * Returns string describing error, or null if successful
 * @param id
 * @returns {"badid"|"wronguser"|null}
 */
export const deleteImage = (/** @type {string} */ id) => {
	const data = getLocalImageData();
	const image = data.find(item => item.id === id);
	if (!image) return "badid";
	if (image.username !== getUser().username) return "wronguser";
	const newdata = data.filter(item => item.id !== id);
	setLocalImageData(newdata);
	return null;
}

/** @returns {LocalUserData} */
const getLocalUserData = () => {
	const str = localStorage["localuserdata"];
	return str ? JSON.parse(str) : /** @type {LocalUserData} */ {};
}

const setLocalUserData = (/** @type {LocalUserData} */ data) => {
	localStorage["localuserdata"] = JSON.stringify(data);
}

const setUserData = (/** @type {UserData} */ userdata) => {
	const data = getLocalUserData();
	if (data[userdata.username]) {
		data[userdata.username] = { ...data[userdata.username], ...userdata };
	}
	else {
		data[userdata.username] = userdata;
	}
	setLocalUserData(data);
}

const removeUserData = (username) => {
	const data = getLocalUserData();
	if (data[username]) {
		delete data[username];
	}
	setLocalUserData(data);
}