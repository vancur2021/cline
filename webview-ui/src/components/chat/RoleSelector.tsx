import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react"
import { memo } from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { updateSetting } from "../settings/utils/settingsHandlers"

const RoleSelector = () => {
	const { customRoles, currentRole } = useExtensionState()

	const allRoles = [{ name: "Senior Software Engineer", description: "Default role" }, ...(customRoles || [])]

	const selectedRole = currentRole || "Senior Software Engineer"

	return (
		<div className="flex items-center mr-2">
			<VSCodeDropdown
				className="min-w-[120px]"
				onChange={(e: any) => updateSetting("currentRole", e.target.value)}
				value={selectedRole}>
				{allRoles.map((role) => (
					<VSCodeOption key={role.name} value={role.name}>
						{role.name}
					</VSCodeOption>
				))}
			</VSCodeDropdown>
		</div>
	)
}

export default memo(RoleSelector)
