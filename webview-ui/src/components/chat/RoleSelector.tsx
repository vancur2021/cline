import { memo } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { updateSetting } from "../settings/utils/settingsHandlers"

const RoleSelector = () => {
	const { customRoles, currentRole } = useExtensionState()

	const allRoles = [{ name: "Senior Software Engineer", description: "Default role" }, ...(customRoles || [])]

	const selectedRole = currentRole || "Senior Software Engineer"

	return (
		<div className="flex items-center relative group cursor-pointer w-auto">
			<select
				className="w-auto h-[24px] bg-transparent border-none appearance-none cursor-pointer text-xs px-0 py-0 focus:outline-none text-left font-medium hover:underline hover:text-[var(--vscode-textLink-activeForeground)] transition-colors"
				onChange={(e) => updateSetting("currentRole", e.target.value)}
				style={{
					color: "var(--vscode-descriptionForeground)",
				}}
				title="Switch Role"
				value={selectedRole}>
				{allRoles.map((role) => (
					<option
						key={role.name}
						style={{
							backgroundColor: "var(--vscode-dropdown-background)",
							color: "var(--vscode-dropdown-foreground)",
						}}
						value={role.name}>
						{role.name}
					</option>
				))}
			</select>
		</div>
	)
}

export default memo(RoleSelector)
