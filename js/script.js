
const previewChartContainer = document.getElementById('preview-accordion');
let headerBackgroundColor = "#0b6396";
let bodyBackgroundColor = "#FFF";
let bodyColor = "#000";
let headerColor = "#fff";

previewChartContainer.addEventListener('input', generateHTML);


function generateHTML() {
	let editorContent = document.getElementById('preview-accordion').innerHTML;
	editorContent = editorContent.replaceAll('contenteditable="true"', '');
	editorContent = editorContent.replaceAll('spellcheck="false"', '');
	editorContent = editorContent.replace(/<b>(.*?)<\/b>/g, '<strong>$1</strong>');
	editorContent = editorContent.replace(/<i>(.*?)<\/i>/g, '<em>$1</em>');
	editorContent = editorContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');
	editorContent = editorContent.replace(/<u>(.*?)<\/u>/g, '<span style="text-decoration: underline;">$1</span>');

	const htmlOutput = document.getElementById('generated-html');
	const formattedHTML = html_beautify(editorContent);
	htmlOutput.textContent = formattedHTML;
	Prism.highlightElement(htmlOutput);
}

function updateHTML() {

	let editorContent = document.getElementById('preview-accordion');
	let accordionHeader = editorContent.querySelector('details.fancy-accordion > summary');
	let accordionBody = editorContent.querySelector('details.fancy-accordion');
	accordionHeader.style.backgroundColor = headerBackgroundColor;
	accordionHeader.style.color = headerColor;
	accordionBody.style.backgroundColor = bodyBackgroundColor;
	accordionBody.style.color = bodyColor;
	accordionBody.style.borderColor = headerBackgroundColor;
	generateHTML();
}

function generateCSS() {
	const cssOutput = document.getElementById('generated-css');
	cssOutput.textContent = `/*Fancy Accordion*/

.fancy-accordion-wrapper {

margin-bottom: 60px;

position: relative;

}

details.fancy-accordion {

margin-bottom: -45px;

border-radius: 15px;

border: 1px solid #0b6396;

background-color: #fff;

color: #000;

padding: 0px;

}

details.fancy-accordion > summary {

padding: 10px;

font-size: 1.25em;

text-indent: 30px;

background-color: #0b6396;;

color: #fff;

border: none;

cursor: pointer;

border-radius: 10px 10px 10px 10px; }

details.fancy-accordion[open] > summary {

border-radius: 10px 10px 0 0;

}

.collapsed {

padding: 20px;

margin-bottom: 10px; }

/* # The Rotating Marker # */

details.fancy-accordion summary::marker {

display: none;

content: ""; }

details.fancy-accordion summary::before {

content: "▶";

left: -0.6em;

position: absolute;

transform: rotate();

transform-origin: 70% 50%;

transition: 0.2s transform ease; }

details.fancy-accordion[open] > summary:before {

transform: rotate(90deg);

transform: ease 1s; }

/* # The Sliding Summary # */

@keyframes details-show {

from {

opacity: 0;

transform: var(--details-translate, translateY(-0.5em)); } }

details.fancy-accordion[open] > *:not(summary) {

animation: details-show 750ms ease-in-out; }

/* End of Accordion */
	`
	Prism.highlightElement(cssOutput);
}

function execCmd(command, value = null) {

	if (command === 'createLink') {
		const url = prompt("Enter the URL");
		if (url) {
			document.execCommand(command, false, url);
		}
	} else {
		document.execCommand(command, false, value);
	}
	generateHTML();
}

function applyHeaderBgColor(color) {
	headerBackgroundColor = color;
	updateHTML();
}

function applyBodyFontColor(color) {
	bodyColor = color;
	updateHTML();
}

function applyHeaderFontColor(color) {
	headerColor = color;
	updateHTML();
}

function applyBodyBgColor(color) {
	bodyBackgroundColor = color;
	updateHTML();
}

function openTab(evt, tab) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tab).style.display = "block";
	evt.currentTarget.className += " active";
}

function copy(id) {
	let codeText = document.getElementById(id).textContent;
	navigator.clipboard.writeText(codeText);
	const copyButton = document.getElementById(`btn-copy-${id}`);
	const originalText = '<i class="fa-regular fa-copy"></i>Copy';
	copyButton.innerHTML = '<i class="fa-solid fa-check"></i>Copied!';

	setTimeout(() => {
			copyButton.innerHTML = originalText;
	}, 2000);
};

function startup() {
	generateCSS();
	generateHTML();
}




