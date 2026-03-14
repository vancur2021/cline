import { VSCodeCheckbox, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { useState } from "react"
import { useDebouncedInput } from "../utils/useDebouncedInput"

/**
 * Props for the BaseUrlField component
 */
interface BaseUrlFieldProps {
	initialValue: string | undefined
	onChange: (value: string) => void
	defaultValue?: string
	label?: string
	placeholder?: string
	disabled?: boolean
	showLockIcon?: boolean
	quickUrls?: { label: string; url: string }[]
}

/**
 * A reusable component for toggling and entering custom base URLs
 */
export const BaseUrlField = ({
	initialValue,
	onChange,
	label = "Use custom base URL",
	placeholder = "Default: https://api.example.com",
	disabled = false,
	showLockIcon = false,
	quickUrls,
}: BaseUrlFieldProps) => {
	const [isEnabled, setIsEnabled] = useState(!!initialValue)
	const [localValue, setLocalValue] = useDebouncedInput(initialValue || "", onChange)

	const handleToggle = (e: any) => {
		const checked = e.target.checked === true
		setIsEnabled(checked)
		if (!checked) {
			setLocalValue("")
		}
	}

	return (
		<div>
			<div className="flex items-center gap-2">
				<VSCodeCheckbox checked={isEnabled} disabled={disabled} onChange={handleToggle}>
					{label}
				</VSCodeCheckbox>
				{showLockIcon && <i className="codicon codicon-lock text-(--vscode-descriptionForeground) text-sm" />}
			</div>

			{isEnabled && (
				<div className="flex flex-col gap-2 mt-1">
					<VSCodeTextField
						disabled={disabled}
						onInput={(e: any) => setLocalValue(e.target.value.trim())}
						placeholder={placeholder}
						style={{ width: "100%" }}
						type="text"
						value={localValue}
					/>
					{quickUrls && quickUrls.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{quickUrls.map((item, index) => (
								<span
									key={index}
									className="text-xs px-2 py-1 rounded cursor-pointer hover:bg-[var(--vscode-button-secondaryHoverBackground)] bg-[var(--vscode-button-secondaryBackground)] text-[var(--vscode-button-secondaryForeground)] transition-colors"
									onClick={() => {
										if (!disabled) {
											setLocalValue(item.url)
										}
									}}>
									{item.label}
								</span>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
