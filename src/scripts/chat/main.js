import { ChatIA } from "./chat-ia.js";

const USER_ROLE = "user";
const ASSISTANT_ROLE = "assistant";

const $ = (el) => document.querySelector(el);
const $loadingProgress = $("#loading-progress");
const $template = $("#msg-template");
const $messages = $("#chat");
const $form = $("#send-msg");
const $formInput = $("#send-msg input");
const $formButton = $("#send-msg button");

let messages = [];
const chat = new ChatIA($loadingProgress);

$form.addEventListener("submit", async (event) => {
	event.preventDefault();
	await sendMessage();
});

function addMessage(sender, msg) {
	const { $newMessage, $messageText } = createMsgElement(sender, msg);
	$messages.appendChild($newMessage);

	// $container.scrollTop = $container.scrollHeight;
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
	// $container.scrollTop = $container.scrollHeight;
}
