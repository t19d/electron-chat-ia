// import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f32_1-MLC-1k";
// const SELECTED_MODEL = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";

export class ChatIA {
	constructor($loadingProgress) {
		this.engine = null;
		this.selectedModel = SELECTED_MODEL;
		this.$loadingProgress = $loadingProgress;
		this.#init();
	}

	async #init() {
		this.engine = await CreateMLCEngine(this.selectedModel, { initProgressCallback: (progressInfo) => this.initProgressCallback(progressInfo) });
	}

	initProgressCallback(progressInfo) {
		console.log('🧐 progressInfo', progressInfo);
		const textProgress = progressInfo.text ?? "";
		if (this.$loadingProgress) {
			this.$loadingProgress.textContent = `${textProgress}`;
		} else {
			console.log("🧐 textProgress", textProgress);
		}
	}

	async changeModel(selectedModel) {
		this.selectedModel = selectedModel;
		await this.engine.reload(selectedModel);
	}


}
