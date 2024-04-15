"use strict";

window.customElements.define("header-content", class extends HTMLElement {
	constructor() { super(); }

	connectedCallback() {
		const container = this.appendChild(document.createElement("div"));
		const prefix = "hc";
		container.innerHTML = `
<div class="${prefix}-left">
	<div>
		<img src="./favicon.png" alt="Page icon" style="height: 36px;" />
	</div>
	<nav>
		<ul>
			<li><a href="./search.html">Search</a></li>
			<li><a href="./upload.html">Upload</a></li>
		</ul>
	</nav>
</div>
<div class="${prefix}-right">
	<a style="display: none;" href="./login.html" id="${prefix}-login">Log in</a>
	<a style="display: none;" href="./profile.html" id="${prefix}-profile">Profile</a>
	<button onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? '' : 'none';" >Menu</button>
	<menu class="${prefix}-menu" style="display: none;">
		<nav>
			<ul>
				<li><a href="./index.html">Home</a></li>
				<li><a href="./search.html">Search</a></li>
				<li><a href="./upload.html">Upload</a></li>
				<li><a href="./profile.html">Profile</a></li>
				<li><a href="./about.html">About</a></li>
				<li id="${prefix}-loginli"  style="display: none;"><a href="./login.html">Log in</a></li>
				<li id="${prefix}-logoutli" style="display: none;"><a href="./logout.html">Log out</a></li>
			</ul>
		</nav>
	</menu>
</div>
		`;
		const script = document.createElement("script");
		script.type = "module";
		script.innerText = `
		import { getUser } from "./auth.js";

		const loginLink = document.getElementById("${prefix}-login");
		const profileLink = document.getElementById("${prefix}-profile");
		
		const loginli = document.getElementById("${prefix}-loginli");
		const logoutli = document.getElementById("${prefix}-logoutli");
        
		const user = getUser();
		if (user) {
			profileLink.style.display = "";
			logoutli.style.display = "";
		} else {
			loginLink.style.display = "";
			loginli.style.display = "";
		}
		`;
		container.appendChild(script);
	}
});