
const previewChartContainer = document.getElementById('preview-accordion');
const headerBackgroundColor = "#0b6396";
const bodyBackgroundColor = "#FFFFFF";
const bodyColor = "#000000";
const headerColor = "#ffffff";
let currentlySelectedAccordion = document.getElementById('preview-accordion').querySelector('div.fancy-accordion-wrapper');

let UndoManager = function (){

	this._undoStack = [];
	this._idx = 0;
	this.backup = function (){

		let currentState = {
			headerBg: document.getElementById("headerBg").value, 
			headerColor: document.getElementById("headerColor").value,
			bodyBg: document.getElementById("bodyBg").value,
			bodyColor: document.getElementById("bodyColor").value,
			numAccordions: document.getElementById("numAccordions").value,
			html: document.getElementById('preview-accordion').innerHTML 
			}; 
		this._undoStack.splice(this._idx + 1);
		this._undoStack.push(currentState);
		this._idx = this._undoStack.length - 1;
	};

	this.undo = function() { 

		if (this._idx === 0){

			return;
		}

		let prevState = this._undoStack[--this._idx];

		console.info("prevState: %o", prevState);

		setColourSelectors(prevState.headerBg, prevState.headerColor, prevState.bodyBg, prevState.bodyColor);
		document.getElementById("numAccordions").value = prevState.numAccordions;
		document.getElementById('preview-accordion').innerHTML = prevState.html;
	};
	this.redo = function() {

		if (this._idx === this._undoStack.length - 1){
			
			return;
		}

		let	redoState = this._undoStack[++this._idx];

		setColourSelectors(redoState.headerBg, redoState.headerColor, redoState.bodyBg, redoState.bodyColor);
		document.getElementById('preview-accordion').innerHTML = redoState.html;
		document.getElementById('numAccordions').value = redoState.numAccordions;
		generateHTML();
	}
}

previewChartContainer.addEventListener('input', generateHTML);
let undoManager;


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

		
		let uniformColours = document.getElementById("uniformColours").checked;

		if (uniformColours){

			let editor = document.getElementById("preview-accordion");
			let accordionHeaders = editor.querySelectorAll('details.fancy-accordion > summary');
			let accordionBodies = editor.querySelectorAll('details.fancy-accordion');

			for (let header of accordionHeaders){
				header.style.backgroundColor = document.getElementById("headerBg").value;
				header.style.color = document.getElementById("headerColor").value;
			}

			for (let body of accordionBodies){
				body.style.backgroundColor = document.getElementById("bodyBg").value;
				body.style.color = document.getElementById("bodyColor").value;
				body.style.borderColor = document.getElementById("headerBg").value;
			}
			undoManager.backup();
			generateHTML();
			return;
		}

		let accordionHeader = currentlySelectedAccordion.querySelector('details.fancy-accordion > summary');
		let accordionBody = currentlySelectedAccordion.querySelector('details.fancy-accordion');
		accordionHeader.style.backgroundColor = document.getElementById("headerBg").value;
		accordionHeader.style.color = document.getElementById("headerColor").value;
		accordionBody.style.backgroundColor = document.getElementById("bodyBg").value;
		accordionBody.style.color = document.getElementById("bodyColor").value;
		accordionBody.style.borderColor = document.getElementById("headerBg").value;
		undoManager.backup();
		generateHTML();
		
}

function rgbToHex(rgb) {

	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	  }

	//check if already in hex format
	if (rgb.indexOf('#') === 0){
		return rgb;
	}
	let vals = rgb.substring(rgb.indexOf('(') + 1, rgb.indexOf(')')).split(',');
	let hex = "#";
	for (const val of vals){
		if (!val || val.length === 0){
			continue;
		}
		hex += componentToHex(Number.parseInt(val.trim()));
	}
	return hex;
  }

function setColourSelectors(headerBg, header, bodyBg, body){


	let headerBgSelector = document.getElementById("headerBg");
	let headerColorSelector = document.getElementById("headerColor");
	let bodyBgSelector = document.getElementById("bodyBg");
	let bodyColorSelector = document.getElementById("bodyColor");

	headerBgSelector.value = headerBg.length > 0 ? rgbToHex(headerBg) : headerBackgroundColor;
	headerColorSelector.value = header.length > 0 ? rgbToHex(header) : headerColor;
	bodyBgSelector.value = bodyBg.length > 0 ? rgbToHex(bodyBg) : bodyBackgroundColor;
	bodyColorSelector.value = body.length > 0 ? rgbToHex(body) : bodyColor;

}

function setSelectedAccordion(accordion) {
	
	currentlySelectedAccordion = accordion;
	let accordionHeader = accordion.querySelector('details.fancy-accordion > summary');
	let accordionBody = accordion.querySelector('details.fancy-accordion');

	setColourSelectors(accordionHeader.style.backgroundColor, accordionHeader.style.color, accordionBody.style.backgroundColor, accordionBody.style.color);

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
		

		if (command === 'undo'){

			undoManager.undo();

		} else if (command === 'redo'){
			
			undoManager.redo();
		}
		else{

			document.execCommand(command, false, value);
		}

		
			
	}
	generateHTML();
}

function setNumber(num) {

	
	let preview = document.getElementById("preview-accordion");
	let currentAccordions = preview.querySelectorAll("div.fancy-accordion-wrapper");
	const accordionHTML = `<div class="fancy-accordion-wrapper" onclick="setSelectedAccordion(this)">

                    <details class="fancy-accordion"><summary> Header Content Here </summary>
                    
                    <div class="collapsed">
                    
                    HIDDEN TEXT HERE
                    
                    </div>
                    
                    </details>
                    
                </div>`;

	if (num > currentAccordions.length) {

		for (let i = 0; i < (num - currentAccordions.length); i++){

			preview.innerHTML += accordionHTML;
		}
	}
	else if (num < currentAccordions.length) {

		for (let i = 0; i < (currentAccordions.length - num); i++){

			preview.removeChild(currentAccordions[currentAccordions.length - i - 1]);
		}
	}

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
}

function startup() {
	const colourSelectors = document.querySelectorAll("input[type=color]");
	for (let c of colourSelectors){
		c.addEventListener("change", updateHTML);
	}
	generateCSS();
	generateHTML();
	undoManager = new UndoManager();
	undoManager.backup();
	document.getElementById('preview-accordion').addEventListener("keyup", () => {undoManager.backup()});
}




