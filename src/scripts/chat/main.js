import { ChatIA } from "./chat-ia.js";

const USER_ROLE = "user";
const ASSISTANT_ROLE = "assistant";

const $ = (el) => document.querySelector(el);
const $loadingProgressStatus = $("#loading-progress .status");
const $loadingProgressTime = $("#loading-progress .time");
const $template = $("#msg-template");
const $messages = $("#chat");
const $form = $("#send-msg");
const $formInput = $("#send-msg input");
const $formButton = $("#send-msg button");

let _timeInterval = null;
const initialTime = new Date();

let messages = [];
const chat = new ChatIA(initProgressCallback);
_timeInterval = setInterval(startTime, 1000);

$form.addEventListener("submit", async (event) => {
	event.preventDefault();
	await sendMessage();
});

// #region Cronometrar Tiempo
function startTime() {
	const now = new Date();
	const elapsedTime = Math.floor((now - initialTime) / 1000);
	// Convertir a minutos y segundos
	const minutes = Math.floor(elapsedTime / 60);
	const seconds = elapsedTime % 60;
	let time = `${seconds}s`;
	if (minutes > 0) time = `${minutes}m ${time}`;
	$loadingProgressTime.textContent = time;
}
// #endregion

// #region Cargar Modelo
function initProgressCallback(progressInfo) {
	console.log("🧐 progressInfo", progressInfo);
	const textProgress = parseProgressInfoText(progressInfo);
	if (textProgress) {
		if ($loadingProgressStatus) {
			$loadingProgressStatus.textContent = `${textProgress}`;
		} else {
			console.log("🧐 textProgress", textProgress);
		}
	} else {
		clearInterval(_timeInterval);
		$loadingProgressTime.textContent = "";
		$loadingProgressStatus.textContent = "";
		$formButton.removeAttribute("disabled");
	}
}

function parseProgressInfoText(progressInfo) {
	const LOADING = "cargando...";
	const FETCHING = "descargando modelo";
	const MODEL = "cargando modelo";
	const GPU = "cargando GPU shader modules";

	if (!progressInfo) return LOADING;
	const text = (progressInfo.text ?? "").trim().toLowerCase();
	if (!text) return LOADING;

	// "Finish loading on WebGPU - nvidia"
	// Indicar que ya se ha terminado el proceso
	if (text.includes("finish")) return null;

	let process = "";
	if (text.includes("fetching")) process = FETCHING;
	if (text.includes("model")) process = MODEL;
	if (text.includes("gpu")) process = GPU;

	let progress = 0;

	// "Start to fetch params"
	// Indicar que está al 0%
	if (text.includes("start")) progress = 0;

	if (text.includes("[") && text.includes("]")) {
		// "Loading GPU shader modules[61/66]: 92% completed, 5 secs elapsed."
		// "Loading model from cache[43/51]: 1658MB loaded. 100% completed, 34 secs elapsed."
		const progressTextMatch = text.match(/\[.*\]/);
		if (progressTextMatch && progressTextMatch.length > 0) {
			const [current, total] = progressTextMatch[0].replace("[", "").replace("]", "").split("/");
			progress = (current / total) * 100;
		}
	}

	let progressInfoText = `${progress.toFixed(2)}%`;
	if (process) progressInfoText += ` - ${process}...`;
	return progressInfoText;
}
// #endregion

// #region Mensajes
async function sendMessage() {
	const inputMessageText = $formInput.value.trim();

	if (inputMessageText !== "") $formInput.value = "";

	addMessage(USER_ROLE, inputMessageText);
	$formButton.setAttribute("disabled", "");

	messages.push({
		role: USER_ROLE,
		content: inputMessageText,
	});

	const chunks = await chat.engine.chat.completions.create({
		messages,
		stream: true,
	});

	let reply = "";

	const $botMessage = addMessage(ASSISTANT_ROLE, "");

	for await (const chunk of chunks) {
		const choice = chunk.choices[0];
		const content = choice?.delta?.content ?? "";
		reply += content;
		$botMessage.textContent = reply;
	}

	$formButton.removeAttribute("disabled");
	messages.push({
		role: ASSISTANT_ROLE,
		content: reply,
	});
	$messages.scrollTop = $messages.scrollHeight;
}

function addMessage(sender, msg) {
	const { $newMessage, $messageText } = createMsgElement(sender, msg);
	$messages.appendChild($newMessage);

	$messages.scrollTop = $messages.scrollHeight;
	return $messageText;
}

function createMsgElement(sender, msg) {
	// clonar el template
	const clonedTemplate = $template.content.cloneNode(true);
	const $newMessage = clonedTemplate.querySelector("li");

	$newMessage.classList.add(sender);
	$newMessage.querySelector(".who").textContent = `${sender}`.toUpperCase();
	const $messageText = $newMessage.querySelector(".text");
	$messageText.textContent = msg;

	return { $newMessage, $messageText };
}
// #endregion
