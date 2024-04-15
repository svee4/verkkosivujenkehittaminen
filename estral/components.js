export { }

window.customElements.define("header-content", class extends HTMLElement {
	constructor() { super(); }

	connectedCallback() {
		const container = this.appendChild(document.createElement("div"));
		const prefix = "hc";
		container.innerHTML = `
<div class="${prefix}-left">
	<div>
		<img />
	</div>
	<nav>
		<ul>
			<li><a href="./search">Search</a></li>
			<li><a href="./upload">Upload</a></li>
		</ul>
	</nav>
</div>
<div class="${prefix}-right">
	<a href="./login">Log in</a>
	<button onclick="const menu = this.nextElementSibling; menu.style.display = menu.style.display == 'none' ? '' : 'none';" >Menu</button>
	<menu class="${prefix}-menu" style="display: none;">
		<nav>
			<ul>
				<li><a href="./index">Home</a></li>
				<li><a href="./search">Search</a></li>
				<li><a href="./upload">Upload</a></li>
				<li><a href="./profile">Profile</a></li>
				<li><a href="./about">About</a></li>
			</ul>
		</nav>
	</menu>
</div>
		`;
	}
});