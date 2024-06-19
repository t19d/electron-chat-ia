import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f32_1-MLC-1k";
// const SELECTED_MODEL = "gemma-2b-it-q4f32_1-MLC";
// const SELECTED_MODEL = "Mistral-7B-Instruct-v0.3-q4f32_1-MLC";
// const SELECTED_MODEL = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";
// const SELECTED_MODEL = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC-1k";
// const SELECTED_MODEL = "RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k";

export class ChatIA {
	constructor(callback) {
		this.engine = null;
		this.selectedModel = SELECTED_MODEL;
		this.#init(callback);
	}

	async #init(callback) {
		this.engine = await CreateMLCEngine(this.selectedModel, { initProgressCallback: callback });
	}

	async changeModel(selectedModel) {
		this.selectedModel = selectedModel;
		await this.engine.reload(selectedModel);
	}
}
