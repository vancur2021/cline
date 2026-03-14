import { geminiModels } from "@shared/api"
import { Mode } from "@shared/storage/types"
import { VSCodeDropdown, VSCodeOption, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { ApiKeyField } from "../common/ApiKeyField"
import { BaseUrlField } from "../common/BaseUrlField"
import { ModelInfoView } from "../common/ModelInfoView"
import { DropdownContainer, ModelSelector } from "../common/ModelSelector"
import ThinkingBudgetSlider from "../ThinkingBudgetSlider"
import { normalizeApiConfiguration } from "../utils/providerUtils"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

// Gemini models that support thinking/reasoning mode
const SUPPORTED_THINKING_MODELS = [
	"gemini-3-pro-preview",
	"gemini-2.5-pro",
	"gemini-2.5-flash",
	"gemini-2.5-flash-lite-preview-06-17",
]

/**
 * Props for the GeminiProvider component
 */
interface GeminiProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Gemini provider configuration component
 */
export const GeminiProvider = ({ showModelOptions, isPopup, currentMode }: GeminiProviderProps) => {
	const { apiConfiguration } = useExtensionState()
	const { handleFieldChange, handleModeFieldChange } = useApiConfigurationHandlers()

	// Get the normalized configuration
	const { selectedModelId, selectedModelInfo } = normalizeApiConfiguration(apiConfiguration, currentMode)

	const geminiThinkingLevel =
		currentMode === "plan" ? apiConfiguration?.geminiPlanModeThinkingLevel : apiConfiguration?.geminiActModeThinkingLevel

	return (
		<div>
			<ApiKeyField
				initialValue={apiConfiguration?.geminiApiKey || ""}
				onChange={(value) => handleFieldChange("geminiApiKey", value)}
				providerName="Gemini"
				signupUrl="https://aistudio.google.com/apikey"
			/>

			<BaseUrlField
				initialValue={apiConfiguration?.geminiBaseUrl}
				label="Use custom base URL"
				onChange={(value) => handleFieldChange("geminiBaseUrl", value)}
				placeholder="Default: https://generativelanguage.googleapis.com"
				quickUrls={[
					{ label: "本地代理", url: "http://127.0.0.1:5345" },
					{ label: "Antigravity", url: "https://anti.8972464.xyz" },
				]}
			/>

			{showModelOptions && (
				<>
					<ModelSelector
						label="Model"
						models={geminiModels}
						onChange={(e: any) =>
							handleModeFieldChange(
								{ plan: "planModeApiModelId", act: "actModeApiModelId" },
								e.target.value,
								currentMode,
							)
						}
						selectedModelId={selectedModelId}
					/>

					<div style={{ marginTop: 10 }}>
						<VSCodeCheckbox
							checked={apiConfiguration?.geminiAlwaysIncludeThoughts || false}
							onChange={(e: any) => handleFieldChange("geminiAlwaysIncludeThoughts", e.target.checked)}>
							Include Thoughts in Response (Always)
						</VSCodeCheckbox>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							Force Gemini to include its thinking process in the response, even if not explicitly requested.
						</p>
					</div>

					<div style={{ marginTop: 10 }}>
						<VSCodeCheckbox
							checked={apiConfiguration?.geminiUseThinkingTag || false}
							onChange={(e: any) => handleFieldChange("geminiUseThinkingTag", e.target.checked)}>
							Require thinking tag in Prompt
						</VSCodeCheckbox>
						<p
							style={{
								fontSize: "12px",
								marginTop: "5px",
								color: "var(--vscode-descriptionForeground)",
							}}>
							Adds instructions to the system prompt requiring the model to output its thought process in thinking tags.
						</p>
					</div>

					{/* When ThinkLevel is set, thinking budget cannot be adjusted and must be enabled */}
					{SUPPORTED_THINKING_MODELS.includes(selectedModelId) &&
						!selectedModelInfo.thinkingConfig?.geminiThinkingLevel && (
							<ThinkingBudgetSlider
								currentMode={currentMode}
								maxBudget={selectedModelInfo.thinkingConfig?.maxBudget}
							/>
						)}

					{selectedModelInfo.thinkingConfig?.supportsThinkingLevel && (
						<DropdownContainer className="dropdown-container" style={{ marginTop: "8px" }} zIndex={1}>
							<label htmlFor="thinking-level">
								<span className="font-medium">Thinking Level</span>
							</label>
							<VSCodeDropdown
								className="w-full"
								id="thinking-level"
								onChange={(e: any) =>
									handleModeFieldChange(
										{ plan: "geminiPlanModeThinkingLevel", act: "geminiActModeThinkingLevel" },
										e.target.value,
										currentMode,
									)
								}
								value={geminiThinkingLevel || "high"}>
								<VSCodeOption value="low">Low</VSCodeOption>
								<VSCodeOption value="high">High</VSCodeOption>
							</VSCodeDropdown>
						</DropdownContainer>
					)}

					<ModelInfoView isPopup={isPopup} modelInfo={selectedModelInfo} selectedModelId={selectedModelId} />
				</>
			)}
		</div>
	)
}
